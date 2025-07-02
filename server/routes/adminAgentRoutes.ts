import { Router } from 'express';
import { requireAdmin } from '../admin-middleware';
import { db } from '../db';
import { realEstateAgents, users } from '@shared/schema';
import { eq, and, count } from 'drizzle-orm';
import { sendHostingerEmail, type EmailOptions } from '../hostinger-email';

const router = Router();

// GET /api/admin/agents - Fetch all agents from database
router.get('/', async (req: any, res) => {
  try {
    // Get agents from database
    const agents = await db
      .select()
      .from(realEstateAgents)
      .orderBy(realEstateAgents.createdAt);

    res.json({
      success: true,
      data: agents
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agents'
    });
  }
});

// GET /api/admin/agents/stats - Get agent statistics
router.get('/stats', async (req: any, res) => {
  try {
    const [totalAgents] = await db
      .select({ count: count() })
      .from(realEstateAgents);

    const [pendingAgents] = await db
      .select({ count: count() })
      .from(realEstateAgents)
      .where(eq(realEstateAgents.status, 'pending'));

    const [approvedAgents] = await db
      .select({ count: count() })
      .from(realEstateAgents)
      .where(eq(realEstateAgents.status, 'approved'));

    res.json({
      success: true,
      totalAgents: totalAgents.count,
      pendingAgents: pendingAgents.count,
      approvedAgents: approvedAgents.count
    });
  } catch (error) {
    console.error('Error fetching agent stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agent statistics'
    });
  }
});

// PATCH /api/admin/agents/:id/approve - Approve agent (requires admin authentication)
router.patch('/:id/approve', requireAdmin, async (req: any, res) => {
  try {
    const agentId = parseInt(req.params.id);
    
    if (isNaN(agentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent ID'
      });
    }

    // Get agent details
    const [agent] = await db
      .select()
      .from(realEstateAgents)
      .where(eq(realEstateAgents.id, agentId));

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    // Update agent status
    await db
      .update(realEstateAgents)
      .set({
        status: 'approved',
        isApproved: true,
        approvedBy: req.user.id,
        approvedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(realEstateAgents.id, agentId));

    // Send approval email
    try {
      const approvalEmailHtml = `
        <h2>Congratulations! Your HKT Agent Application Has Been Approved</h2>
        <p>Hello ${agent.firstName} ${agent.lastName},</p>
        <p>We're excited to inform you that your application to become a Home Krypto Token (HKT) affiliated agent has been approved!</p>
        
        <h3>Your Referral Information:</h3>
        <p><strong>Referral Link:</strong> ${agent.referralLink}</p>
        <p><strong>Your Profile:</strong> https://homekrypto.com/agents/${agent.id}</p>
        
        <h3>SEO Backlink Instructions:</h3>
        <p>To improve your SEO ranking and referral benefits, please add this dofollow link to your website:</p>
        <p><code>&lt;a href="${agent.referralLink}" rel="dofollow"&gt;HKT Real Estate Investment Platform&lt;/a&gt;</code></p>
        
        <p>Welcome to the HKT agent network!</p>
        <p>Best regards,<br>The HKT Team</p>
      `;

      await sendHostingerEmail({
        to: agent.email,
        subject: 'HKT Agent Application Approved - Welcome to Our Network!',
        html: approvalEmailHtml
      });
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
    }

    res.json({
      success: true,
      message: 'Agent approved successfully'
    });
  } catch (error) {
    console.error('Error approving agent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve agent'
    });
  }
});

// PATCH /api/admin/agents/:id/deny - Deny agent application (requires admin authentication)
router.patch('/:id/deny', requireAdmin, async (req: any, res) => {
  try {
    const agentId = parseInt(req.params.id);
    const { reason } = req.body;
    
    if (isNaN(agentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent ID'
      });
    }

    // Get agent details
    const [agent] = await db
      .select()
      .from(realEstateAgents)
      .where(eq(realEstateAgents.id, agentId));

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    // Update agent status
    await db
      .update(realEstateAgents)
      .set({
        status: 'denied',
        isApproved: false,
        rejectionReason: reason || 'Application does not meet current requirements',
        updatedAt: new Date()
      })
      .where(eq(realEstateAgents.id, agentId));

    // Send denial email
    try {
      const denialEmailHtml = `
        <h2>HKT Agent Application Update</h2>
        <p>Hello ${agent.firstName} ${agent.lastName},</p>
        <p>Thank you for your interest in becoming a Home Krypto Token (HKT) affiliated agent.</p>
        <p>After careful review, we are unable to approve your application at this time.</p>
        
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        
        <p>We encourage you to reapply in the future as our requirements may change.</p>
        <p>Thank you for your understanding.</p>
        
        <p>Best regards,<br>The HKT Team</p>
      `;

      await sendHostingerEmail({
        to: agent.email,
        subject: 'HKT Agent Application Status Update',
        html: denialEmailHtml
      });
    } catch (emailError) {
      console.error('Failed to send denial email:', emailError);
    }

    res.json({
      success: true,
      message: 'Agent application denied'
    });
  } catch (error) {
    console.error('Error denying agent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deny agent application'
    });
  }
});

export default router;