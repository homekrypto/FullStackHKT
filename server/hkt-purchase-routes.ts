import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from './auth';
import type { AuthenticatedRequest } from './auth';
import { db } from './db-direct';
import { users, hktStats } from '@shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// HKT Purchase validation schema
const purchaseHktSchema = z.object({
  amount: z.number().min(0.01),
  currency: z.enum(['USD', 'ETH', 'USDT']),
  walletAddress: z.string().min(1),
  transactionHash: z.string().optional(),
  pricePerToken: z.number().min(0.0001),
});

// Get current HKT price and stats
router.get('/price', async (req, res) => {
  try {
    const [stats] = await db.select().from(hktStats)
      .orderBy(hktStats.updatedAt)
      .limit(1);
    
    if (!stats) {
      return res.json({
        currentPrice: '0.0001',
        priceChange24h: '0',
        totalSupply: '1000000000',
        marketCap: '100000',
        volume24h: '10000',
        updatedAt: new Date().toISOString()
      });
    }
    
    res.json({
      currentPrice: stats.currentPrice,
      priceChange24h: stats.priceChange24h,
      totalSupply: stats.totalSupply,
      marketCap: stats.marketCap,
      volume24h: stats.volume24h,
      updatedAt: stats.updatedAt
    });
  } catch (error) {
    console.error('Error fetching HKT price:', error);
    res.status(500).json({ error: 'Failed to fetch HKT price' });
  }
});

// Get swap quote for HKT purchase
router.post('/quote', async (req, res) => {
  try {
    const { fromToken, toToken, amount } = req.body;
    
    if (!fromToken || !toToken || !amount) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Get current HKT price
    const [stats] = await db.select().from(hktStats)
      .orderBy(hktStats.updatedAt)
      .limit(1);
    
    const hktPrice = stats ? parseFloat(stats.currentPrice) : 0.0001;
    
    // Calculate quote based on current HKT price
    let toAmount = 0;
    let rate = 0;
    
    if (toToken === 'HKT') {
      // Buying HKT
      if (fromToken === 'USD') {
        toAmount = amount / hktPrice;
        rate = hktPrice;
      } else if (fromToken === 'ETH') {
        // Assuming ETH price at $2000 for calculation
        const ethPrice = 2000;
        const usdAmount = amount * ethPrice;
        toAmount = usdAmount / hktPrice;
        rate = hktPrice / ethPrice;
      }
    } else if (fromToken === 'HKT') {
      // Selling HKT
      if (toToken === 'USD') {
        toAmount = amount * hktPrice;
        rate = hktPrice;
      } else if (toToken === 'ETH') {
        const ethPrice = 2000;
        const usdAmount = amount * hktPrice;
        toAmount = usdAmount / ethPrice;
        rate = hktPrice / ethPrice;
      }
    }
    
    // Add slippage and fees
    const slippage = 0.005; // 0.5%
    const fee = 0.003; // 0.3%
    const adjustedAmount = toAmount * (1 - slippage - fee);
    
    res.json({
      fromToken,
      toToken,
      fromAmount: amount.toString(),
      toAmount: adjustedAmount.toString(),
      rate: rate.toString(),
      slippage: (slippage * 100).toString(),
      fee: (fee * 100).toString(),
      priceImpact: '0.1',
      route: [fromToken, toToken],
      estimatedGas: '0.002',
      validUntil: new Date(Date.now() + 30000).toISOString(), // 30 seconds
    });
  } catch (error) {
    console.error('Error calculating quote:', error);
    res.status(500).json({ error: 'Failed to calculate quote' });
  }
});

// Execute HKT purchase
router.post('/purchase', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const purchaseData = purchaseHktSchema.parse(req.body);
    
    // Calculate HKT tokens received
    const hktTokensReceived = purchaseData.amount / purchaseData.pricePerToken;
    
    // In a real implementation, this would:
    // 1. Verify the transaction on blockchain
    // 2. Update user's HKT balance
    // 3. Create transaction record
    // 4. Send confirmation email
    
    // For now, we'll create a mock transaction record
    const mockTransaction = {
      id: `tx_${Date.now()}`,
      userId,
      amount: purchaseData.amount,
      currency: purchaseData.currency,
      hktTokensReceived,
      pricePerToken: purchaseData.pricePerToken,
      walletAddress: purchaseData.walletAddress,
      transactionHash: purchaseData.transactionHash || `0x${Math.random().toString(16).substr(2, 64)}`,
      status: 'completed',
      timestamp: new Date().toISOString(),
    };
    
    // Update user's primary wallet address if not set
    if (purchaseData.walletAddress) {
      await db.update(users)
        .set({ primaryWalletAddress: purchaseData.walletAddress })
        .where(eq(users.id, userId));
    }
    
    res.json({
      success: true,
      message: 'HKT purchase successful',
      transaction: mockTransaction,
      hktTokensReceived,
      newBalance: hktTokensReceived, // In real implementation, this would be current balance + new tokens
    });
  } catch (error) {
    console.error('Error processing HKT purchase:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to process HKT purchase' });
  }
});

// Get user's HKT balance and transaction history
router.get('/balance', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    
    // In a real implementation, this would query the blockchain or a balance table
    // For now, return mock data
    const mockBalance = {
      hktBalance: '1000.5',
      usdValue: '100.05',
      pricePerToken: '0.0001',
      transactions: [
        {
          id: 'tx_1',
          type: 'purchase',
          amount: '1000.5',
          currency: 'HKT',
          timestamp: new Date().toISOString(),
          status: 'completed',
        }
      ]
    };
    
    res.json(mockBalance);
  } catch (error) {
    console.error('Error fetching HKT balance:', error);
    res.status(500).json({ error: 'Failed to fetch HKT balance' });
  }
});

// Get user's transaction history
router.get('/transactions', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    
    // In a real implementation, this would query a transactions table
    const mockTransactions = [
      {
        id: 'tx_1',
        userId,
        type: 'purchase',
        amount: '1000.5',
        currency: 'HKT',
        pricePerToken: '0.0001',
        transactionHash: '0x123...',
        timestamp: new Date().toISOString(),
        status: 'completed',
      }
    ];
    
    res.json(mockTransactions);
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({ error: 'Failed to fetch transaction history' });
  }
});

export default router;