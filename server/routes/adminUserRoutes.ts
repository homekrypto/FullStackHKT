import { Router } from 'express';
import { eq, desc, sql } from 'drizzle-orm';
import { db } from '../db-direct';
import { users, realEstateAgents } from '@shared/schema';
import { sendHostingerEmail } from '../hostinger-email';

const router = Router();

// Get all users with agent counts
router.get('/', async (req, res) => {
  try {
    console.log('Fetching users from database...');
    
    // Get all users with count of agents they've approved
    const usersWithAgentCounts = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        isEmailVerified: users.isEmailVerified,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt,
        agentCount: sql<number>`COALESCE((
          SELECT COUNT(*) 
          FROM ${realEstateAgents} 
          WHERE ${realEstateAgents.approvedBy} = ${users.id}
        ), 0)`
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    console.log(`Found ${usersWithAgentCounts.length} users`);

    res.json({
      success: true,
      data: usersWithAgentCounts
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    // Check if user exists
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deletion of admin users
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    // Check how many agents this user has approved
    const [agentCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(realEstateAgents)
      .where(eq(realEstateAgents.approvedBy, userId));

    console.log(`User ${user.email} has approved ${agentCount.count} agents`);

    // Delete the user (foreign key constraint will set approved_by to NULL automatically)
    await db.delete(users).where(eq(users.id, userId));

    // Send notification email to admin about user deletion
    try {
      await sendHostingerEmail({
        to: 'admin@homekrypto.com',
        subject: '🗑️ User Account Deleted - Admin Notification',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #dc2626;">User Account Deleted</h2>
            
            <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #991b1b; margin-top: 0;">Account Details:</h3>
              <ul style="color: #7f1d1d;">
                <li><strong>Email:</strong> ${user.email}</li>
                <li><strong>Name:</strong> ${user.firstName || 'N/A'} ${user.lastName || 'N/A'}</li>
                <li><strong>Role:</strong> ${user.role || 'user'}</li>
                <li><strong>Agents Approved:</strong> ${agentCount.count}</li>
                <li><strong>Account Created:</strong> ${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</li>
                <li><strong>Deleted At:</strong> ${new Date().toLocaleString()}</li>
              </ul>
            </div>

            ${agentCount.count > 0 ? `
              <div style="background-color: #fffbeb; border: 1px solid #fed7aa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #92400e; margin-top: 0;">Impact on Agents:</h3>
                <p style="color: #78350f;">
                  This user had approved ${agentCount.count} agent(s). The approved_by field for these agents has been automatically set to NULL. 
                  The agents remain active in the system and their approval status is unchanged.
                </p>
              </div>
            ` : ''}

            <p style="color: #374151;">
              This is an automated notification from the HomeKrypto admin system.
            </p>
          </div>
        `
      });
      console.log('User deletion notification sent to admin');
    } catch (emailError) {
      console.error('Failed to send deletion notification email:', emailError);
      // Continue - don't fail the deletion if email fails
    }

    res.json({
      success: true,
      message: `User deleted successfully. ${agentCount.count > 0 ? `${agentCount.count} agent approvals updated.` : ''}`,
      agentCount: agentCount.count
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

export default router;