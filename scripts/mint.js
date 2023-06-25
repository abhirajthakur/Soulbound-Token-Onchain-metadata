const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xec1c96c3ecb4b5378fa4062bf589dbd8fb8509bf";
  const contract = await ethers.getContractAt(
    "SoulboundToken",
    contractAddress
  );

  const tx = await contract.safeMint();
  await tx.wait(6);
  console.log("Token minted");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
