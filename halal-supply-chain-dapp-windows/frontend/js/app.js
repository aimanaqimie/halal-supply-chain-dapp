// Main Application JavaScript
let provider, signer, contract, currentAccount, userRole;

// Initialize the app when the page loads
window.addEventListener('load', async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        await init();
    } else {
        showMessage('Please install MetaMask to use this dApp', 'error');
        document.getElementById('connectButton').disabled = true;
    }
});

// Initialize Web3 connection
async function init() {
    try {
        // Setup event listeners
        document.getElementById('connectButton').addEventListener('click', connectWallet);
        
        // Check if already connected
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            await connectWallet();
        }

        // Listen for account changes
        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('chainChanged', handleChainChanged);
    } catch (error) {
        console.error('Initialization error:', error);
        showMessage('Error initializing app: ' + error.message, 'error');
    }
}

// Connect to MetaMask
async function connectWallet() {
    try {
        // Request account access
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        currentAccount = accounts[0];

        // Setup provider and signer
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();

        // Check network
        const network = await provider.getNetwork();
        if (network.chainId !== BigInt(11155111)) {
            showMessage('Please switch to Sepolia testnet', 'error');
            await switchToSepolia();
            return;
        }

        // Initialize contract
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        // Update UI
        document.getElementById('currentAccount').textContent = 
            currentAccount.substring(0, 6) + '...' + currentAccount.substring(38);
        document.getElementById('connectButton').style.display = 'none';
        document.getElementById('accountInfo').style.display = 'block';

        // Load user details and show appropriate dashboard
        await loadUserDetails();

        showMessage('Wallet connected successfully', 'success');
    } catch (error) {
        console.error('Connection error:', error);
        showMessage('Error connecting wallet: ' + error.message, 'error');
    }
}

// Switch to Sepolia network
async function switchToSepolia() {
    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
    } catch (switchError) {
        // Network not added, try to add it
        if (switchError.code === 4902) {
            try {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: SEPOLIA_CHAIN_ID,
                        chainName: 'Sepolia Testnet',
                        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                        rpcUrls: [SEPOLIA_RPC_URL],
                        blockExplorerUrls: ['https://sepolia.etherscan.io/']
                    }],
                });
            } catch (addError) {
                showMessage('Error adding Sepolia network: ' + addError.message, 'error');
            }
        }
    }
}

// Load user details and role
async function loadUserDetails() {
    try {
        const userDetails = await contract.getUserDetails(currentAccount);
        userRole = Number(userDetails.role);
        const roleName = getRoleName(userRole);

        document.getElementById('currentRole').textContent = roleName;

        // Show appropriate dashboard
        hideAllDashboards();
        showDashboard(roleName.toLowerCase());
    } catch (error) {
        console.error('Error loading user details:', error);
        userRole = 0; // None
        document.getElementById('currentRole').textContent = 'Not Registered';
        showMessage('User not registered. Please contact admin.', 'error');
    }
}

// Dashboard visibility management
function hideAllDashboards() {
    const dashboards = document.querySelectorAll('.dashboard');
    dashboards.forEach(d => d.style.display = 'none');
}

function showDashboard(role) {
    const dashboard = document.getElementById(`${role}Dashboard`);
    if (dashboard) {
        dashboard.style.display = 'block';
        initializeDashboard(role);
    }
}

// Initialize specific dashboard functionality
function initializeDashboard(role) {
    switch(role) {
        case 'admin':
            loadAdminDashboard();
            break;
        case 'farmer':
            loadFarmerDashboard();
            break;
        case 'slaughterhouse':
            loadSlaughterhouseDashboard();
            break;
        case 'processor':
            loadProcessorDashboard();
            break;
        case 'distributor':
            loadDistributorDashboard();
            break;
        case 'retailer':
            loadRetailerDashboard();
            break;
        case 'jakim':
            loadJAKIMDashboard();
            break;
        case 'consumer':
            loadConsumerDashboard();
            break;
    }
}

// Admin Dashboard Functions
function loadAdminDashboard() {
    document.getElementById('registerUserForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const address = document.getElementById('userAddress').value;
        const name = document.getElementById('userName').value;
        const role = document.getElementById('userRole').value;

        try {
            const tx = await contract.registerUser(address, name, role);
            showMessage('Registering user... Please wait', 'info');
            await tx.wait();
            showMessage('User registered successfully!', 'success');
            e.target.reset();
        } catch (error) {
            showMessage('Error registering user: ' + error.message, 'error');
        }
    });
}

