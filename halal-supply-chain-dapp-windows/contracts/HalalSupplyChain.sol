// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HalalSupplyChain
 * @dev Blockchain-based Halal Supply Chain Tracking System
 * @notice This contract manages the halal supply chain from farm to consumer
 */
contract HalalSupplyChain {
    
    // Enums for various statuses
    enum Role { None, Admin, Farmer, Slaughterhouse, Processor, Distributor, Retailer, JAKIM, Consumer }
    enum BatchStatus { Created, Slaughtered, Processed, InTransit, AtRetailer, Sold }
    enum CertStatus { Pending, Approved, Rejected }
    
    // Structs
    struct User {
        address userAddress;
        string name;
        Role role;
        bool isActive;
    }
    
    struct Batch {
        uint256 batchId;
        address farmer;
        string animalType;
        uint256 quantity;
        uint256 createdAt;
        BatchStatus status;
        bool exists;
    }
    
    struct HalalCertificate {
        uint256 certId;
        uint256 batchId;
        address slaughterhouse;
        address jakimOfficer;
        CertStatus status;
        string comments;
        uint256 issuedAt;
    }
    
    struct SupplyChainRecord {
        address actor;
        string action;
        uint256 timestamp;
        string location;
    }
    
    // State variables
    address public admin;
    uint256 public batchCounter;
    uint256 public certCounter;
    
    // Mappings
    mapping(address => User) public users;
    mapping(uint256 => Batch) public batches;
    mapping(uint256 => HalalCertificate) public certificates;
    mapping(uint256 => SupplyChainRecord[]) public supplyChainHistory;
    mapping(uint256 => uint256) public batchToCert; // batchId => certId
    
    // Events
    event UserRegistered(address indexed userAddress, string name, Role role);
    event UserDeactivated(address indexed userAddress);
    event BatchCreated(uint256 indexed batchId, address indexed farmer, string animalType, uint256 quantity);
    event BatchStatusUpdated(uint256 indexed batchId, BatchStatus newStatus, address indexed updatedBy);
    event CertificateRequested(uint256 indexed certId, uint256 indexed batchId, address indexed slaughterhouse);
    event CertificateApproved(uint256 indexed certId, address indexed jakimOfficer);
    event CertificateRejected(uint256 indexed certId, address indexed jakimOfficer, string reason);
    event SupplyChainRecordAdded(uint256 indexed batchId, address indexed actor, string action);
    
    // Modifiers
    modifier onlyAdmin() {
        require(users[msg.sender].role == Role.Admin, "Only admin can perform this action");
        require(users[msg.sender].isActive, "Admin account is not active");
        _;
    }
    
    modifier onlyRole(Role _role) {
        require(users[msg.sender].role == _role, "Unauthorized role");
        require(users[msg.sender].isActive, "Account is not active");
        _;
    }
    
    modifier batchExists(uint256 _batchId) {
        require(batches[_batchId].exists, "Batch does not exist");
        _;
    }
    
    // Constructor
    constructor() {
        admin = msg.sender;
        users[msg.sender] = User({
            userAddress: msg.sender,
            name: "System Admin",
            role: Role.Admin,
            isActive: true
        });
        emit UserRegistered(msg.sender, "System Admin", Role.Admin);
    }
    
    // User Management Functions
    function registerUser(address _userAddress, string memory _name, Role _role) public onlyAdmin {
        require(_role != Role.None, "Invalid role");
        require(_role != Role.Admin, "Cannot register admin through this function");
        require(users[_userAddress].role == Role.None, "User already registered");
        
        users[_userAddress] = User({
            userAddress: _userAddress,
            name: _name,
            role: _role,
            isActive: true
        });
        
        emit UserRegistered(_userAddress, _name, _role);
    }
    
    function deactivateUser(address _userAddress) public onlyAdmin {
        require(users[_userAddress].role != Role.None, "User not registered");
        require(_userAddress != admin, "Cannot deactivate admin");
        
        users[_userAddress].isActive = false;
        emit UserDeactivated(_userAddress);
    }
    
    // Batch Management Functions
    function createBatch(string memory _animalType, uint256 _quantity) public onlyRole(Role.Farmer) {
        require(_quantity > 0, "Quantity must be greater than zero");
        
        batchCounter++;
        batches[batchCounter] = Batch({
            batchId: batchCounter,
            farmer: msg.sender,
            animalType: _animalType,
            quantity: _quantity,
            createdAt: block.timestamp,
            status: BatchStatus.Created,
            exists: true
        });
        
        _addSupplyChainRecord(batchCounter, "Batch created by farmer", "Farm");
        emit BatchCreated(batchCounter, msg.sender, _animalType, _quantity);
    }
    
    function updateBatchStatus(uint256 _batchId, BatchStatus _newStatus, string memory _location) 
        public 
        batchExists(_batchId) 
    {
        Batch storage batch = batches[_batchId];
        Role userRole = users[msg.sender].role;
        require(users[msg.sender].isActive, "Account is not active");
        
        // Validate status transitions based on role
        if (_newStatus == BatchStatus.Slaughtered) {
            require(userRole == Role.Slaughterhouse, "Only slaughterhouse can mark as slaughtered");
            require(batch.status == BatchStatus.Created, "Invalid status transition");
        } else if (_newStatus == BatchStatus.Processed) {
            require(userRole == Role.Processor, "Only processor can mark as processed");
            require(batch.status == BatchStatus.Slaughtered, "Invalid status transition");
            // Check if halal certificate is approved
            uint256 certId = batchToCert[_batchId];
            require(certId > 0 && certificates[certId].status == CertStatus.Approved, "Halal certificate must be approved");
        } else if (_newStatus == BatchStatus.InTransit) {
            require(userRole == Role.Distributor, "Only distributor can mark as in transit");
            require(batch.status == BatchStatus.Processed, "Invalid status transition");
        } else if (_newStatus == BatchStatus.AtRetailer) {
            require(userRole == Role.Retailer, "Only retailer can mark as at retailer");
            require(batch.status == BatchStatus.InTransit, "Invalid status transition");
        } else if (_newStatus == BatchStatus.Sold) {
            require(userRole == Role.Retailer, "Only retailer can mark as sold");
            require(batch.status == BatchStatus.AtRetailer, "Invalid status transition");
        }
        
        batch.status = _newStatus;
        string memory action = _getStatusAction(_newStatus);
        _addSupplyChainRecord(_batchId, action, _location);
        
        emit BatchStatusUpdated(_batchId, _newStatus, msg.sender);
    }
    
    // Halal Certification Functions
    function requestHalalCertification(uint256 _batchId) 
        public 
        onlyRole(Role.Slaughterhouse) 
        batchExists(_batchId) 
    {
        require(batches[_batchId].status == BatchStatus.Slaughtered, "Batch must be slaughtered first");
        require(batchToCert[_batchId] == 0, "Certificate already requested for this batch");
        
        certCounter++;
        certificates[certCounter] = HalalCertificate({
            certId: certCounter,
            batchId: _batchId,
            slaughterhouse: msg.sender,
            jakimOfficer: address(0),
            status: CertStatus.Pending,
            comments: "",
            issuedAt: block.timestamp
        });
        
        batchToCert[_batchId] = certCounter;
        _addSupplyChainRecord(_batchId, "Halal certification requested", "Slaughterhouse");
        
        emit CertificateRequested(certCounter, _batchId, msg.sender);
    }
    
    function approveCertificate(uint256 _certId, string memory _comments) public onlyRole(Role.JAKIM) {
        require(_certId > 0 && _certId <= certCounter, "Invalid certificate ID");
        HalalCertificate storage cert = certificates[_certId];
        require(cert.status == CertStatus.Pending, "Certificate already processed");
        
        cert.status = CertStatus.Approved;
        cert.jakimOfficer = msg.sender;
        cert.comments = _comments;
        
        _addSupplyChainRecord(cert.batchId, "Halal certification approved by JAKIM", "JAKIM Office");
        emit CertificateApproved(_certId, msg.sender);
    }
    
    function rejectCertificate(uint256 _certId, string memory _reason) public onlyRole(Role.JAKIM) {
        require(_certId > 0 && _certId <= certCounter, "Invalid certificate ID");
        HalalCertificate storage cert = certificates[_certId];
        require(cert.status == CertStatus.Pending, "Certificate already processed");
        
        cert.status = CertStatus.Rejected;
        cert.jakimOfficer = msg.sender;
        cert.comments = _reason;
        
        _addSupplyChainRecord(cert.batchId, "Halal certification rejected by JAKIM", "JAKIM Office");
        emit CertificateRejected(_certId, msg.sender, _reason);
    }
    
    // View Functions
    function getBatchDetails(uint256 _batchId) public view batchExists(_batchId) returns (Batch memory) {
        return batches[_batchId];
    }
    
    function getCertificateDetails(uint256 _certId) public view returns (HalalCertificate memory) {
        require(_certId > 0 && _certId <= certCounter, "Invalid certificate ID");
        return certificates[_certId];
    }
    
    function getSupplyChainHistory(uint256 _batchId) public view batchExists(_batchId) returns (SupplyChainRecord[] memory) {
        return supplyChainHistory[_batchId];
    }
    
    function getUserDetails(address _userAddress) public view returns (User memory) {
        return users[_userAddress];
    }
    
    function getBatchCertificate(uint256 _batchId) public view batchExists(_batchId) returns (uint256) {
        return batchToCert[_batchId];
    }
    
    function isHalalCertified(uint256 _batchId) public view batchExists(_batchId) returns (bool) {
        uint256 certId = batchToCert[_batchId];
        if (certId == 0) return false;
        return certificates[certId].status == CertStatus.Approved;
    }
    
    // Internal Functions
    function _addSupplyChainRecord(uint256 _batchId, string memory _action, string memory _location) internal {
        supplyChainHistory[_batchId].push(SupplyChainRecord({
            actor: msg.sender,
            action: _action,
            timestamp: block.timestamp,
            location: _location
        }));
        
        emit SupplyChainRecordAdded(_batchId, msg.sender, _action);
    }
    
    function _getStatusAction(BatchStatus _status) internal pure returns (string memory) {
        if (_status == BatchStatus.Slaughtered) return "Batch slaughtered";
        if (_status == BatchStatus.Processed) return "Batch processed";
        if (_status == BatchStatus.InTransit) return "Batch in transit";
        if (_status == BatchStatus.AtRetailer) return "Batch arrived at retailer";
        if (_status == BatchStatus.Sold) return "Batch sold to consumer";
        return "Status updated";
    }
}
