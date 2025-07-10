import { Router } from 'express';
import { db } from '../db-direct';
import { realEstateAgents } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

const router = Router();

// GET /api/agents - Get all approved agents for public directory
router.get('/', async (req, res) => {
  try {
    // Get all approved agents from database
    const approvedAgents = await db.select().from(realEstateAgents)
      .where(and(
        eq(realEstateAgents.status, 'approved'),
        eq(realEstateAgents.isActive, true)
      ));

    // Map database fields to frontend format
    const mappedAgents = approvedAgents.map(agent => ({
      id: agent.id,
      firstName: agent.first_name,
      lastName: agent.last_name,
      email: agent.email,
      phone: agent.phone,
      company: agent.company,
      city: agent.city,
      state: agent.state,
      country: agent.country,
      bio: agent.bio,
      specializations: agent.specializations,
      yearsExperience: agent.yearsExperience,
      languagesSpoken: agent.languagesSpoken,
      photoUrl: agent.profileImage,
      website: agent.website,
      linkedIn: agent.linkedIn,
      referralLink: agent.referralLink
    }));

    res.json({
      success: true,
      data: mappedAgents,
      total: mappedAgents.length
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch agents' 
    });
  }
});

export default router;