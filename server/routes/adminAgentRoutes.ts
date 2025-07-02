import { Router } from 'express';
import { requireAdmin } from '../admin-middleware';
import { db } from '../db-direct';
import { realEstateAgents } from '@shared/schema';
import { eq, count } from 'drizzle-orm';

const router = Router();

// GET /api/admin/agents - Fetch all agents from database
router.get('/', async (req: any, res) => {
  try {
    console.log('Fetching agents from database...');
    
    // Get agents from database
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

export default router;