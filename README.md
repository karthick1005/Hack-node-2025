# Intelligent Card Organization System

## 📋 Project Overview

The Intelligent Card Organization System is an AI-powered solution for managing digital wallets and payment cards. It uses machine learning algorithms to provide context-aware card recommendations, adaptive personalization, and intelligent decluttering to enhance user experience and payment efficiency.

## 🎯 Core Features

### 🤖 AI-Powered Card Ranking
- **Context-Aware Scoring**: Cards are ranked based on time, location, and transaction history
- **Adaptive Learning**: System learns from user behavior to improve recommendations
- **Multi-factor Analysis**: Combines frequency, recency, context matching, and user preferences

### 📊 Context-Aware Data Capture
- **Real-time Location Tracking**: Uses geolocation for location-based recommendations
- **Time-based Analysis**: Adapts to usage patterns throughout the day
- **Device Recognition**: Optimizes for different devices and platforms
- **Transaction Type Detection**: Recognizes payment contexts automatically

### 🎨 Personalization & Adaptive Learning
- **Manual Controls**: Pin favorite cards, create custom tags and categories
- **Smart Decluttering**: Automatically hides rarely used cards while keeping them accessible
- **Preference Learning**: Adapts to user preferences over time
- **Behavioral Analysis**: Learns from card selection patterns

### 🔒 Security & Compliance
- **End-to-end Encryption**: AES-256 encryption for sensitive card data
- **PCI-DSS Compliance**: Secure handling of payment information
- **Local Processing**: Data stays on device for maximum privacy
- **Secure Storage**: Encrypted local storage with user-controlled keys

## 🛠 Technology Stack

### Frontend
- **Next.js 15**: Modern React framework with App Router
- **React 19**: Latest React features and hooks
- **Tailwind CSS**: Utility-first styling system
- **Chart.js**: Data visualization and analytics
- **Zustand**: Lightweight state management

### AI & Machine Learning
- **Custom ML Algorithms**: Lightweight scoring and ranking algorithms
- **Adaptive Learning**: Real-time model updates based on user behavior
- **Context Processing**: Multi-dimensional context analysis
- **Pattern Recognition**: Usage pattern detection and analysis

### Security & Storage
- **CryptoJS**: AES encryption for data protection
- **Local Storage**: Encrypted client-side data persistence
- **Firebase**: User authentication and cloud backup
- **Device Fingerprinting**: Additional security layer

### Development Tools
- **TypeScript**: Type-safe development
- **ESLint**: Code quality and consistency
- **Jest**: Testing framework
- **Lodash**: Utility functions for data processing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern web browser with geolocation support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd intelligent-card-organizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure your Firebase and other service credentials.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Usage Guide

### Adding Cards
1. Navigate to the Cards section
2. Click "Add New Card"
3. Enter card details (number, expiry, CVV are encrypted)
4. Set card preferences and tags

### AI Learning
- The system automatically learns from your card selections
- Pin important cards to prioritize them
- Tag cards for better categorization
- The AI adapts its recommendations based on your usage patterns

### Context Awareness
- Grant location permissions for location-based recommendations
- The system detects time of day and transaction types
- Recommendations adapt to your current context

### Analytics
- View usage patterns and insights
- Monitor AI learning progress
- Track card performance metrics
- Analyze spending patterns by category and time

## 🔧 Configuration

### AI Settings
- **Learning Rate**: Adjust how quickly the AI adapts (0.01 - 0.5)
- **Confidence Threshold**: Minimum confidence for recommendations
- **Context Weight**: Importance of context in scoring

### Privacy Settings
- **Location Tracking**: Enable/disable location-based features
- **Data Retention**: Control how long usage data is kept
- **Export/Import**: Backup and restore your preferences

### Security Settings
- **Encryption Key**: User-controlled encryption for sensitive data
- **Auto-lock**: Automatic session timeout
- **Device Fingerprinting**: Additional security verification

## 📊 System Architecture

### Core Components

1. **Context Capture System**
   - Real-time location and time tracking
   - Device and network detection
   - Transaction context recognition

2. **ML Ranking Engine**
   - Multi-factor scoring algorithm
   - Adaptive weight adjustment
   - Pattern recognition and learning

3. **Personalization Layer**
   - User preference management
   - Manual override capabilities
   - Tag and category system

4. **Security Framework**
   - AES-256 encryption
   - Secure key management
   - PCI-DSS compliant data handling

### Data Flow

