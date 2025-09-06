# Environment Variables Setup

This document explains how to set up environment variables for the AI-powered payment and ENS services.

## Required Environment Variables

### OPENROUTER_API_KEY

The OpenRouter API key is required for AI-powered chat functionality in both the Payment Agent and ENS Agent services.

**How to get your API key:**
1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for an account
3. Navigate to your API keys section
4. Generate a new API key

**How to set up:**

1. Create a `.env.local` file in the `packages/nextjs/` directory:
```bash
# In packages/nextjs/.env.local
OPENROUTER_API_KEY=your-openrouter-api-key-here
```

2. For production deployments (Vercel, etc.), add the environment variable in your deployment platform's environment settings.

## Services That Use This API Key

- **PayAI Service** (`services/basepay/payai/index.ts`): Powers AI-driven payment assistance
- **ENS AI Service** (`services/ensagent/ai/index.ts`): Powers AI-driven ENS domain assistance
- **Chat Integration** (`services/basepay/chatIntegration.ts`): Integrates AI with payment flows
- **API Routes** (`app/api/ens/chat/route.ts`): Server-side AI processing

## Error Handling

If the `OPENROUTER_API_KEY` environment variable is not set:
- Services will throw an error with a helpful message
- The application will fall back to basic functionality without AI features
- Console warnings will be displayed for debugging

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your API key secure and rotate it periodically
- Use different API keys for development and production environments

## Existing Environment Variables

The following environment variables are already configured in `scaffold.config.ts`:
- `NEXT_PUBLIC_ALCHEMY_API_KEY`: For blockchain RPC connections
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: For WalletConnect integration

## Example .env.local File

```bash
# OpenRouter API Key for AI services
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here

# Optional: Override default Alchemy API key
NEXT_PUBLIC_ALCHEMY_API_KEY=your-alchemy-api-key

# Optional: Override default WalletConnect project ID
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-walletconnect-project-id
```
