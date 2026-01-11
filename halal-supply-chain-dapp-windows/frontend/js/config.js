// Frontend Configuration for Halal Supply Chain dApp
// Update this file after deploying your contract

// UPDATE THIS WITH YOUR DEPLOYED CONTRACT ADDRESS
const CONTRACT_ADDRESS = "0xe5d3eb7Fd74418ecEdf159576Eb9D5D7D6C12651";

// Sepolia Testnet Configuration
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in hex
const SEPOLIA_RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";

// Contract ABI (Application Binary Interface)
const CONTRACT_ABI =
  [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "farmer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "animalType",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			}
		],
		"name": "BatchCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum HalalSupplyChain.BatchStatus",
				"name": "newStatus",
				"type": "uint8"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "updatedBy",
				"type": "address"
			}
		],
		"name": "BatchStatusUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "certId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "jakimOfficer",
				"type": "address"
			}
		],
		"name": "CertificateApproved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "certId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "jakimOfficer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "reason",
				"type": "string"
			}
		],
		"name": "CertificateRejected",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "certId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "slaughterhouse",
				"type": "address"
			}
		],
		"name": "CertificateRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "actor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "action",
				"type": "string"
			}
		],
		"name": "SupplyChainRecordAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "UserDeactivated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "enum HalalSupplyChain.Role",
				"name": "role",
				"type": "uint8"
			}
		],
		"name": "UserRegistered",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_certId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_comments",
				"type": "string"
			}
		],
		"name": "approveCertificate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "batchCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "batchToCert",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "batches",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "farmer",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "animalType",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "enum HalalSupplyChain.BatchStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "certCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "certificates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "certId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "slaughterhouse",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "jakimOfficer",
				"type": "address"
			},
			{
				"internalType": "enum HalalSupplyChain.CertStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "comments",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "issuedAt",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_animalType",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_quantity",
				"type": "uint256"
			}
		],
		"name": "createBatch",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			}
		],
		"name": "deactivateUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_batchId",
				"type": "uint256"
			}
		],
		"name": "getBatchCertificate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_batchId",
				"type": "uint256"
			}
		],
		"name": "getBatchDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "batchId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "farmer",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "animalType",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "quantity",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "createdAt",
						"type": "uint256"
					},
					{
						"internalType": "enum HalalSupplyChain.BatchStatus",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "bool",
						"name": "exists",
						"type": "bool"
					}
				],
				"internalType": "struct HalalSupplyChain.Batch",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_certId",
				"type": "uint256"
			}
		],
		"name": "getCertificateDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "certId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "batchId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "slaughterhouse",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "jakimOfficer",
						"type": "address"
					},
					{
						"internalType": "enum HalalSupplyChain.CertStatus",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "string",
						"name": "comments",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "issuedAt",
						"type": "uint256"
					}
				],
				"internalType": "struct HalalSupplyChain.HalalCertificate",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_batchId",
				"type": "uint256"
			}
		],
		"name": "getSupplyChainHistory",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "actor",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "action",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "location",
						"type": "string"
					}
				],
				"internalType": "struct HalalSupplyChain.SupplyChainRecord[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			}
		],
		"name": "getUserDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "userAddress",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "enum HalalSupplyChain.Role",
						"name": "role",
						"type": "uint8"
					},
					{
						"internalType": "bool",
						"name": "isActive",
						"type": "bool"
					}
				],
				"internalType": "struct HalalSupplyChain.User",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_batchId",
				"type": "uint256"
			}
		],
		"name": "isHalalCertified",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "enum HalalSupplyChain.Role",
				"name": "_role",
				"type": "uint8"
			}
		],
		"name": "registerUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_certId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_reason",
				"type": "string"
			}
		],
		"name": "rejectCertificate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_batchId",
				"type": "uint256"
			}
		],
		"name": "requestHalalCertification",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "supplyChainHistory",
		"outputs": [
			{
				"internalType": "address",
				"name": "actor",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "action",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_batchId",
				"type": "uint256"
			},
			{
				"internalType": "enum HalalSupplyChain.BatchStatus",
				"name": "_newStatus",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			}
		],
		"name": "updateBatchStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "enum HalalSupplyChain.Role",
				"name": "role",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

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

const BatchStatus = {
    Created: 0,
    Slaughtered: 1,
    Processed: 2,
    InTransit: 3,
    AtRetailer: 4,
    Sold: 5
};

const CertStatus = {
    Pending: 0,
    Approved: 1,
    Rejected: 2
};

function getRoleName(roleId) {
    const roles = ["None", "Admin", "Farmer", "Slaughterhouse", "Processor", "Distributor", "Retailer", "JAKIM", "Consumer"];
    return roles[roleId] || "Unknown";
}

function getStatusName(statusId) {
    const statuses = ["Created", "Slaughtered", "Processed", "In Transit", "At Retailer", "Sold"];
    return statuses[Number(statusId)] || "Unknown";
}

function getCertStatusName(statusId) {
    const statuses = ["Pending", "Approved", "Rejected"];
    return statuses[Number(statusId)] || "Unknown";
}