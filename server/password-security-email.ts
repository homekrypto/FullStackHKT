import { sendHostingerEmail } from './hostinger-email';

interface PasswordChangeNotificationData {
  userEmail: string;
  userName: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
}

export async function sendPasswordChangeConfirmation(data: PasswordChangeNotificationData): Promise<boolean> {
  const emailHtml = generatePasswordChangeConfirmationEmail(data);
  
  try {
    await sendHostingerEmail({
      to: data.userEmail,
      subject: '🔐 Your password has been changed — Was this you?',
      html: emailHtml
    });
    
    console.log(`Password change confirmation email sent to: ${data.userEmail}`);
    return true;
  } catch (error) {
    console.error('Failed to send password change confirmation email:', error);
    return false;
  }
}

function generatePasswordChangeConfirmationEmail(data: PasswordChangeNotificationData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Changed - Security Notification</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f7fafc;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
        }
        
        .header .subtitle {
            margin: 8px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        
        .content {
            padding: 30px;
        }
        
        .security-icon {
            width: 60px;
            height: 60px;
            background: #f0f9ff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 24px;
        }
        
        .greeting {
            font-size: 18px;
            color: #2d3748;
            margin-bottom: 20px;
        }
        
        .notification-text {
            background: #f7fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #4299e1;
        }
        
        .change-details {
            font-size: 14px;
            color: #4a5568;
            margin: 10px 0;
        }
        
        .section {
            margin: 30px 0;
            padding: 20px;
            border-radius: 8px;
        }
        
        .safe-section {
            background: #f0fff4;
            border: 1px solid #9ae6b4;
        }
        
        .safe-section h3 {
            color: #22543d;
            margin: 0 0 10px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .urgent-section {
            background: #fef5e7;
            border: 1px solid #f6ad55;
        }
        
        .urgent-section h3 {
            color: #c53030;
            margin: 0 0 10px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .urgent-section .warning {
            font-weight: 600;
            color: #c53030;
        }
        
        .action-buttons {
            margin: 20px 0;
            text-align: center;
        }
        
        .btn {
            display: inline-block;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin: 5px;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: #4299e1;
            color: white;
        }
        
        .btn-danger {
            background: #e53e3e;
            color: white;
        }
        
        .footer {
            background: #2d3748;
            color: white;
            padding: 20px 30px;
            text-align: center;
            font-size: 14px;
        }
        
        .footer a {
            color: #90cdf4;
            text-decoration: none;
        }
        
        .separator {
            height: 1px;
            background: #e2e8f0;
            margin: 25px 0;
        }
        
        .support-box {
            background: #edf2f7;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        
        .support-subject {
            background: #fff;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: monospace;
            color: #e53e3e;
            font-weight: 600;
            border: 1px solid #fed7d7;
            display: inline-block;
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🔐 Security Alert</h1>
            <p class="subtitle">Password Change Notification</p>
        </div>
        
        <div class="content">
            <div class="security-icon">🔒</div>
            
            <p class="greeting">Hi ${data.userName},</p>
            
            <div class="notification-text">
                <strong>We wanted to let you know that your account password was successfully changed.</strong>
                <div class="change-details">
                    <strong>When:</strong> ${data.timestamp}<br>
                    ${data.location ? `<strong>Location:</strong> ${data.location}<br>` : ''}
                    ${data.ipAddress ? `<strong>IP Address:</strong> ${data.ipAddress}<br>` : ''}
                </div>
            </div>
            
            <div class="separator"></div>
            
            <div class="section safe-section">
                <h3>👍 If this was you:</h3>
                <p>Great! No further action is needed. Your account is secure and you can continue using your new password.</p>
            </div>
            
            <div class="section urgent-section">
                <h3>❗ If this wasn't you:</h3>
                <p class="warning">This may indicate unauthorized access to your account.</p>
                <p><strong>Please take immediate action:</strong></p>
                <ul>
                    <li>Contact our support team immediately using the subject line below</li>
                    <li>Reset your password again right away</li>
                    <li>Review your recent account activity</li>
                    <li>Enable two-factor authentication if available</li>
                </ul>
                
                <div class="support-box">
                    <p><strong>Contact support with this exact subject:</strong></p>
                    <div class="support-subject">Password Breach - Urgent</div>
                    <p>Email: <a href="mailto:support@homekrypto.com?subject=Password%20Breach%20-%20Urgent">support@homekrypto.com</a></p>
                </div>
                
                <div class="action-buttons">
                    <a href="${process.env.REPLIT_DOMAIN ? `https://${process.env.REPLIT_DOMAIN}` : 'https://homekrypto.com'}/forgot-password" class="btn btn-danger">Reset Password Again</a>
                </div>
            </div>
            
            <div class="separator"></div>
            
            <p style="color: #4a5568; font-size: 14px; text-align: center;">
                <strong>Security Tips:</strong><br>
                • Never share your password with anyone<br>
                • Use a unique password for your HKT account<br>
                • Log out from public or shared devices<br>
                • Contact us immediately if you notice suspicious activity
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Stay safe,</strong><br>
            The HomeKrypto Security Team</p>
            <p style="margin-top: 15px;">
                📩 <a href="mailto:support@homekrypto.com">support@homekrypto.com</a><br>
                🔒 <a href="${process.env.REPLIT_DOMAIN ? `https://${process.env.REPLIT_DOMAIN}` : 'https://homekrypto.com'}">HomeKrypto.com</a> | 
                <a href="${process.env.REPLIT_DOMAIN ? `https://${process.env.REPLIT_DOMAIN}` : 'https://homekrypto.com'}/privacy-policy">Privacy Policy</a>
            </p>
        </div>
    </div>
</body>
</html>
  `;
}

export function getLocationFromIP(ipAddress: string): string {
  // In a production environment, you would use a service like MaxMind GeoIP2 or similar
  // For now, return a placeholder that can be enhanced later
  if (ipAddress.startsWith('127.0.0.1') || ipAddress.startsWith('::1')) {
    return 'Local/Development Environment';
  }
  return 'Location unavailable';
}

export function getUserAgent(userAgent?: string): string {
  if (!userAgent) return 'Unknown Device/Browser';
  
  // Basic user agent parsing - in production, use a proper library
  if (userAgent.includes('Chrome')) return 'Chrome Browser';
  if (userAgent.includes('Firefox')) return 'Firefox Browser';
  if (userAgent.includes('Safari')) return 'Safari Browser';
  if (userAgent.includes('Edge')) return 'Edge Browser';
  
  return 'Unknown Browser';
}