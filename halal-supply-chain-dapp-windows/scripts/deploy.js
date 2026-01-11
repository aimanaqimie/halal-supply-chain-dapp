const hre = require("hardhat");

async function main() {
  console.log("Starting deployment to", hre.network.name);
  console.log("==================================================");

  // Get the deployer's account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Get account balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("==================================================\n");

  // Deploy HalalSupplyChain contract
  console.log("Deploying HalalSupplyChain contract...");
  const HalalSupplyChain = await hre.ethers.getContractFactory("HalalSupplyChain");
  const halalSupplyChain = await HalalSupplyChain.deploy();
  
  await halalSupplyChain.waitForDeployment();
  const contractAddress = await halalSupplyChain.getAddress();
  
  console.log("✅ HalalSupplyChain deployed to:", contractAddress);
  console.log("Admin address:", deployer.address);
  console.log("\n==================================================");
  console.log("DEPLOYMENT SUMMARY");
  console.log("==================================================");
  console.log("Network:", hre.network.name);
  console.log("Contract Address:", contractAddress);
  console.log("Deployer:", deployer.address);
  console.log("==================================================\n");

  // Save deployment info
  console.log("IMPORTANT: Update your frontend/js/config.js with:");
  console.log(`const CONTRACT_ADDRESS = "${contractAddress}";`);
  console.log("\n==================================================");

  // Verify contract on Etherscan (only for testnets/mainnet)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\nWaiting for block confirmations...");
    await halalSupplyChain.deploymentTransaction().wait(6);
    
    console.log("\nVerifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("❌ Error verifying contract:", error.message);
    }
  }

  console.log("\n🎉 Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
