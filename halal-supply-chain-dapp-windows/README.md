# Halal Supply Chain Tracking dApp

A blockchain-based decentralized application (dApp) for tracking halal products through the supply chain, from farm to consumer.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Deployment](#deployment)
- [Frontend Integration](#frontend-integration)
- [Contributing](#contributing)

## 🎯 Overview

This dApp provides a transparent and immutable system for tracking halal products through every stage of the supply chain. It ensures halal integrity by requiring JAKIM (Department of Islamic Development Malaysia) certification before products can be processed and sold.

### Key Stakeholders
1. **Admin** - System administrator
2. **Farmer** - Creates batches of animals
3. **Slaughterhouse** - Processes animals according to halal standards
4. **JAKIM** - Issues halal certifications
5. **Processor** - Processes certified halal meat
6. **Distributor** - Distributes products
7. **Retailer** - Sells to consumers
8. **Consumer** - Verifies product authenticity

## ✨ Features

- ✅ Role-based access control
- ✅ End-to-end supply chain tracking
- ✅ Halal certification management
- ✅ Immutable audit trail
- ✅ Web3 integration with MetaMask
- ✅ Real-time status updates
- ✅ Consumer verification system
- ✅ Comprehensive testing suite

## 🛠 Technology Stack

### Backend
- **Solidity ^0.8.20** - Smart contract language
- **Hardhat** - Development environment
- **Ethers.js v6** - Ethereum library
- **OpenZeppelin** - Smart contract security

### Frontend
- **HTML5/CSS3** - User interface
- **JavaScript (ES6+)** - Frontend logic
- **Ethers.js** - Web3 integration
- **MetaMask** - Wallet connection

### Testing
- **Mocha** - Testing framework
- **Chai** - Assertion library
- **Hardhat Network** - Local blockchain

### Deployment
- **Sepolia Testnet** - Ethereum testnet
- **Alchemy/Infura** - RPC provider
- **Etherscan** - Contract verification

## 📁 Project Structure

```
halal-supply-chain-dapp/
├── contracts/
│   └── HalalSupplyChain.sol          # Main smart contract
├── scripts/
│   └── deploy.js                      # Deployment script
├── test/
│   └── HalalSupplyChain.test.js      # Unit tests (16 tests)
├── frontend/
│   ├── index.html                     # Main HTML file
│   ├── css/
│   │   └── style.css                  # Styling
│   └── js/
│       ├── config.js                  # Configuration
│       └── app.js                     # Web3 integration
├── hardhat.config.js                  # Hardhat configuration
├── package.json                       # Dependencies
├── .env.example                       # Environment template
├── .gitignore                         # Git ignore rules
└── README.md                          # This file
```

## 🚀 Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MetaMask browser extension
- Sepolia testnet ETH (from faucet)

### Steps

1. **Extract the project** (if using archive)
   ```bash
   # Windows: Extract the ZIP file
   # Or use the extracted folder
   ```

2. **Navigate to project directory**
   ```bash
   cd halal-supply-chain-dapp-windows
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Copy the example file
   copy .env.example .env
   
   # Edit .env and add your credentials:
   # - SEPOLIA_RPC_URL (from Alchemy or Infura)
   # - PRIVATE_KEY (from MetaMask)
   ```

5. **Compile smart contracts**
   ```bash
   npm run compile
   ```

6. **Run tests**
   ```bash
   npm test
   ```

## 📖 Usage

### Running Tests

```bash
# Run all tests
npm test

# Run with gas reporting
npm run test:gas

# Run with coverage
npm run test:coverage
```

### Deploying to Sepolia

1. **Get Sepolia ETH**
   - Visit [Sepolia Faucet](https://sepoliafaucet.com/)
   - Enter your wallet address
   - Wait for ETH to arrive

2. **Configure .env**
   ```
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
   PRIVATE_KEY=your_metamask_private_key_here
   ```

3. **Deploy contract**
   ```bash
   npm run deploy:sepolia
   ```

4. **Save contract address**
   - Copy the deployed contract address
   - Update `frontend/js/config.js`:
     ```javascript
     const CONTRACT_ADDRESS = "0x..."; // Your deployed address
     ```

### Running the Frontend

1. **Open frontend**
   - Navigate to `frontend` folder
   - Open `index.html` in a web browser
   - Or use a local server:
     ```bash
     # Install http-server globally
     npm install -g http-server
     
     # Run server in frontend directory
     cd frontend
     http-server
     ```

2. **Connect MetaMask**
   - Click "Connect Wallet"
   - Approve connection
   - Switch to Sepolia network if needed

3. **Use the dApp**
   - Your role will be displayed automatically
   - Use the dashboard according to your role

## 🧪 Testing

The project includes 16 comprehensive unit tests:

### Test Categories

1. **User Management (4 tests)**
   - User registration
   - Role verification
   - User deactivation
   - Access control

2. **Batch Management (3 tests)**
   - Batch creation
   - Status updates
   - Role permissions

3. **Halal Certification (6 tests)**
   - Certificate requests
   - JAKIM approval/rejection
   - Processing requirements
   - Certification verification

4. **Supply Chain Flow (2 tests)**
   - Complete end-to-end flow
   - History tracking

5. **Security (1 test)**
   - Duplicate request prevention

### Running Tests

```bash
# Run all tests
npm test

# Expected output: 16 passing tests
```

## 🌐 Frontend Integration

### Connecting to Contract

The frontend uses Ethers.js to interact with the smart contract:

```javascript
// Initialize provider
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// Connect to contract
const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer
);

// Call contract function
const tx = await contract.createBatch("Chicken", 100);
await tx.wait();
```

### Role-Based Dashboards

Each role has a dedicated dashboard:

- **Admin**: Register users
- **Farmer**: Create batches
- **Slaughterhouse**: Update status, request certification
- **JAKIM**: Approve/reject certifications
- **Processor**: Process certified batches
- **Distributor**: Ship products
- **Retailer**: Receive and sell products
- **Consumer**: Track and verify products

## 🔒 Security Features

1. **Role-Based Access Control**
   - Only authorized roles can perform specific actions
   - Admin cannot be deactivated
   - Prevents unauthorized access

2. **Status Validation**
   - Enforces proper supply chain flow
   - Prevents invalid status transitions
   - Requires certification before processing

3. **Certificate Management**
   - Prevents duplicate certificate requests
   - JAKIM approval required for processing
   - Immutable certification records

## 📊 Smart Contract Functions

### User Management
- `registerUser(address, string, Role)` - Register new user
- `deactivateUser(address)` - Deactivate user
- `getUserDetails(address)` - Get user information

### Batch Management
- `createBatch(string, uint256)` - Create new batch
- `updateBatchStatus(uint256, BatchStatus, string)` - Update batch status
- `getBatchDetails(uint256)` - Get batch information

### Certification
- `requestHalalCertification(uint256)` - Request certificate
- `approveCertificate(uint256, string)` - Approve certificate
- `rejectCertificate(uint256, string)` - Reject certificate
- `isHalalCertified(uint256)` - Check certification status

### Tracking
- `getSupplyChainHistory(uint256)` - Get complete history
- `getBatchCertificate(uint256)` - Get certificate ID for batch

## 🐛 Troubleshooting

### Common Issues

1. **MetaMask not connecting**
   - Ensure MetaMask is installed
   - Check if you're on Sepolia network
   - Refresh the page

2. **Transaction failing**
   - Check if you have enough Sepolia ETH
   - Verify you have the correct role
   - Ensure batch status is correct

3. **Contract not found**
   - Verify CONTRACT_ADDRESS in config.js
   - Check if contract is deployed
   - Ensure you're on the correct network

4. **Installation errors**
   - Delete node_modules and package-lock.json
   - Run `npm install` again
   - Check Node.js version (v16+)

## 👥 Team

- **NexaChain Team**
  - Aiman
  - Hasanul  
  - Uzair

## 📄 License

MIT License

## 🙏 Acknowledgments

- CSCI 4312 - Blockchain & Applications course
- OpenZeppelin for security standards
- Hardhat development team
- Ethereum community

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review test cases for usage examples
3. Contact the development team
4. Submit issues on the project repository

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Course**: CSCI 4312 - Blockchain & Applications