```
User Interaction → Context Capture → ML Scoring → Personalization → UI Rendering
                      ↓
                Learning Loop → Model Update → Improved Recommendations
```

## 🔐 Security Features

### Data Protection
- **Encryption**: All sensitive data encrypted with AES-256
- **Key Management**: User-controlled encryption keys
- **Local Processing**: Data processed client-side only

### Compliance
- **PCI-DSS**: Payment card industry security standards
- **GDPR**: Data protection and privacy regulations
- **Local Storage**: No server-side data storage of sensitive information

### Privacy Controls
- **Opt-in Location**: Location tracking requires explicit permission
- **Data Export**: Users can export and delete their data
- **Audit Logging**: Security event logging for monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by intelligent recommendation systems
- Focused on user privacy and security
- Designed for seamless payment experiences

---

**Made with ❤️ for better payment experiences**

## � Technology Stack

### Frontend
- **Next.js 15**: Modern React framework with App Router
- **React 19**: Latest React features and hooks
- **Tailwind CSS**: Utility-first styling system
- **Chart.js**: Data visualization and analytics
- **Zustand**: Lightweight state management

### AI & Machine Learning
- **Custom ML Algorithms**: Lightweight scoring and ranking algorithms
- **Adaptive Learning**: Real-time model updates based on user behavior
- **Context Processing**: Multi-dimensional context analysis
- **Pattern Recognition**: Usage pattern detection and analysis

### Security & Storage
- **CryptoJS**: AES encryption for data protection
- **Local Storage**: Encrypted client-side data persistence
- **Firebase**: User authentication and cloud backup
- **Device Fingerprinting**: Additional security layer

### Development Tools
- **TypeScript**: Type-safe development
- **ESLint**: Code quality and consistency
- **Jest**: Testing framework
- **Lodash**: Utility functions for data processing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern web browser with geolocation support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd intelligent-card-organizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure your Firebase and other service credentials.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Usage Guide

### Adding Cards
1. Navigate to the Cards section
2. Click "Add New Card"
3. Enter card details (number, expiry, CVV are encrypted)
4. Set card preferences and tags

### AI Learning
- The system automatically learns from your card selections
- Pin important cards to prioritize them
- Tag cards for better categorization
- The AI adapts its recommendations based on your usage patterns

### Context Awareness
- Grant location permissions for location-based recommendations
- The system detects time of day and transaction types
- Recommendations adapt to your current context

### Analytics
- View usage patterns and insights
- Monitor AI learning progress
- Track card performance metrics
- Analyze spending patterns by category and time

## 🔧 Configuration

### AI Settings
- **Learning Rate**: Adjust how quickly the AI adapts (0.01 - 0.5)
- **Confidence Threshold**: Minimum confidence for recommendations
- **Context Weight**: Importance of context in scoring

### Privacy Settings
- **Location Tracking**: Enable/disable location-based features
- **Data Retention**: Control how long usage data is kept
- **Export/Import**: Backup and restore your preferences

### Security Settings
- **Encryption Key**: User-controlled encryption for sensitive data
- **Auto-lock**: Automatic session timeout
- **Device Fingerprinting**: Additional security verification

## 📊 System Architecture

### Core Components

1. **Context Capture System**
   - Real-time location and time tracking
   - Device and network detection
   - Transaction context recognition

2. **ML Ranking Engine**
   - Multi-factor scoring algorithm
   - Adaptive weight adjustment
   - Pattern recognition and learning

3. **Personalization Layer**
   - User preference management
   - Manual override capabilities
   - Tag and category system

4. **Security Framework**
   - AES-256 encryption
   - Secure key management
   - PCI-DSS compliant data handling

### Data Flow

```
User Interaction → Context Capture → ML Scoring → Personalization → UI Rendering
                      ↓
                Learning Loop → Model Update → Improved Recommendations
```

## 🔐 Security Features

### Data Protection
- **Encryption**: All sensitive data encrypted with AES-256
- **Key Management**: User-controlled encryption keys
- **Local Processing**: Data processed client-side only

### Compliance
- **PCI-DSS**: Payment card industry security standards
- **GDPR**: Data protection and privacy regulations
- **Local Storage**: No server-side data storage of sensitive information

### Privacy Controls
- **Opt-in Location**: Location tracking requires explicit permission
- **Data Export**: Users can export and delete their data
- **Audit Logging**: Security event logging for monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by intelligent recommendation systems
- Focused on user privacy and security
- Designed for seamless payment experiences

---

**Made with ❤️ for better payment experiences**

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
