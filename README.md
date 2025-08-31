# 🌊 Flow Platform Development Scaffold

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Scaffold-ETH 2 Docs</a> |
  <a href="https://scaffoldeth.io">Scaffold-ETH 2 Website</a>
</h4>

🧪 A development scaffold for building the **Flow Platform** - a decentralized AI agent financial operations platform built on Ethereum with ENS integration. This scaffold provides a complete development environment for building, testing, and deploying the Flow ecosystem.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

## 🎯 Project Overview

The Flow Platform is designed to enable AI agents with ENS identities, verifiable credentials, cross-border payments, and community governance. This scaffold provides the development foundation for:

- **🤖 AI Agent Management**: Create and manage AI agents with ENS identities
- **🆔 Verifiable Credentials**: Issue and verify trust credentials
- **💰 Cross-border Payments**: Process payments using human-readable ENS names
- **🏛️ Multi-signature Wallets**: Create named wallets for DAO coordination
- **🗳️ Community Governance**: Build decentralized autonomous organizations

## 🏗️ Architecture

This scaffold includes:

- **Frontend**: NextJS application with RainbowKit wallet integration
- **Smart Contracts**: Hardhat development environment for Solidity contracts
- **Testing**: Comprehensive testing framework for contracts and frontend
- **Deployment**: Automated deployment scripts for multiple networks

## 📁 Project Structure

```
flow-scaffold/
├── packages/
│   ├── nextjs/               # Frontend application
│   │   ├── src/              # React components and pages
│   │   ├── public/           # Static assets
│   │   └── package.json      # Frontend dependencies
│   └── hardhat/              # Smart contract development
│       ├── contracts/        # Solidity smart contracts
│       ├── deploy/           # Deployment scripts
│       ├── test/             # Contract tests
│       └── package.json      # Hardhat dependencies
├── package.json              # Root workspace configuration
└── README.md                 # This file
```

## 🚀 Quickstart

### Prerequisites

- [Node.js (>= v20.18.3)](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/getting-started/install) (v1 or v2+)
- [Git](https://git-scm.com/downloads)

### Installation

1. **Install dependencies:**
   ```bash
   cd flow-scaffold
   yarn install
   ```

2. **Start local blockchain:**
   ```bash
   yarn chain
   ```
   This starts a local Ethereum network using Hardhat for development and testing.

3. **Deploy smart contracts:**
   ```bash
   yarn deploy
   ```
   Deploys the Flow platform contracts to your local network.

4. **Start frontend application:**
   ```bash
   yarn start
   ```
   Visit your app at: `http://localhost:3000`

## 🧪 Development

### Smart Contract Development

- **Edit contracts** in `packages/hardhat/contracts/`
- **Run tests** with `yarn hardhat:test`
- **Compile contracts** with `yarn hardhat:compile`
- **Deploy to local network** with `yarn deploy`

### Frontend Development

- **Edit pages** in `packages/nextjs/src/`
- **Add components** in `packages/nextjs/src/components/`
- **Configure app** in `packages/nextjs/scaffold.config.ts`

### Testing

- **Contract tests**: `yarn hardhat:test`
- **Frontend tests**: `yarn next:test` (when implemented)
- **Type checking**: `yarn hardhat:check-types` and `yarn next:check-types`

## 🔧 Configuration

### Hardhat Configuration

Customize your blockchain network settings in `packages/hardhat/hardhat.config.ts`:

- Network configurations
- Compiler settings
- Plugin configurations
- Environment variables

### NextJS Configuration

Configure your frontend application in `packages/nextjs/scaffold.config.ts`:

- Contract addresses
- Network configurations
- Feature flags
- UI customizations

## 📚 Documentation

- **Scaffold-ETH 2**: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)
- **Flow Platform**: See the main project documentation
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Hardhat**: [hardhat.org/docs](https://hardhat.org/docs)

## 🤝 Contributing

We welcome contributions to the Flow Platform development scaffold!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENCE](LICENCE) file for details.

## 🔗 Related Projects

- **Flow Platform**: Main blockchain contracts and platform logic
- **Flow Client**: Production frontend application
- **Flow Scaffold**: This development environment