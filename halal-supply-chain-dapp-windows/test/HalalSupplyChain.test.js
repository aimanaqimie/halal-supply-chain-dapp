const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HalalSupplyChain", function () {
  let halalSupplyChain;
  let admin, farmer, slaughterhouse, processor, distributor, retailer, jakim, consumer;
  
  // Role enum values
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

  // BatchStatus enum values
  const BatchStatus = {
    Created: 0,
    Slaughtered: 1,
    Processed: 2,
    InTransit: 3,
    AtRetailer: 4,
    Sold: 5
  };

  // CertStatus enum values
  const CertStatus = {
    Pending: 0,
    Approved: 1,
    Rejected: 2
  };

  beforeEach(async function () {
    // Get signers
    [admin, farmer, slaughterhouse, processor, distributor, retailer, jakim, consumer] = await ethers.getSigners();

    // Deploy contract
    const HalalSupplyChain = await ethers.getContractFactory("HalalSupplyChain");
    halalSupplyChain = await HalalSupplyChain.deploy();
    await halalSupplyChain.waitForDeployment();

    // Register users
    await halalSupplyChain.connect(admin).registerUser(farmer.address, "Farmer One", Role.Farmer);
    await halalSupplyChain.connect(admin).registerUser(slaughterhouse.address, "Halal Slaughterhouse", Role.Slaughterhouse);
    await halalSupplyChain.connect(admin).registerUser(processor.address, "Food Processor", Role.Processor);
    await halalSupplyChain.connect(admin).registerUser(distributor.address, "Distributor Co", Role.Distributor);
    await halalSupplyChain.connect(admin).registerUser(retailer.address, "Retail Store", Role.Retailer);
    await halalSupplyChain.connect(admin).registerUser(jakim.address, "JAKIM Officer", Role.JAKIM);
    await halalSupplyChain.connect(admin).registerUser(consumer.address, "Consumer", Role.Consumer);
  });

  describe("User Management", function () {
    it("TEST 1: Should register users with correct roles", async function () {
      const farmerUser = await halalSupplyChain.getUserDetails(farmer.address);
      expect(farmerUser.role).to.equal(Role.Farmer);
      expect(farmerUser.isActive).to.be.true;
      expect(farmerUser.name).to.equal("Farmer One");
    });

    it("TEST 2: Should prevent non-admin from registering users", async function () {
      await expect(
        halalSupplyChain.connect(farmer).registerUser(consumer.address, "New User", Role.Consumer)
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("TEST 3: Should deactivate users", async function () {
      await halalSupplyChain.connect(admin).deactivateUser(farmer.address);
      const farmerUser = await halalSupplyChain.getUserDetails(farmer.address);
      expect(farmerUser.isActive).to.be.false;
    });

    it("TEST 4: Should prevent deactivated users from performing actions", async function () {
      await halalSupplyChain.connect(admin).deactivateUser(farmer.address);
      await expect(
        halalSupplyChain.connect(farmer).createBatch("Chicken", 100)
      ).to.be.revertedWith("Account is not active");
    });
  });

  describe("Batch Creation and Management", function () {
    it("TEST 5: Should allow farmer to create a batch", async function () {
      await expect(
        halalSupplyChain.connect(farmer).createBatch("Chicken", 100)
      ).to.emit(halalSupplyChain, "BatchCreated");

      const batch = await halalSupplyChain.getBatchDetails(1);
      expect(batch.farmer).to.equal(farmer.address);
      expect(batch.animalType).to.equal("Chicken");
      expect(batch.quantity).to.equal(100);
      expect(batch.status).to.equal(BatchStatus.Created);
    });

    it("TEST 6: Should prevent non-farmer from creating batch", async function () {
      await expect(
        halalSupplyChain.connect(consumer).createBatch("Beef", 50)
      ).to.be.revertedWith("Unauthorized role");
    });

    it("TEST 7: Should allow slaughterhouse to update batch to Slaughtered", async function () {
      // Create batch first
      await halalSupplyChain.connect(farmer).createBatch("Cattle", 10);

      // Update status to Slaughtered
      await expect(
        halalSupplyChain.connect(slaughterhouse).updateBatchStatus(1, BatchStatus.Slaughtered, "Main Slaughterhouse")
      ).to.emit(halalSupplyChain, "BatchStatusUpdated");

      const batch = await halalSupplyChain.getBatchDetails(1);
      expect(batch.status).to.equal(BatchStatus.Slaughtered);
    });
  });

  describe("Halal Certification Process", function () {
    beforeEach(async function () {
      // Create and slaughter a batch
      await halalSupplyChain.connect(farmer).createBatch("Cattle", 10);
      await halalSupplyChain.connect(slaughterhouse).updateBatchStatus(1, BatchStatus.Slaughtered, "Slaughterhouse");
    });

    it("TEST 8: Should allow slaughterhouse to request halal certification", async function () {
      await expect(
        halalSupplyChain.connect(slaughterhouse).requestHalalCertification(1)
      ).to.emit(halalSupplyChain, "CertificateRequested");

      const cert = await halalSupplyChain.getCertificateDetails(1);
      expect(cert.batchId).to.equal(1);
      expect(cert.slaughterhouse).to.equal(slaughterhouse.address);
      expect(cert.status).to.equal(CertStatus.Pending);
    });

    it("TEST 9: Should allow JAKIM to approve certification", async function () {
      await halalSupplyChain.connect(slaughterhouse).requestHalalCertification(1);

      await expect(
        halalSupplyChain.connect(jakim).approveCertificate(1, "All requirements met")
      ).to.emit(halalSupplyChain, "CertificateApproved");

      const cert = await halalSupplyChain.getCertificateDetails(1);
      expect(cert.status).to.equal(CertStatus.Approved);
      expect(cert.jakimOfficer).to.equal(jakim.address);
    });

    it("TEST 10: Should allow JAKIM to reject certification", async function () {
      await halalSupplyChain.connect(slaughterhouse).requestHalalCertification(1);

      await expect(
        halalSupplyChain.connect(jakim).rejectCertificate(1, "Missing documentation")
      ).to.emit(halalSupplyChain, "CertificateRejected");

      const cert = await halalSupplyChain.getCertificateDetails(1);
      expect(cert.status).to.equal(CertStatus.Rejected);
    });

    it("TEST 11: Should prevent processing without approved certificate", async function () {
      await halalSupplyChain.connect(slaughterhouse).requestHalalCertification(1);
      // Certificate is pending, not approved

      await expect(
        halalSupplyChain.connect(processor).updateBatchStatus(1, BatchStatus.Processed, "Processing Plant")
      ).to.be.revertedWith("Halal certificate must be approved");
    });

    it("TEST 12: Should allow processing with approved certificate", async function () {
      await halalSupplyChain.connect(slaughterhouse).requestHalalCertification(1);
      await halalSupplyChain.connect(jakim).approveCertificate(1, "Approved");

      await expect(
        halalSupplyChain.connect(processor).updateBatchStatus(1, BatchStatus.Processed, "Processing Plant")
      ).to.emit(halalSupplyChain, "BatchStatusUpdated");

      const batch = await halalSupplyChain.getBatchDetails(1);
      expect(batch.status).to.equal(BatchStatus.Processed);
    });

    it("TEST 13: Should verify if batch is halal certified", async function () {
      // Before certification
      expect(await halalSupplyChain.isHalalCertified(1)).to.be.false;

      // Request and approve certification
      await halalSupplyChain.connect(slaughterhouse).requestHalalCertification(1);
      await halalSupplyChain.connect(jakim).approveCertificate(1, "Approved");

      // After certification
      expect(await halalSupplyChain.isHalalCertified(1)).to.be.true;
    });
  });

  describe("Complete Supply Chain Flow", function () {
    it("TEST 14: Should complete full supply chain from farm to retail", async function () {
      // 1. Farmer creates batch
      await halalSupplyChain.connect(farmer).createBatch("Chicken", 100);

      // 2. Slaughterhouse processes
      await halalSupplyChain.connect(slaughterhouse).updateBatchStatus(1, BatchStatus.Slaughtered, "Slaughterhouse");

      // 3. Request halal certification
      await halalSupplyChain.connect(slaughterhouse).requestHalalCertification(1);

      // 4. JAKIM approves
      await halalSupplyChain.connect(jakim).approveCertificate(1, "Halal requirements met");

      // 5. Processor processes
      await halalSupplyChain.connect(processor).updateBatchStatus(1, BatchStatus.Processed, "Processing Plant");

      // 6. Distributor ships
      await halalSupplyChain.connect(distributor).updateBatchStatus(1, BatchStatus.InTransit, "Distribution Center");

      // 7. Retailer receives
      await halalSupplyChain.connect(retailer).updateBatchStatus(1, BatchStatus.AtRetailer, "Retail Store");

      // 8. Retailer sells
      await halalSupplyChain.connect(retailer).updateBatchStatus(1, BatchStatus.Sold, "Retail Store");

      // Verify final status
      const batch = await halalSupplyChain.getBatchDetails(1);
      expect(batch.status).to.equal(BatchStatus.Sold);

      // Verify supply chain history has all records
      const history = await halalSupplyChain.getSupplyChainHistory(1);
      expect(history.length).to.be.greaterThan(5);
    });

    it("TEST 15: Should maintain complete supply chain history", async function () {
      await halalSupplyChain.connect(farmer).createBatch("Beef", 50);
      await halalSupplyChain.connect(slaughterhouse).updateBatchStatus(1, BatchStatus.Slaughtered, "Slaughterhouse");

      const history = await halalSupplyChain.getSupplyChainHistory(1);
      
      expect(history.length).to.equal(2);
      expect(history[0].actor).to.equal(farmer.address);
      expect(history[1].actor).to.equal(slaughterhouse.address);
      expect(history[0].action).to.include("created");
      expect(history[1].action).to.include("slaughtered");
    });
  });

  describe("Edge Cases and Security", function () {
    it("TEST 16: Should prevent duplicate certificate requests", async function () {
      await halalSupplyChain.connect(farmer).createBatch("Cattle", 10);
      await halalSupplyChain.connect(slaughterhouse).updateBatchStatus(1, BatchStatus.Slaughtered, "Slaughterhouse");
      
      // First request should succeed
      await halalSupplyChain.connect(slaughterhouse).requestHalalCertification(1);

      // Second request should fail
      await expect(
        halalSupplyChain.connect(slaughterhouse).requestHalalCertification(1)
      ).to.be.revertedWith("Certificate already requested for this batch");
    });
  });
});
