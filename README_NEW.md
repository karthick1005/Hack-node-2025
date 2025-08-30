# CardSmart - Decentralized Card Management System on BlockDAG

## 📋 Project Overview

CardSmart is a comprehensive decentralized application (dApp) built on the BlockDAG Primordial Testnet that provides a complete card management system with transaction tracking, analytics, and blockchain integration.

## 🔥 Live Deployment

### ✅ Successfully Deployed on BlockDAG Primordial Testnet

**Contract Address**: `0xe44Ac990DB939D0Df18f0A8C7cd0326E6A10bc1f`  
**Transaction Hash**: `0x118ce19e4cecf78d247129549b6ec01032d6fd41401f5fd2fe634c2aa7814eba`  
**Deployer Address**: `0xB5d8893578cA8FdabfD15a6229569f28AB5bb652`  
**Network**: BlockDAG Primordial Testnet (Chain ID: 1043)  
**Explorer**: https://primordial.bdagscan.com/address/0xe44Ac990DB939D0Df18f0A8C7cd0326E6A10bc1f  

## 🚀 Features

### Smart Contract Features
- **Card Management**: Create, update, and manage digital cards
- **Transaction Tracking**: Record and verify blockchain transactions
- **User Analytics**: Comprehensive spending and income analytics
- **Security**: Built with OpenZeppelin's Ownable and ReentrancyGuard
- **Multi-card Support**: Users can manage multiple cards simultaneously

### Frontend Features  
- **Next.js 14**: Modern React framework with App Router
- **Firebase Integration**: Authentication and data persistence
- **Real-time Dashboard**: Live transaction monitoring
- **Responsive Design**: Mobile-first approach
- **Wallet Integration**: MetaMask and Web3 connectivity

## 🛠 Technology Stack

### Blockchain
- **Solidity**: ^0.8.28
- **Hardhat**: Development environment and testing
- **OpenZeppelin**: Security-audited contract libraries
- **BlockDAG**: High-performance blockchain network

### Frontend
- **Next.js**: 14.2.5 (React framework)
- **TypeScript/JavaScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Firebase**: Backend services and authentication

### Development Tools
- **Hardhat Toolbox**: Complete development suite
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing and optimization

## 📦 Smart Contract Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CardSmart - Decentralized Card Management System
 * @dev Smart contract for managing digital cards, transactions, and analytics on BlockDAG
 * @author CardSmart Team
 */
contract CardSmart is Ownable, ReentrancyGuard {
    // State variables
    uint256 private _cardIdCounter;
    uint256 private _transactionIdCounter;

    // Card structure
    struct Card {
        uint256 id;
        string cardNumber;
        string cardName;
        string category;
        uint256 balance;
        uint256 creditLimit;
        address owner;
        bool isActive;
        uint256 createdAt;
        uint256 lastUsed;
        uint256 totalSpent;
        uint256 totalTransactions;
    }

    // Transaction structure
    struct Transaction {
        uint256 id;
        uint256 cardId;
        string transactionName;
        uint256 amount;
        string category;
        string transactionType; // "income" or "expense"
        address user;
        string blockchainHash;
        uint256 timestamp;
        bool isConfirmed;
    }

    // User analytics structure
    struct UserAnalytics {
        uint256 totalCards;
        uint256 totalTransactions;
        uint256 totalSpent;
        uint256 totalIncome;
        uint256 monthlySpending;
        string preferredCategory;
        uint256 lastActivity;
    }

    // Mappings
    mapping(uint256 => Card) public cards;
    mapping(uint256 => Transaction) public transactions;
    mapping(address => uint256[]) public userCards;
    mapping(address => uint256[]) public userTransactions;
    mapping(address => UserAnalytics) public userAnalytics;
    mapping(address => bool) public authorizedUsers;

    // Events
    event CardCreated(uint256 indexed cardId, address indexed owner, string cardName);
    event CardUpdated(uint256 indexed cardId, string cardName, uint256 balance);
    event TransactionCreated(uint256 indexed transactionId, uint256 indexed cardId, uint256 amount);
    event TransactionConfirmed(uint256 indexed transactionId, string blockchainHash);
    event UserRegistered(address indexed user);
    event BalanceUpdated(uint256 indexed cardId, uint256 newBalance);

    // Key Functions
    constructor() Ownable(msg.sender) {}
    
    function registerUser(address userAddress) external onlyOwner;
    function createCard(string memory cardNumber, string memory cardName, string memory category, uint256 creditLimit) external returns (uint256);
    function createTransaction(uint256 cardId, string memory transactionName, uint256 amount, string memory category, string memory transactionType, string memory blockchainHash) external returns (uint256);
    function getUserCards(address userAddress) external view returns (uint256[] memory);
    function getUserTransactions(address userAddress) external view returns (uint256[] memory);
    function getUserAnalytics(address userAddress) external view returns (UserAnalytics memory);
    
    // Additional utility functions for card management and analytics...
}
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MetaMask wallet
- BDAG testnet tokens

