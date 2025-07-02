import { Router } from 'express';
import { requireAdmin } from '../admin-middleware';
import { db } from '../db-direct';
import { realEstateAgents, agentPages } from '@shared/schema';
import { eq, count } from 'drizzle-orm';
import { sendHostingerEmail } from '../hostinger-email';

const router = Router();

// Utility function to generate country slug
function generateCountrySlug(country: string): string {
  return country.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Utility function to generate SEO-friendly agent slug
function generateAgentSlug(firstName: string, lastName: string): string {
  return `${firstName}-${lastName}`.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Utility function to generate full country-based slug  
function generateCountryBasedSlug(firstName: string, lastName: string, country: string): string {
  const countrySlug = generateCountrySlug(country);
  const agentSlug = generateAgentSlug(firstName, lastName);
  return `${countrySlug}/${agentSlug}`;
}

// Utility function to generate agent page content
function generateAgentPageContent(agent: any): string {
  return `
    <div class="agent-profile">
      <div class="agent-header">
        <h1>${agent.firstName} ${agent.lastName}</h1>
        <p class="agent-title">Crypto & Real Estate Investment Expert</p>
        <p class="agent-company">${agent.company}</p>
      </div>
      
      <div class="agent-details">
        <div class="contact-info">
          <h3>Contact Information</h3>
          <p><strong>Email:</strong> ${agent.email}</p>
          <p><strong>Phone:</strong> ${agent.phone}</p>
          <p><strong>Location:</strong> ${agent.city}, ${agent.state}</p>
          ${agent.website ? `<p><strong>Website:</strong> <a href="${agent.website}">${agent.website}</a></p>` : ''}
          ${agent.linkedIn ? `<p><strong>LinkedIn:</strong> <a href="${agent.linkedIn}">View Profile</a></p>` : ''}
        </div>
        
        <div class="credentials">
          <h3>Professional Credentials</h3>
          <p><strong>License Number:</strong> ${agent.licenseNumber}</p>
          <p><strong>License State:</strong> ${agent.licenseState}</p>
          <p><strong>Years of Experience:</strong> ${agent.yearsExperience}</p>
          ${agent.languagesSpoken?.length ? `<p><strong>Languages:</strong> ${agent.languagesSpoken.join(', ')}</p>` : ''}
        </div>
        
        <div class="specializations">
          <h3>Specializations</h3>
          ${agent.specializations?.length ? `<ul>${agent.specializations.map((spec: string) => `<li>${spec}</li>`).join('')}</ul>` : '<p>Real Estate Investment</p>'}
        </div>
        
        <div class="bio">
          <h3>About ${agent.firstName}</h3>
          <p>${agent.bio || `${agent.firstName} ${agent.lastName} is a professional real estate agent specializing in cryptocurrency-based property investments through the HomeKrypto platform.`}</p>
        </div>
        
        <div class="hkt-services">
          <h3>Crypto Real Estate Investment Services</h3>
          <p>Partner with ${agent.firstName} to invest in premium real estate using cryptocurrency through the HomeKrypto platform. Our innovative approach combines traditional real estate expertise with cutting-edge blockchain technology.</p>
          
          <ul>
            <li>Cryptocurrency-based property investments</li>
            <li>HKT token portfolio management</li>
            <li>Fractional real estate ownership</li>
            <li>Property tokenization consulting</li>
            <li>Cross-border crypto real estate transactions</li>
          </ul>
          
          <div class="cta">
            <h4>Ready to Invest?</h4>
            <p>Contact ${agent.firstName} directly or visit <a href="https://homekrypto.com">HomeKrypto.com</a> to start your crypto real estate investment journey today.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// GET /api/admin/agents - Fetch all agents from database
router.get('/', async (req: any, res) => {
  try {
    console.log('Fetching agents from database...');
    
    const agents = await db
      .select()
      .from(realEstateAgents)
      .orderBy(realEstateAgents.createdAt);

    console.log(`Found ${agents.length} agents`);

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

// GET /api/admin/agents/:id - Get single agent details
router.get('/:id', requireAdmin, async (req: any, res) => {
  try {
    const agentId = parseInt(req.params.id);
    
    if (isNaN(agentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent ID'
      });
    }

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

    res.json({
      success: true,
      data: agent
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agent'
    });
  }
});

// PUT /api/admin/agents/:id - Update agent details
router.put('/:id', requireAdmin, async (req: any, res) => {
  try {
    const agentId = parseInt(req.params.id);
    const updateData = req.body;
    
    if (isNaN(agentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent ID'
      });
    }

    const [updatedAgent] = await db
      .update(realEstateAgents)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(realEstateAgents.id, agentId))
      .returning();

    if (!updatedAgent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.json({
      success: true,
      message: 'Agent updated successfully',
      data: updatedAgent
    });
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update agent'
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
    const [updatedAgent] = await db
      .update(realEstateAgents)
      .set({
        status: 'approved',
        isApproved: true,
        approvedBy: req.user.id,
        approvedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(realEstateAgents.id, agentId))
      .returning();

    // Generate country-based SEO-friendly slug
    const slug = generateCountryBasedSlug(agent.firstName, agent.lastName, agent.country);
    
    // Create agent page with country-specific SEO
    const seoTitle = `${agent.firstName} ${agent.lastName} - Crypto Real Estate Agent in ${agent.country} | HomeKrypto`;
    const seoDescription = `Connect with ${agent.firstName} ${agent.lastName}, licensed crypto real estate professional in ${agent.country}. Invest in property with cryptocurrency through HomeKrypto.`;
    const seoKeywords = `crypto real estate ${agent.country}, cryptocurrency property investment ${agent.country}, ${agent.firstName} ${agent.lastName}, HomeKrypto agent ${agent.country}, blockchain real estate`;
    const pageContent = generateAgentPageContent(agent);

    const [agentPage] = await db
      .insert(agentPages)
      .values({
        agentId: agentId,
        slug: slug,
        seoTitle: seoTitle,
        seoDescription: seoDescription,
        seoKeywords: seoKeywords,
        pageContent: pageContent,
        isActive: true
      })
      .returning();

    // Send approval email with agent page link
    try {
      const agentPageUrl = `https://homekrypto.com/agents/${slug}`;
      
      const approvalEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>HKT Agent Application Approved</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; }
            .code-block { background: #f0f0f0; padding: 15px; border-radius: 5px; font-family: monospace; overflow-x: auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Congratulations!</h1>
              <h2>Your HKT Agent Application Has Been Approved</h2>
            </div>
            
            <div class="content">
              <p>Hello ${agent.firstName} ${agent.lastName},</p>
              
              <p>We're excited to inform you that your application to become a Home Krypto Token (HKT) affiliated agent has been approved!</p>
              
              <h3>🌟 Your Professional Agent Page is Now Live!</h3>
              <p>We've automatically created a professional, SEO-optimized agent page for you:</p>
              <p><strong>Your Agent Page:</strong> <a href="${agentPageUrl}" class="button">View Your Page</a></p>
              
              <h3>📈 Marketing Benefits</h3>
              <p>Your new agent page includes:</p>
              <ul>
                <li>SEO-optimized content for crypto real estate searches</li>
                <li>Professional profile with your credentials</li>
                <li>Crypto investment specialization highlights</li>
                <li>Direct contact information and referral tracking</li>
              </ul>
              
              <h3>🔗 Referral & SEO Instructions</h3>
              <p>To maximize your referral benefits and improve SEO ranking, please add this dofollow link to your website:</p>
              
              <div class="code-block">
&lt;a href="${agent.referralLink || `https://homekrypto.com/agent/${slug}`}" rel="dofollow" title="HKT Crypto Real Estate Investment"&gt;
  HKT Real Estate Investment Platform - Powered by ${agent.firstName} ${agent.lastName}
&lt;/a&gt;
              </div>
              
              <h3>📧 Marketing Email Templates</h3>
              <p>Use these templates to promote your crypto real estate services:</p>
              
              <p><strong>Email Signature:</strong></p>
              <div class="code-block">
${agent.firstName} ${agent.lastName}<br>
Crypto & Real Estate Investment Expert<br>
${agent.company}<br>
🏠 Traditional Real Estate | 🪙 Crypto Investments<br>
View My Profile: ${agentPageUrl}<br>
Invest with Crypto: https://homekrypto.com
              </div>
              
              <h3>🎯 Next Steps</h3>
              <ol>
                <li>Review your agent page and let us know if you need any updates</li>
                <li>Add the referral link to your website and marketing materials</li>
                <li>Start promoting crypto real estate investments to your network</li>
                <li>Contact us for any marketing support or questions</li>
              </ol>
              
              <p>Welcome to the HKT agent network! We're excited to revolutionize real estate investment together.</p>
              
              <p>Best regards,<br>
              <strong>The HomeKrypto Team</strong><br>
              <a href="https://homekrypto.com">HomeKrypto.com</a></p>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendHostingerEmail({
        to: agent.email,
        subject: '🎉 HKT Agent Approved - Your Professional Page is Live!',
        html: approvalEmailHtml
      });

      console.log(`Agent approval email sent to: ${agent.email}`);
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
    }

    res.json({
      success: true,
      message: 'Agent approved successfully and page created',
      data: {
        agent: updatedAgent,
        agentPage: agentPage,
        pageUrl: `https://homekrypto.com/agents/${slug}`
      }
    });
  } catch (error) {
    console.error('Error approving agent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve agent',
      error: error instanceof Error ? error.message : 'Unknown error'
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
    const [updatedAgent] = await db
      .update(realEstateAgents)
      .set({
        status: 'denied',
        isApproved: false,
        rejectionReason: reason || 'Application does not meet current requirements',
        updatedAt: new Date()
      })
      .where(eq(realEstateAgents.id, agentId))
      .returning();

    // Send denial email
    try {
      const denialEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>HKT Agent Application Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>HKT Agent Application Status Update</h2>
            </div>
            
            <div class="content">
              <p>Hello ${agent.firstName} ${agent.lastName},</p>
              
              <p>Thank you for your interest in becoming a Home Krypto Token (HKT) affiliated agent.</p>
              
              <p>After careful review, we are unable to approve your application at this time.</p>
              
              ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
              
              <p>We encourage you to address any feedback provided and reapply in the future as our requirements may evolve.</p>
              
              <p>If you have any questions about this decision or would like guidance on improving your application, please don't hesitate to contact us.</p>
              
              <p>Thank you for your understanding.</p>
              
              <p>Best regards,<br>
              <strong>The HomeKrypto Team</strong><br>
              <a href="https://homekrypto.com">HomeKrypto.com</a></p>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendHostingerEmail({
        to: agent.email,
        subject: 'HKT Agent Application Status Update',
        html: denialEmailHtml
      });

      console.log(`Agent denial email sent to: ${agent.email}`);
    } catch (emailError) {
      console.error('Failed to send denial email:', emailError);
    }

    res.json({
      success: true,
      message: 'Agent application denied',
      data: updatedAgent
    });
  } catch (error) {
    console.error('Error denying agent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deny agent application',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/admin/agents/:id - Delete agent (requires admin authentication)
router.delete('/:id', requireAdmin, async (req: any, res) => {
  try {
    const agentId = parseInt(req.params.id);
    
    if (isNaN(agentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent ID'
      });
    }

    // Get agent details before deletion
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

    // Delete agent page if exists
    await db
      .delete(agentPages)
      .where(eq(agentPages.agentId, agentId));

    // Delete agent from database
    await db
      .delete(realEstateAgents)
      .where(eq(realEstateAgents.id, agentId));

    // Send deletion notification email
    try {
      const deletionEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>HomeKrypto Agent Application Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🚨 Agent Application Removed</h2>
            </div>
            
            <div class="content">
              <p>Hello ${agent.firstName} ${agent.lastName},</p>
              
              <p>We are writing to inform you that your agent application has been removed from the HomeKrypto platform.</p>
              
              <p><strong>Reason for removal:</strong> Your agent application has been removed due to terms and conditions or policy violations.</p>
              
              <p>This decision was made after careful review of our platform policies and requirements.</p>
              
              <p>If you have questions about this decision or believe this removal was made in error, please contact our support team immediately.</p>
              
              <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>📞 Support Contact:</strong><br>
                Email: <a href="mailto:support@homekrypto.com">support@homekrypto.com</a><br>
                Subject: Agent Application Removal Review - ${agent.firstName} ${agent.lastName}</p>
              </div>
              
              <p>Thank you for your understanding.</p>
              
              <p>Best regards,<br>
              <strong>The HomeKrypto Team</strong><br>
              <a href="https://homekrypto.com">HomeKrypto.com</a></p>
            </div>
            
            <div class="footer">
              <p>This email was sent because your agent application was removed from HomeKrypto.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendHostingerEmail({
        to: agent.email,
        subject: '🚨 HomeKrypto Agent Application Status Update',
        html: deletionEmailHtml
      });

      console.log(`Agent deletion email sent to: ${agent.email}`);
    } catch (emailError) {
      console.error('Failed to send deletion email:', emailError);
    }

    res.json({
      success: true,
      message: 'Agent deleted successfully and notification email sent',
      data: {
        deletedAgent: agent
      }
    });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete agent',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;