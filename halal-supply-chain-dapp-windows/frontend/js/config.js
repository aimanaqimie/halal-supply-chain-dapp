// Frontend Configuration for Halal Supply Chain dApp
// Update this file after deploying your contract

// UPDATE THIS WITH YOUR DEPLOYED CONTRACT ADDRESS
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";

// Sepolia Testnet Configuration
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in hex
const SEPOLIA_RPC_URL = "https://sepolia.infura.io/v3/YOUR_INFURA_KEY";

// Contract ABI (Application Binary Interface)
const CONTRACT_ABI = [
  "function admin() view returns (address)",
  "function batchCounter() view returns (uint256)",
  "function certCounter() view returns (uint256)",
  "function registerUser(address _userAddress, string _name, uint8 _role)",
  "function deactivateUser(address _userAddress)",
  "function createBatch(string _animalType, uint256 _quantity)",
  "function updateBatchStatus(uint256 _batchId, uint8 _newStatus, string _location)",
  "function requestHalalCertification(uint256 _batchId)",
  "function approveCertificate(uint256 _certId, string _comments)",
  "function rejectCertificate(uint256 _certId, string _reason)",
  "function getBatchDetails(uint256 _batchId) view returns (tuple(uint256 batchId, address farmer, string animalType, uint256 quantity, uint256 createdAt, uint8 status, bool exists))",
  "function getCertificateDetails(uint256 _certId) view returns (tuple(uint256 certId, uint256 batchId, address slaughterhouse, address jakimOfficer, uint8 status, string comments, uint256 issuedAt))",
  "function getSupplyChainHistory(uint256 _batchId) view returns (tuple(address actor, string action, uint256 timestamp, string location)[])",
  "function getUserDetails(address _userAddress) view returns (tuple(address userAddress, string name, uint8 role, bool isActive))",
  "function getBatchCertificate(uint256 _batchId) view returns (uint256)",
  "function isHalalCertified(uint256 _batchId) view returns (bool)",
  "event UserRegistered(address indexed userAddress, string name, uint8 role)",
  "event BatchCreated(uint256 indexed batchId, address indexed farmer, string animalType, uint256 quantity)",
  "event BatchStatusUpdated(uint256 indexed batchId, uint8 newStatus, address indexed updatedBy)",
  "event CertificateRequested(uint256 indexed certId, uint256 indexed batchId, address indexed slaughterhouse)",
  "event CertificateApproved(uint256 indexed certId, address indexed jakimOfficer)",
  "event CertificateRejected(uint256 indexed certId, address indexed jakimOfficer, string reason)"
];

// Role Enum
const Role = {
  None: 0,
  Admin: 1,
  Farmer: 2,
  Slaughterhouse: 3,
  Processor: 4,
  Distributor: 5,
  Retailer: 6,
  JAKIM: 7,
  Consumer: 8
};

// Batch Status Enum
const BatchStatus = {
  Created: 0,
  Slaughtered: 1,
  Processed: 2,
  InTransit: 3,
  AtRetailer: 4,
  Sold: 5
};

// Certificate Status Enum
const CertStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2
};

// Helper Functions
function getRoleName(roleId) {
  const roleNames = ["None", "Admin", "Farmer", "Slaughterhouse", "Processor", "Distributor", "Retailer", "JAKIM", "Consumer"];
  return roleNames[roleId] || "Unknown";
}

function getStatusName(statusId) {
  const statusNames = ["Created", "Slaughtered", "Processed", "In Transit", "At Retailer", "Sold"];
  return statusNames[statusId] || "Unknown";
}

function getCertStatusName(statusId) {
  const certStatusNames = ["Pending", "Approved", "Rejected"];
  return certStatusNames[statusId] || "Unknown";
}
