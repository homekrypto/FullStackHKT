import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { z } from 'zod';
import { db } from './db-direct';
import { users, sessions, passwordResets, emailVerifications } from '@shared/schema';
import { eq, and, sql } from 'drizzle-orm';
import { sendHostingerEmail, type EmailOptions } from './hostinger-email';

const router = Router();

// JWT secret - in production this should be from environment
const JWT_SECRET = process.env.JWT_SECRET || 'hkt-platform-secret-key-2025';

// Generate secure token
function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Create JWT token
function createJWTToken(userId: number, email: string): string {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify JWT token
function verifyJWTToken(token: string): { userId: number; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
  } catch {
    return null;
  }
}

// Middleware to authenticate requests
async function authenticateUser(req: any, res: any, next: any) {
  try {
    const token = req.cookies.sessionToken;
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify JWT token
    const decoded = verifyJWTToken(token);
    if (!decoded) {
      res.clearCookie('sessionToken');
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Check session in database
    const [session] = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.token, token),
          eq(sessions.userId, decoded.userId),
          sql`${sessions.expiresAt} > NOW()`
        )
      );

    if (!session) {
      res.clearCookie('sessionToken');
      return res.status(401).json({ message: 'Invalid or expired session' });
    }

    // Update last used time
    await db
      .update(sessions)
      .set({ lastUsedAt: new Date() })
      .where(eq(sessions.id, session.id));

    // Get user data
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        isEmailVerified: users.isEmailVerified
      })
      .from(users)
      .where(eq(users.id, decoded.userId));

    if (!user) {
      res.clearCookie('sessionToken');
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    console.log('Session found:', 'yes');
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    console.log('Session found:', 'no');
    console.log('Session invalid or expired');
    res.clearCookie('sessionToken');
    res.status(401).json({ message: 'Invalid session' });
  }
}

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (!user) {
      console.log(`Login failed - user not found: ${normalizedEmail}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password (handle null passwordHash)
    if (!user.passwordHash) {
      console.log(`Login failed - no password hash for user: ${normalizedEmail}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      console.log(`Login failed - invalid password: ${normalizedEmail}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = createJWTToken(user.id, user.email);

    // Store session in database
    const sessionId = generateToken();
    await db.insert(sessions).values({
      userId: user.id,
      token: token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      userAgent: req.headers['user-agent'] || '',
      ipAddress: req.ip || req.connection.remoteAddress || ''
    });

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // Set secure cookie
    res.cookie('sessionToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate referral code
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: normalizedEmail,
        passwordHash,
        firstName: firstName || null,
        lastName: lastName || null,
        referralCode,
        role: 'user',
        isEmailVerified: false
      })
      .returning();

    // Create email verification token
    const verificationToken = generateToken();
    await db.insert(emailVerifications).values({
      userId: newUser.id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    // Send verification email
    try {
      const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email?token=${verificationToken}`;
      const emailHtml = `
        <h2>Welcome to HKT Platform!</h2>
        <p>Hello ${firstName || 'User'},</p>
        <p>Thank you for registering with Home Krypto Token platform. Please verify your email address:</p>
        <a href="${verificationUrl}" style="background: #d4af37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>Or copy this link: ${verificationUrl}</p>
        <p>This link expires in 24 hours.</p>
      `;
      
      await sendHostingerEmail({
        to: normalizedEmail,
        subject: 'Welcome to HKT - Verify Your Email',
        html: emailHtml
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET CURRENT USER
router.get('/me', authenticateUser, async (req: any, res) => {
  res.json(req.user);
});

// LOGOUT
router.post('/logout', authenticateUser, async (req: any, res) => {
  try {
    const token = req.cookies.sessionToken;
    
    // Delete session from database
    await db
      .delete(sessions)
      .where(eq(sessions.token, token));

    res.clearCookie('sessionToken');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase();

    // Check if user exists
    const [user] = await db
      .select({ id: users.id, firstName: users.firstName })
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (!user) {
      // Don't reveal if user exists
      return res.json({ message: 'If that email exists, you will receive a password reset link.' });
    }

    // Create password reset token
    const resetToken = generateToken();
    await db.insert(passwordResets).values({
      userId: user.id,
      token: resetToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    });

    // Send reset email
    try {
      const resetUrl = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`;
      const emailHtml = `
        <h2>Password Reset Request</h2>
        <p>Hello ${user.firstName || 'User'},</p>
        <p>You requested a password reset for your HKT account. Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background: #d4af37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>Or copy this link: ${resetUrl}</p>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `;
      
      await sendHostingerEmail({
        to: normalizedEmail,
        subject: 'HKT - Password Reset Request',
        html: emailHtml
      });
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
    }

    res.json({ message: 'If that email exists, you will receive a password reset link.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // Verify reset token
    const [resetRecord] = await db
      .select()
      .from(passwordResets)
      .where(
        and(
          eq(passwordResets.token, token),
          eq(passwordResets.used, false),
          sql`${passwordResets.expiresAt} > NOW()`
        )
      );

    if (!resetRecord) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update user password
    await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, resetRecord.userId));

    // Mark token as used
    await db
      .update(passwordResets)
      .set({ used: true })
      .where(eq(passwordResets.id, resetRecord.id));

    // Delete all user sessions (force re-login)
    await db
      .delete(sessions)
      .where(eq(sessions.userId, resetRecord.userId));

    // Return beautiful Apple-inspired success page
    const successPageHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful - Home Krypto Platform</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            overflow: hidden;
        }
        .success-container {
            text-align: center;
            animation: fadeInUp 0.8s ease-out;
            max-width: 600px;
            padding: 2rem;
        }
        .checkmark {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            border: 3px solid white;
            margin: 0 auto 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: scaleIn 0.6s ease-out 0.2s both;
        }
        .checkmark svg {
            width: 60px;
            height: 60px;
            stroke: white;
            stroke-width: 3;
            fill: none;
        }
        .success-title {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 1rem;
            animation: fadeInUp 0.6s ease-out 0.3s both;
        }
        .success-message {
            font-size: 1.25rem;
            margin-bottom: 3rem;
            opacity: 0.9;
            animation: fadeInUp 0.6s ease-out 0.4s both;
            line-height: 1.6;
        }
        .action-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            animation: fadeInUp 0.6s ease-out 0.5s both;
        }
        .btn {
            padding: 1rem 2rem;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            min-width: 160px;
        }
        .btn-primary {
            background: white;
            color: #059669;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
        }
        .btn-secondary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
        .security-note {
            margin-top: 3rem;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            animation: fadeInUp 0.6s ease-out 0.6s both;
        }
        .security-note h3 {
            font-size: 1.1rem;
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        .security-note p {
            font-size: 0.95rem;
            opacity: 0.9;
            line-height: 1.5;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.5); }
            to { opacity: 1; transform: scale(1); }
        }
        @media (max-width: 640px) {
            .success-title { font-size: 2.5rem; }
            .action-buttons { flex-direction: column; align-items: center; }
            .btn { width: 100%; max-width: 300px; }
        }
    </style>
</head>
<body>
    <div class="success-container">
        <div class="checkmark">
            <svg viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
        </div>
        
        <h1 class="success-title">Success!</h1>
        
        <p class="success-message">
            Your password has been updated successfully.<br>
            You can now log in with your new password.
        </p>
        
        <div class="action-buttons">
            <a href="/dashboard" class="btn btn-primary">Go to Dashboard</a>
            <a href="/login" class="btn btn-secondary">Log In Now</a>
        </div>
        
        <div class="security-note">
            <h3>🔒 Security Confirmation</h3>
            <p>
                We've secured your account with the new password. If you didn't request this change, 
                please contact our support team immediately.
            </p>
        </div>
    </div>
    
    <script>
        setTimeout(() => {
            const loginBtn = document.querySelector('a[href="/login"]');
            if (loginBtn) {
                loginBtn.style.background = 'rgba(255, 255, 255, 0.4)';
                loginBtn.textContent = 'Redirecting to Login...';
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }
        }, 8000);
    </script>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(successPageHtml);
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// VERIFY EMAIL
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    // Verify email token
    const [verification] = await db
      .select()
      .from(emailVerifications)
      .where(
        and(
          eq(emailVerifications.token, token as string),
          eq(emailVerifications.verified, false),
          sql`${emailVerifications.expiresAt} > NOW()`
        )
      );

    if (!verification) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Mark email as verified
    await db
      .update(users)
      .set({ isEmailVerified: true })
      .where(eq(users.id, verification.userId));

    // Mark verification as used
    await db
      .update(emailVerifications)
      .set({ verified: true })
      .where(eq(emailVerifications.id, verification.id));

    // Auto-login the user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, verification.userId));

    if (user) {
      const token = createJWTToken(user.id, user.email);
      
      // Create session
      await db.insert(sessions).values({
        userId: user.id,
        token: token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      // Set cookie
      res.cookie('sessionToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
    }

    // Redirect to dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// RESEND VERIFICATION EMAIL
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail));
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Delete existing verification token
    await db.delete(emailVerifications).where(eq(emailVerifications.userId, user.id));

    // Create new verification token
    const verificationToken = randomBytes(32).toString('hex');
    await db.insert(emailVerifications).values({
      userId: user.id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    // Send verification email
    try {
      const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email?token=${verificationToken}`;
      const emailHtml = `
        <h2>Email Verification - HKT Platform</h2>
        <p>Hello ${user.firstName || 'User'},</p>
        <p>Please verify your email address to complete your registration:</p>
        <a href="${verificationUrl}" style="background: #d4af37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>Or copy this link: ${verificationUrl}</p>
        <p>This link expires in 24 hours.</p>
      `;
      
      await sendHostingerEmail({
        to: normalizedEmail,
        subject: 'HKT Platform - Verify Your Email',
        html: emailHtml
      });

      res.json({ 
        message: 'Verification email sent successfully',
        email: normalizedEmail
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      res.status(500).json({ message: 'Failed to send verification email' });
    }

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
export { authenticateUser };