// Farmer Dashboard Functions
function loadFarmerDashboard() {
    document.getElementById('createBatchForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const animalType = document.getElementById('animalType').value;
        const quantity = document.getElementById('quantity').value;

        try {
            const tx = await contract.createBatch(animalType, quantity);
            showMessage('Creating batch... Please wait', 'info');
            await tx.wait();
            showMessage('Batch created successfully!', 'success');
            e.target.reset();
            await loadMyBatches();
        } catch (error) {
            showMessage('Error creating batch: ' + error.message, 'error');
        }
    });

    loadMyBatches();
}

async function loadMyBatches() {
    try {
        const batchCount = await contract.batchCounter();
        const batchesList = document.getElementById('myBatchesList');
        batchesList.innerHTML = '';

        for (let i = 1; i <= batchCount; i++) {
            const batch = await contract.getBatchDetails(i);
            if (batch.farmer.toLowerCase() === currentAccount.toLowerCase()) {
                const batchCard = createBatchCard(batch);
                batchesList.appendChild(batchCard);
            }
        }
    } catch (error) {
        console.error('Error loading batches:', error);
    }
}

// Slaughterhouse Dashboard Functions
function loadSlaughterhouseDashboard() {
    document.getElementById('updateStatusForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const batchId = document.getElementById('batchIdStatus').value;

        try {
            const tx = await contract.updateBatchStatus(batchId, BatchStatus.Slaughtered, "Slaughterhouse");
            showMessage('Updating status... Please wait', 'info');
            await tx.wait();
            showMessage('Batch marked as slaughtered!', 'success');
            e.target.reset();
        } catch (error) {
            showMessage('Error updating status: ' + error.message, 'error');
        }
    });

    document.getElementById('requestCertForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const batchId = document.getElementById('batchIdCert').value;

        try {
            const tx = await contract.requestHalalCertification(batchId);
            showMessage('Requesting certification... Please wait', 'info');
            await tx.wait();
            showMessage('Halal certification requested!', 'success');
            e.target.reset();
        } catch (error) {
            showMessage('Error requesting certification: ' + error.message, 'error');
        }
    });
}

// Processor Dashboard Functions
function loadProcessorDashboard() {
    document.getElementById('processBatchForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const batchId = document.getElementById('processBatchId').value;

        try {
            const tx = await contract.updateBatchStatus(batchId, BatchStatus.Processed, "Processing Plant");
            showMessage('Processing batch... Please wait', 'info');
            await tx.wait();
            showMessage('Batch processed successfully!', 'success');
            e.target.reset();
        } catch (error) {
            showMessage('Error processing batch: ' + error.message, 'error');
        }
    });
}

// Distributor Dashboard Functions
function loadDistributorDashboard() {
    document.getElementById('shipBatchForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const batchId = document.getElementById('shipBatchId').value;

        try {
            const tx = await contract.updateBatchStatus(batchId, BatchStatus.InTransit, "Distribution Center");
            showMessage('Shipping batch... Please wait', 'info');
            await tx.wait();
            showMessage('Batch shipped successfully!', 'success');
            e.target.reset();
        } catch (error) {
            showMessage('Error shipping batch: ' + error.message, 'error');
        }
    });
}

// Retailer Dashboard Functions
function loadRetailerDashboard() {
    document.getElementById('receiveBatchForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const batchId = document.getElementById('receiveBatchId').value;

        try {
            const tx = await contract.updateBatchStatus(batchId, BatchStatus.AtRetailer, "Retail Store");
            showMessage('Receiving batch... Please wait', 'info');
            await tx.wait();
            showMessage('Batch received successfully!', 'success');
            e.target.reset();
        } catch (error) {
            showMessage('Error receiving batch: ' + error.message, 'error');
        }
    });

    document.getElementById('sellBatchForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const batchId = document.getElementById('sellBatchId').value;

        try {
            const tx = await contract.updateBatchStatus(batchId, BatchStatus.Sold, "Retail Store");
            showMessage('Selling batch... Please wait', 'info');
            await tx.wait();
            showMessage('Batch sold successfully!', 'success');
            e.target.reset();
        } catch (error) {
            showMessage('Error selling batch: ' + error.message, 'error');
        }
    });
}

