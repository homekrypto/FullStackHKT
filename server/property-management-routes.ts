import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from './auth';
import { requireAdmin } from './admin-middleware';
import type { AuthenticatedRequest } from './auth';
import { db } from './db-direct';
import { properties, propertyShares, realEstateAgents } from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';

const router = Router();

// Property validation schema
const createPropertySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  location: z.string().min(1),
  description: z.string().min(1),
  pricePerNight: z.string().regex(/^\d+(\.\d{1,2})?$/),
  totalShares: z.number().min(1).max(52),
  sharePrice: z.string().regex(/^\d+(\.\d{1,2})?$/),
  images: z.array(z.string().url()).optional(),
  amenities: z.array(z.string()).optional(),
  maxGuests: z.number().min(1),
  bedrooms: z.number().min(1),
  bathrooms: z.number().min(1),
  isActive: z.boolean().optional(),
  agentId: z.number().optional(),
});

const updatePropertySchema = createPropertySchema.partial().omit({ id: true });

// Get approved agents for dropdown
router.get('/agents/approved', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const approvedAgents = await db.select({
      id: realEstateAgents.id,
      firstName: realEstateAgents.first_name,
      lastName: realEstateAgents.last_name,
      email: realEstateAgents.email,
      location: realEstateAgents.city,
      phone: realEstateAgents.phone
    })
    .from(realEstateAgents)
    .where(eq(realEstateAgents.status, 'approved'))
    .orderBy(realEstateAgents.first_name);
    
    res.json(approvedAgents);
  } catch (error) {
    console.error('Error fetching approved agents:', error);
    res.status(500).json({ error: 'Failed to fetch approved agents' });
  }
});

// Get all properties (public) with agent information
router.get('/', async (req, res) => {
  try {
    // First get properties without join to test basic functionality
    const allProperties = await db.select().from(properties)
      .where(eq(properties.isActive, true))
      .orderBy(desc(properties.createdAt));
    
    // Then enrich with agent data if agent IDs exist
    const enrichedProperties = [];
    for (const property of allProperties) {
      let enrichedProperty = {
        ...property,
        agentName: null,
        agentLastName: null,
        agentEmail: null,
        agentPhone: null,
        agentLocation: null
      };
      
      if (property.agentId) {
        try {
          const [agent] = await db.select().from(realEstateAgents)
            .where(eq(realEstateAgents.id, property.agentId))
            .limit(1);
            
          if (agent) {
            enrichedProperty.agentName = agent.first_name;
            enrichedProperty.agentLastName = agent.last_name;
            enrichedProperty.agentEmail = agent.email;
            enrichedProperty.agentPhone = agent.phone;
            enrichedProperty.agentLocation = agent.city;
          }
        } catch (agentError) {
          console.log('Could not fetch agent data for property:', property.id);
        }
      }
      
      enrichedProperties.push(enrichedProperty);
    }
    
    res.json(enrichedProperties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get single property (public) with agent information
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [property] = await db.select({
      id: properties.id,
      name: properties.name,
      location: properties.location,
      description: properties.description,
      pricePerNight: properties.pricePerNight,
      totalShares: properties.totalShares,
      sharePrice: properties.sharePrice,
      images: properties.images,
      amenities: properties.amenities,
      maxGuests: properties.maxGuests,
      bedrooms: properties.bedrooms,
      bathrooms: properties.bathrooms,
      isActive: properties.isActive,
      agentId: properties.agentId,
      createdAt: properties.createdAt,
      agentName: realEstateAgents.first_name,
      agentLastName: realEstateAgents.last_name,
      agentEmail: realEstateAgents.email,
      agentPhone: realEstateAgents.phone,
      agentLocation: realEstateAgents.city
    })
    .from(properties)
    .leftJoin(realEstateAgents, eq(properties.agentId, realEstateAgents.id))
    .where(and(eq(properties.id, id), eq(properties.isActive, true)));
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create property (admin only)
router.post('/', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const propertyData = createPropertySchema.parse(req.body);
    
    // Check if property ID already exists
    const [existingProperty] = await db.select().from(properties)
      .where(eq(properties.id, propertyData.id))
      .limit(1);
    
    if (existingProperty) {
      return res.status(400).json({ error: 'Property ID already exists' });
    }
    
    const [newProperty] = await db.insert(properties).values({
      ...propertyData,
      images: propertyData.images || [],
      amenities: propertyData.amenities || [],
    }).returning();
    
    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Update property (admin only)
router.put('/:id', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const updates = updatePropertySchema.parse(req.body);
    
    const [updatedProperty] = await db.update(properties)
      .set(updates)
      .where(eq(properties.id, id))
      .returning();
    
    if (!updatedProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// Delete property (admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    
    const [deletedProperty] = await db.update(properties)
      .set({ isActive: false })
      .where(eq(properties.id, id))
      .returning();
    
    if (!deletedProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json({ message: 'Property deactivated successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// Get user's property shares
router.get('/shares/my-shares', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    
    const userShares = await db.select({
      propertyId: propertyShares.propertyId,
      sharesOwned: propertyShares.sharesOwned,
      createdAt: propertyShares.createdAt,
    }).from(propertyShares)
      .where(eq(propertyShares.userId, userId))
      .orderBy(desc(propertyShares.createdAt));
    
    res.json(userShares);
  } catch (error) {
    console.error('Error fetching user shares:', error);
    res.status(500).json({ error: 'Failed to fetch user shares' });
  }
});

// Purchase property shares
router.post('/shares/purchase', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { propertyId, sharesCount, paymentMethod, walletAddress } = req.body;
    
    if (!propertyId || !sharesCount || !paymentMethod || !walletAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Get property details
    const [property] = await db.select().from(properties)
      .where(and(eq(properties.id, propertyId), eq(properties.isActive, true)));
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    // Check if user already owns shares in this property
    const [existingShares] = await db.select().from(propertyShares)
      .where(and(
        eq(propertyShares.userId, userId),
        eq(propertyShares.propertyId, propertyId)
      ));
    
    if (existingShares) {
      // Update existing shares
      const [updatedShares] = await db.update(propertyShares)
        .set({ 
          sharesOwned: existingShares.sharesOwned + sharesCount,
          userWallet: walletAddress
        })
        .where(and(
          eq(propertyShares.userId, userId),
          eq(propertyShares.propertyId, propertyId)
        ))
        .returning();
      
      res.json({
        message: 'Property shares purchased successfully',
        shares: updatedShares,
        totalShares: updatedShares.sharesOwned
      });
    } else {
      // Create new shares record
      const [newShares] = await db.insert(propertyShares).values({
        userId,
        userWallet: walletAddress,
        propertyId,
        sharesOwned: sharesCount,
      }).returning();
      
      res.json({
        message: 'Property shares purchased successfully',
        shares: newShares,
        totalShares: newShares.sharesOwned
      });
    }
  } catch (error) {
    console.error('Error purchasing property shares:', error);
    res.status(500).json({ error: 'Failed to purchase property shares' });
  }
});

export default router;