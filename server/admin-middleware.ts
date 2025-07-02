import { authenticateUser } from './database-auth';
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Admin authentication middleware
export async function requireAdmin(req: any, res: any, next: any) {
  try {
    // First authenticate the user
    await new Promise((resolve, reject) => {
      authenticateUser(req, res, (error: any) => {
        if (error) reject(error);
        else resolve(true);
      });
    });

    // Check if user has admin role
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify admin role in database
    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, req.user.id));

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin authentication error:', error);
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
}

// Check if user is admin (without requiring authentication)
export async function checkAdminRole(userId: number): Promise<boolean> {
  try {
    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId));

    return user?.role === 'admin';
  } catch {
    return false;
  }
}