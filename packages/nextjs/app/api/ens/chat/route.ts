import { NextRequest, NextResponse } from 'next/server';
import { ENSAgent } from '@/services/ensagent/agent';
import { ethers } from 'ethers';

const SEPOLIA_RPC = 'https://eth-sepolia.g.alchemy.com/v2/__krcmuK9Ex84Kfc9l765YL9ljhsIYmJ';

export async function POST(request: NextRequest) {
  try {
    const { message, userAddress, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Create provider and agent on server side
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
    const agent = new ENSAgent();
    await agent.initialize(provider);

    // Process message with ENS agent (which will use AI service for LLM responses)
    const response = await agent.processMessage(message, userAddress);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('ENS Chat API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