### 1. Clone Repository
```bash
git clone https://github.com/MukeshR-prog/block-dag-2025.git
cd blockdag
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create `.env` file in project root:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# BlockDAG Network Configuration
BLOCKDAG_TESTNET_RPC=https://rpc.primordial.bdagscan.com
PRIVATE_KEY=your_private_key_with_0x_prefix

# Contract Addresses (Live Deployment)
CARDSMART_CONTRACT_ADDRESS=0xe44Ac990DB939D0Df18f0A8C7cd0326E6A10bc1f
NEXT_PUBLIC_CARDSMART_CONTRACT_ADDRESS=0xe44Ac990DB939D0Df18f0A8C7cd0326E6A10bc1f
NEXT_PUBLIC_BLOCKDAG_RPC_URL=https://rpc.primordial.bdagscan.com
NEXT_PUBLIC_CHAIN_ID=1043
```

### 4. Get Testnet Tokens
Visit the BlockDAG faucet to get test tokens:
```
https://primordial.bdagscan.com/faucet
```

## 🚀 Deployment Guide

### Quick Deployment
```bash
# Compile contracts
npx hardhat compile

# Deploy to BlockDAG Primordial Testnet
npx hardhat run scripts/deploy.js --network blockdag_primordial
```

### Custom Deployment
```bash
# Check network configuration
npx hardhat network --show-config

# Deploy with verbose output
npx hardhat run scripts/deploy.js --network blockdag_primordial --verbose
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```
Access at: http://localhost:3000

### Production Build
```bash
npm run build
npm start
```

## 📡 Network Configuration

### BlockDAG Primordial Testnet
- **Network Name**: BlockDAG Primordial
- **RPC URL**: https://rpc.primordial.bdagscan.com
- **Chain ID**: 1043
- **Currency**: BDAG
- **Explorer**: https://primordial.bdagscan.com

### MetaMask Setup
1. Open MetaMask
2. Add Custom Network:
   - Network Name: `BlockDAG Primordial`
   - RPC URL: `https://rpc.primordial.bdagscan.com`
   - Chain ID: `1043`
   - Currency Symbol: `BDAG`
   - Explorer: `https://primordial.bdagscan.com`

## 🔍 Contract Verification

The deployed contract can be verified on the BlockDAG explorer:

**Verification Status**: ✅ Successfully Deployed and Functional  
**Contract Functions**: All core functions (card creation, transactions, analytics) are working  
**Owner Verification**: Contract owner is properly set to deployer address  
**User Registration**: Available for authorized users  

### Manual Verification Commands
```bash
# Verify contract deployment
npx hardhat verify --network blockdag_primordial 0xe44Ac990DB939D0Df18f0A8C7cd0326E6A10bc1f

# Check contract owner
npx hardhat console --network blockdag_primordial
> const contract = await ethers.getContractAt("CardSmart", "0xe44Ac990DB939D0Df18f0A8C7cd0326E6A10bc1f")
> await contract.owner()
```

## 📱 Application Features

### Dashboard
- Real-time card overview
- Transaction history
- Spending analytics
- Monthly insights

### Card Management
- Create new cards
- Update card details
- Set credit limits
- Activate/deactivate cards

### Transaction Tracking
- Record transactions
- Blockchain confirmation
- Category-based filtering
- Income vs. expense tracking

### Analytics
- Spending patterns
- Monthly summaries
- Category insights
- Historical data

## 🔐 Security Features

- **OpenZeppelin Integration**: Industry-standard security libraries
- **Access Control**: Owner-only administrative functions
- **Reentrancy Protection**: Prevents attack vectors
- **Input Validation**: Comprehensive parameter checking
- **Event Logging**: Complete audit trail

## 🌐 Blockchain Integration

### Transaction Flow
1. User initiates action on frontend
2. MetaMask prompts for transaction approval
3. Transaction submitted to BlockDAG network
4. Smart contract processes and emits events
5. Frontend updates with confirmed data

### Gas Optimization
- Efficient storage patterns
- Batch operations where possible
- Minimal external calls
- Optimized data structures

## 🔄 Deployment Verification Checklist

✅ **Smart Contract Deployed**: Contract successfully deployed to BlockDAG Primordial  
✅ **Transaction Confirmed**: Deployment transaction confirmed on blockchain  
✅ **Contract Address Accessible**: Contract responds to function calls  
✅ **Owner Set Correctly**: Contract owner matches deployer address  
✅ **Functions Working**: Core functions (registerUser, createCard) operational  
✅ **Events Emitting**: Contract events are properly emitted  
✅ **Frontend Integration**: dApp can interact with deployed contract  
✅ **Explorer Verification**: Contract visible on BlockDAG explorer  

## 📊 Project Statistics

- **Contract Size**: ~15KB (optimized)
- **Functions**: 15+ public functions
- **Events**: 6 major event types
- **Gas Usage**: ~3M gas for deployment
- **Test Coverage**: Comprehensive testing suite

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live dApp**: [CardSmart Application](https://your-domain.com)
- **Contract Explorer**: https://primordial.bdagscan.com/address/0xe44Ac990DB939D0Df18f0A8C7cd0326E6A10bc1f
- **BlockDAG Documentation**: https://docs.blockdag.org
- **Faucet**: https://primordial.bdagscan.com/faucet

## 📞 Support

For questions and support:
- **GitHub Issues**: [Create an issue](https://github.com/MukeshR-prog/block-dag-2025/issues)
- **Email**: support@cardsmart.io
- **Discord**: [Join our community](https://discord.gg/cardsmart)

---

**Built with ❤️ for the BlockDAG Ecosystem**
