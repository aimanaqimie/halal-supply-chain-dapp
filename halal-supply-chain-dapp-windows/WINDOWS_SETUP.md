# Windows Setup Instructions

## Step-by-Step Setup Guide for Windows

### 1. Prerequisites

Before starting, make sure you have:

- [ ] **Node.js installed** (v16 or higher)
  - Download from: https://nodejs.org/
  - Choose "LTS" version
  - Run installer and follow prompts
  
- [ ] **MetaMask browser extension**
  - Download from: https://metamask.io/
  - Create a wallet if you don't have one
  - **IMPORTANT**: Save your seed phrase securely!

- [ ] **VS Code** (recommended)
  - Download from: https://code.visualstudio.com/
  - Install with default settings

- [ ] **Git** (optional, but recommended)
  - Download from: https://git-scm.com/
  - Use during installation: "Git from the command line and also from 3rd-party software"

### 2. Extract and Open Project

#### Option A: Using File Explorer
1. Right-click on the ZIP file
2. Select "Extract All..."
3. Choose a location (e.g., `C:\Projects\`)
4. Click "Extract"

#### Option B: Using Command Prompt
```cmd
cd C:\Users\[YourUsername]\Downloads
tar -xf halal-supply-chain-dapp.zip
```

### 3. Open in VS Code

1. Open VS Code
2. Click `File` → `Open Folder`
3. Navigate to the extracted folder
4. Click "Select Folder"

### 4. Install Dependencies

Open terminal in VS Code (`Terminal` → `New Terminal` or `` Ctrl+` ``)

```cmd
npm install
```

**Expected output**: Installing packages... (this may take 2-5 minutes)

### 5. Set Up Environment Variables

1. In VS Code, open `.env.example`
2. Copy its contents
3. Create a new file named `.env` (no .example)
4. Paste the contents
5. Fill in your credentials:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_metamask_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
REPORT_GAS=false
CONTRACT_ADDRESS=deployed_contract_address_after_deployment
```

#### Getting Your Private Key (MetaMask):
⚠️ **SECURITY WARNING**: Never share your private key with anyone!

1. Open MetaMask
2. Click the three dots (⋮) next to your account
3. Select "Account Details"
4. Click "Show Private Key"
5. Enter your MetaMask password
6. Copy the private key
7. Paste into `.env` file

#### Getting Alchemy RPC URL:
1. Go to https://www.alchemy.com/
2. Sign up for free account
3. Create new app
4. Select "Sepolia" network
5. Copy the HTTPS URL
6. Paste into `.env` file

### 6. Compile Smart Contract

```cmd
npm run compile
```

**Expected output**: 
```
Compiled 1 Solidity file successfully
```

### 7. Run Tests

```cmd
npm test
```

**Expected output**: 
```
  16 passing (2s)
```

### 8. Get Sepolia Test ETH

1. Go to https://sepoliafaucet.com/
2. Enter your MetaMask wallet address
3. Click "Send Me ETH"
4. Wait 1-2 minutes for ETH to arrive
5. Check MetaMask (make sure you're on Sepolia network)

### 9. Deploy to Sepolia

```cmd
npm run deploy:sepolia
```

**Expected output**:
```
Deploying contracts with account: 0x...
Contract deployed to: 0x...
```

**IMPORTANT**: Copy the contract address!

### 10. Update Frontend Configuration

1. Open `frontend/js/config.js`
2. Find line: `const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";`
3. Replace with your deployed contract address
4. Save the file

### 11. Run Frontend

#### Option A: Open Directly
1. Navigate to `frontend` folder
2. Double-click `index.html`
3. Opens in your default browser

#### Option B: Using Local Server (Recommended)
```cmd
# Install http-server globally (one-time only)
npm install -g http-server

# Navigate to frontend
cd frontend

# Start server
http-server
```

Then open: http://localhost:8080

### 12. Connect to dApp

1. Click "Connect Wallet" button
2. MetaMask will pop up
3. Select account
4. Click "Connect"
5. Approve connection
6. Your role will be displayed

### 13. Register Users (Admin Only)

If you're the deployer, you're automatically Admin:

1. Your admin dashboard will show
2. Enter user address (from MetaMask)
3. Enter name
4. Select role
5. Click "Register User"
6. Approve transaction in MetaMask
7. Wait for confirmation

## Common Windows Issues and Fixes

### Issue 1: "npm is not recognized"

**Solution**: Add Node.js to PATH

1. Search "Environment Variables" in Windows
2. Click "Environment Variables"
3. Under "System Variables", find "Path"
4. Click "Edit"
5. Click "New"
6. Add: `C:\Program Files\nodejs\`
7. Click OK
8. Restart Command Prompt/VS Code

### Issue 2: Permission denied errors

**Solution**: Run VS Code as Administrator

1. Right-click VS Code icon
2. Select "Run as administrator"
3. Try command again

### Issue 3: MetaMask not detected

**Solution**: 
1. Refresh the page
2. Make sure MetaMask extension is enabled
3. Try a different browser
4. Reinstall MetaMask extension

### Issue 4: "Cannot find module"

**Solution**: 
```cmd
# Delete existing installations
rmdir /s /q node_modules
del package-lock.json

# Reinstall
npm install
```

### Issue 5: Git not available

**Solution**: Skip git-related commands or install Git from https://git-scm.com/

## Testing Your Setup

### Quick Test Checklist

- [ ] Node.js installed (check: `node --version`)
- [ ] npm working (check: `npm --version`)
- [ ] Dependencies installed (check: `node_modules` folder exists)
- [ ] Contract compiled (check: `artifacts` folder exists)
- [ ] Tests passing (run: `npm test`)
- [ ] Contract deployed (have contract address)
- [ ] Frontend configured (CONTRACT_ADDRESS updated)
- [ ] Frontend loads (open `index.html`)
- [ ] MetaMask connects (click "Connect Wallet")

## Next Steps

1. ✅ Complete setup checklist
2. 📝 Register test users
3. 🧪 Test complete workflow:
   - Farmer creates batch
   - Slaughterhouse updates status
   - Request halal certification
   - JAKIM approves
   - Processor processes
   - Distributor ships
   - Retailer receives and sells
   - Consumer verifies
4. 📊 Prepare demo
5. 📄 Complete report

## Video Tutorials (Optional)

For visual learners, search YouTube for:
- "Install Node.js on Windows"
- "MetaMask setup tutorial"
- "VS Code for beginners"
- "Hardhat tutorial"

## Getting Help

1. **Check error messages carefully** - they usually tell you what's wrong
2. **Google the error** - include "Windows" in search
3. **Check npm package versions** - make sure they match `package.json`
4. **Ask team members** - someone may have solved it already
5. **Check Hardhat documentation** - https://hardhat.org/docs

## Important Notes for Windows Users

- Use `\` for paths in Windows (e.g., `C:\Projects\`)
- Some commands may need to run as Administrator
- If you see `EPERM` errors, close VS Code and run as Administrator
- Always check Node.js and npm versions match requirements
- Use PowerShell or Command Prompt, not Git Bash for npm commands

---

Good luck with your project! 🚀