// JAKIM Dashboard Functions
function loadJAKIMDashboard() {
    loadPendingCertificates();

    document.getElementById('approveCertForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const certId = document.getElementById('approveCertId').value;
        const comments = document.getElementById('approveComments').value;

        try {
            const tx = await contract.approveCertificate(certId, comments);
            showMessage('Approving certificate... Please wait', 'info');
            await tx.wait();
            showMessage('Certificate approved!', 'success');
            e.target.reset();
            await loadPendingCertificates();
        } catch (error) {
            showMessage('Error approving certificate: ' + error.message, 'error');
        }
    });

    document.getElementById('rejectCertForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const certId = document.getElementById('rejectCertId').value;
        const reason = document.getElementById('rejectReason').value;

        try {
            const tx = await contract.rejectCertificate(certId, reason);
            showMessage('Rejecting certificate... Please wait', 'info');
            await tx.wait();
            showMessage('Certificate rejected!', 'success');
            e.target.reset();
            await loadPendingCertificates();
        } catch (error) {
            showMessage('Error rejecting certificate: ' + error.message, 'error');
        }
    });
}

async function loadPendingCertificates() {
    try {
        const certCount = await contract.certCounter();
        const certList = document.getElementById('pendingCertsList');
        certList.innerHTML = '';

        for (let i = 1; i <= certCount; i++) {
            const cert = await contract.getCertificateDetails(i);
            if (cert.status === CertStatus.Pending) {
                const certCard = createCertificateCard(cert);
                certList.appendChild(certCard);
            }
        }
    } catch (error) {
        console.error('Error loading certificates:', error);
    }
}

// Consumer Dashboard Functions
function loadConsumerDashboard() {
    document.getElementById('trackBatchForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const batchId = document.getElementById('trackBatchId').value;

        try {
            const batch = await contract.getBatchDetails(batchId);
            const isHalal = await contract.isHalalCertified(batchId);
            const history = await contract.getSupplyChainHistory(batchId);

            displayBatchInfo(batch, isHalal, history);
        } catch (error) {
            showMessage('Error tracking batch: ' + error.message, 'error');
        }
    });
}

function displayBatchInfo(batch, isHalal, history) {
    const infoDiv = document.getElementById('batchInfo');
    infoDiv.innerHTML = `
        <div class="info-card">
            <h3>Batch #${batch.batchId}</h3>
            <p><strong>Animal Type:</strong> ${batch.animalType}</p>
            <p><strong>Quantity:</strong> ${batch.quantity}</p>
            <p><strong>Status:</strong> ${getStatusName(batch.status)}</p>
            <p><strong>Halal Certified:</strong> ${isHalal ? '✅ Yes' : '❌ No'}</p>
            
            <h4>Supply Chain History:</h4>
            <div class="timeline">
                ${history.map(record => `
                    <div class="timeline-item">
                        <p><strong>${record.action}</strong></p>
                        <p>Location: ${record.location}</p>
                        <p>Date: ${new Date(Number(record.timestamp) * 1000).toLocaleString()}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    infoDiv.style.display = 'block';
}

// Helper function to create batch cards
function createBatchCard(batch) {
    const card = document.createElement('div');
    card.className = 'batch-card';
    card.innerHTML = `
        <h4>Batch #${batch.batchId}</h4>
        <p><strong>Type:</strong> ${batch.animalType}</p>
        <p><strong>Quantity:</strong> ${batch.quantity}</p>
        <p><strong>Status:</strong> ${getStatusName(batch.status)}</p>
        <p><strong>Created:</strong> ${new Date(Number(batch.createdAt) * 1000).toLocaleDateString()}</p>
    `;
    return card;
}

// Helper function to create certificate cards
function createCertificateCard(cert) {
    const card = document.createElement('div');
    card.className = 'cert-card';
    card.innerHTML = `
        <h4>Certificate #${cert.certId}</h4>
        <p><strong>Batch ID:</strong> ${cert.batchId}</p>
        <p><strong>Status:</strong> ${getCertStatusName(cert.status)}</p>
        <p><strong>Requested:</strong> ${new Date(Number(cert.issuedAt) * 1000).toLocaleDateString()}</p>
    `;
    return card;
}

// Handle account changes
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        showMessage('Please connect to MetaMask', 'error');
        location.reload();
    } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
        location.reload();
    }
}

// Handle chain changes
function handleChainChanged(chainId) {
    location.reload();
}

// Show message to user
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}
