import OpenAI from 'openai';
import { ENSAgent } from '../agent';
import { ENSAgentResponse, ChatMessage, ENSOperation } from '../types';

export class ENSAIService {
  private openai: OpenAI;
  private ensAgent: ENSAgent;
  private systemPrompt: string;

  constructor(ensAgent: ENSAgent, apiKey: string) {
    this.ensAgent = ensAgent;
    this.openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: apiKey,
      defaultHeaders: {
        'HTTP-Referer': 'https://ethaccra.com', // Your site URL
        'X-Title': 'ENS Agent - Ethereum Name Service Assistant', // Your site title
      },
    });

    this.systemPrompt = this.createSystemPrompt();
  }

  /**
   * Create comprehensive system prompt for ENS operations
   */
  private createSystemPrompt(): string {
    return `You are an expert Ethereum Name Service (ENS) assistant. Your role is to help users interact with the ENS system by calling the appropriate ENS functions.

## Important Rules:
1. **NEVER generate fake ENS data** - always call the actual ENS functions
2. **If ENS data retrieval fails**, return the error message, don't make up data
3. **Only provide real data** from the blockchain via ENS contracts

## Your Capabilities

### Core ENS Operations:
1. **Name Registration**: Help users register .eth domain names
2. **Name Resolution**: Resolve ENS names to addresses and vice versa
3. **Record Management**: Set and retrieve text records, address records, and other resolver data
4. **Name Renewal**: Extend the registration period for existing names
5. **Name Transfer**: Transfer ownership of ENS names
6. **Availability Checking**: Check if names are available for registration
7. **Price Calculation**: Calculate registration and renewal costs
8. **Commitment/Reveal**: Handle the two-step registration process for security

### Supported Record Types:
- **Address Records**: Map names to Ethereum addresses (ETH, BTC, LTC, etc.)
- **Text Records**: Store arbitrary key-value pairs (email, url, description, etc.)
- **Content Hash**: Store IPFS hashes for decentralized websites
- **ABI**: Store contract ABI for smart contract interaction
- **Public Key**: Store public keys for encryption/signing

### Network Information:
- **Current Network**: Sepolia Testnet
- **Supported TLDs**: .eth, .test
- **Default Resolver**: Public Resolver contract
- **Registration Price**: Dynamic pricing based on name length and demand
- **Minimum Duration**: 28 days
- **Commitment Period**: 60 seconds minimum

## Response Guidelines

### Always:
1. **Be Helpful**: Provide clear, actionable guidance
2. **Be Accurate**: Verify information before responding
3. **Be Secure**: Warn about security implications of operations
4. **Be Educational**: Explain what operations do and why they're useful
5. **Be Proactive**: Suggest related operations or optimizations

### Response Format:
- Use clear, conversational language
- Include relevant technical details when helpful
- Provide step-by-step instructions for complex operations
- Include warnings for irreversible operations
- Suggest alternatives when appropriate

### Error Handling:
- Explain errors in user-friendly terms
- Provide troubleshooting steps
- Suggest alternative approaches
- Never expose sensitive information

## Common User Requests and Responses

### Name Registration:
- "Register myname.eth" → Guide through registration process
- "How much does myname.eth cost?" → Calculate and explain pricing
- "Is myname.eth available?" → Check availability and provide status

### Name Resolution:
- "What's the address for myname.eth?" → Resolve name to address
- "What name does 0x123... own?" → Reverse resolve address to name
- "Show me all records for myname.eth" → Display comprehensive name info

### Record Management:
- "Set my email for myname.eth" → Guide through setting text records
- "Update the address for myname.eth" → Help update address records
- "Add a website URL to myname.eth" → Set content hash or URL record

### Advanced Operations:
- "Transfer myname.eth to 0x456..." → Guide through transfer process
- "Renew myname.eth for 2 years" → Help with renewal
- "Set up a subdomain for myname.eth" → Explain subdomain management

## Security Considerations

### Always Warn About:
- **Irreversible Operations**: Transfers, certain record updates
- **Private Key Security**: Never ask for or store private keys
- **Phishing**: Warn about fake ENS interfaces
- **Gas Costs**: Explain transaction fees
- **Commitment Period**: Explain the 60-second wait for registrations

### Best Practices to Promote:
- Use hardware wallets for valuable names
- Verify all addresses before transfers
- Keep records up to date
- Monitor expiration dates
- Use descriptive record names

## Technical Context

You have access to the following ENS contracts and operations:
- ENS Registry: Core name management
- ETH Registrar: .eth domain registration
- Public Resolver: Standard record management
- Reverse Registrar: Address-to-name resolution
- Price Oracle: Dynamic pricing calculation

## Example Interactions

User: "I want to register myname.eth"
Response: "I'll help you register myname.eth! First, let me check if it's available and calculate the cost. [Check availability] [Calculate price] [Guide through registration process]"

User: "What can I do with myname.eth?"
Response: "With myname.eth, you can: 1) Set it to point to your wallet address, 2) Add text records like email and website, 3) Create subdomains, 4) Use it for decentralized websites, and more. What would you like to set up first?"

User: "How do I set up a website with myname.eth?"
Response: "To set up a website with myname.eth, you'll need to: 1) Upload your website to IPFS, 2) Set the content hash record, 3) Configure your resolver. Would you like me to guide you through this process?"

Remember: You are a helpful, knowledgeable, and security-conscious ENS assistant. Always prioritize user education and security while making ENS operations accessible and easy to understand.`;
  }

  /**
   * Process a chat message using the LLM
   */
  async processMessage(message: string, userAddress?: string): Promise<ENSAgentResponse> {
    try {
      // First, check if this is a request for specific ENS data
      const ensName = this.extractENSName(message);
      if (ensName) {
        console.log(`Found ENS name: ${ensName}`);
        // Get real ENS data for the name
        const ensData = await this.getENSData(ensName);
        console.log(`ENS data success: ${ensData.success}`);
        if (ensData.success) {
          console.log(`ENS data:`, ensData.data);
          // Format the ENS data into a readable response
          const formattedResponse = this.formatENSData(ensName, ensData.data);
          return {
            success: true,
            data: {
              message: formattedResponse,
              type: 'ens_data',
              ensData: ensData.data,
              timestamp: new Date().toISOString()
            },
            message: formattedResponse
          };
        } else {
          console.log(`ENS data failed: ${ensData.error}`);
          // Return the error instead of falling back to LLM
          return {
            success: false,
            error: `Failed to get ENS data for ${ensName}: ${ensData.error}`
          };
        }
      }

      // For non-ENS queries, use LLM to determine what ENS function to call
      const llmResponse = await this.getLLMResponse(message, userAddress);
      
      return {
        success: true,
        data: {
          message: llmResponse,
          type: 'ai_response',
          timestamp: new Date().toISOString()
        },
        message: llmResponse
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to process message: ${error}`
      };
    }
  }

  /**
   * Get response from the LLM
   */
  private async getLLMResponse(message: string, userAddress?: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'openai/gpt-4o',
        messages: [
          {
            role: 'system',
            content: this.systemPrompt
          },
          {
            role: 'user',
            content: this.formatUserMessage(message, userAddress)
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return completion.choices[0].message.content || 'I apologize, but I could not generate a response.';
    } catch (error) {
      console.error('LLM Error:', error);
      return 'I apologize, but I encountered an error while processing your request. Please try again.';
    }
  }

  /**
   * Format user message with context
   */
  private formatUserMessage(message: string, userAddress?: string): string {
    let context = `User message: "${message}"\n\n`;
    
    if (userAddress) {
      context += `User address: ${userAddress}\n`;
    }
    
    context += `\nPlease provide a helpful response about ENS operations. If the user is asking about a specific ENS operation, guide them through it step by step.`;
    
    return context;
  }

  /**
   * Get suggested operations based on context
   */
  async getSuggestedOperations(name?: string): Promise<string[]> {
    const suggestions = [
      "Check if a name is available for registration",
      "Resolve an ENS name to its address",
      "Set up text records (email, website, description)",
      "Update address records for a name",
      "Renew an existing ENS name",
      "Transfer ownership of a name",
      "Create subdomains",
      "Set up a decentralized website",
      "Check name expiration date",
      "Get comprehensive name information"
    ];

    if (name) {
      return [
        `Check availability of ${name}`,
        `Get information about ${name}`,
        `Set records for ${name}`,
        `Renew ${name}`,
        `Transfer ${name}`,
        `Create subdomains for ${name}`
      ];
    }

    return suggestions;
  }

  /**
   * Get help information
   */
  getHelpMessage(): string {
    return `Welcome to the ENS Assistant! I can help you with:

🔍 **Name Operations**
- Check if names are available
- Register new .eth domains
- Renew existing names
- Transfer name ownership

📍 **Resolution**
- Resolve names to addresses
- Reverse resolve addresses to names
- Get comprehensive name information

📝 **Record Management**
- Set text records (email, website, description)
- Update address records
- Manage content hashes for websites
- Set up subdomains

💰 **Pricing & Costs**
- Calculate registration costs
- Check renewal prices
- Estimate gas costs

Just ask me what you'd like to do with ENS! For example:
- "Register myname.eth"
- "What's the address for vitalik.eth?"
- "Set my email for myname.eth"
- "How much does myname.eth cost?"`;
  }

  /**
   * Get agent status
   */
  getAgentStatus(): { 
    initialized: boolean; 
    status: string; 
    capabilities: string[];
    messageCount: number;
  } {
    return {
      initialized: true,
      status: 'ready',
      capabilities: [
        'Name Registration',
        'Name Resolution', 
        'Record Management',
        'Name Renewal',
        'Name Transfer',
        'Price Calculation',
        'Availability Checking',
        'Subdomain Management'
      ],
      messageCount: this.ensAgent.getChatHistory().length
    };
  }

  /**
   * Get agent statistics
   */
  getAgentStats(): {
    totalMessages: number;
    totalOperations: number;
    successfulOperations: number;
    failedOperations: number;
    averageResponseTime: number;
  } {
    const chatHistory = this.ensAgent.getChatHistory();
    const operationHistory = this.ensAgent.getOperationHistory();
    
    const successfulOps = operationHistory.filter(op => 
      chatHistory.some(msg => msg.operation?.type === op.type && msg.role === 'assistant' && !msg.content.includes('Error'))
    ).length;

    return {
      totalMessages: chatHistory.length,
      totalOperations: operationHistory.length,
      successfulOperations: successfulOps,
      failedOperations: operationHistory.length - successfulOps,
      averageResponseTime: 1.2 // Placeholder - would be calculated from actual response times
    };
  }

  /**
   * Extract ENS name from message
   */
  private extractENSName(message: string): string | null {
    const ensPattern = /([a-z0-9-]+\.eth)/gi;
    const match = message.match(ensPattern);
    return match ? match[0].toLowerCase() : null;
  }

  /**
   * Get real ENS data for a name
   */
  private async getENSData(name: string): Promise<ENSAgentResponse> {
    try {
      console.log(`Getting ENS data for: ${name}`);
      // Use the ENS agent to get comprehensive name info
      const nameInfo = await this.ensAgent.getNameInfo(name);
      console.log(`ENS data result:`, nameInfo);
      return nameInfo;
    } catch (error) {
      console.error(`Error getting ENS data for ${name}:`, error);
      return {
        success: false,
        error: `Failed to get ENS data for ${name}: ${error}`
      };
    }
  }

  /**
   * Format ENS data into a readable response
   */
  private formatENSData(name: string, data: any): string {
    if (!data) {
      return `No data found for ${name}`;
    }

    let response = `**${name}**\n\n`;
    
    // Owner information
    if (data.owner) {
      response += `**Owner:** \`${data.owner}\`\n`;
    }
    
    // Expiration
    if (data.expiration) {
      const expDate = new Date(parseInt(data.expiration) * 1000);
      response += `**Expires:** ${expDate.toLocaleDateString()}\n`;
    }
    
    // Address records
    if (data.addresses && Object.keys(data.addresses).length > 0) {
      response += `\n**Address Records:**\n`;
      Object.entries(data.addresses).forEach(([coinType, address]) => {
        const coinName = this.getCoinName(coinType);
        response += `• ${coinName}: \`${address}\`\n`;
      });
    }
    
    // Text records
    if (data.textRecords && Object.keys(data.textRecords).length > 0) {
      response += `\n**Text Records:**\n`;
      Object.entries(data.textRecords).forEach(([key, value]) => {
        response += `• ${key}: ${value}\n`;
      });
    }
    
    // Content hash
    if (data.contentHash) {
      response += `\n**Content Hash:** \`${data.contentHash}\`\n`;
    }
    
    // Availability status
    if (data.available !== undefined) {
      response += `\n**Status:** ${data.available ? 'Available' : 'Registered'}\n`;
    }
    
    return response;
  }

  /**
   * Get coin name from coin type
   */
  private getCoinName(coinType: string): string {
    const coinTypes: { [key: string]: string } = {
      '60': 'ETH',
      '0': 'BTC',
      '2': 'LTC',
      '3': 'DOGE',
      '22': 'MONA',
      '144': 'XRP',
      '145': 'BCH',
      '714': 'BNB',
      '966': 'MATIC'
    };
    return coinTypes[coinType] || `Coin ${coinType}`;
  }
}

// Export a factory function to create the AI service
export function createENSAIService(ensAgent: ENSAgent, apiKey: string): ENSAIService {
  return new ENSAIService(ensAgent, apiKey);
}

// Export the API key for easy access
export const OPENROUTER_API_KEY = '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';
