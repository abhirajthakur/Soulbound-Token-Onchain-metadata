const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const svg = fs.readFileSync("./images/ace_of_clubs.svg", {
    encoding: "utf-8",
  });

  const soulboundToken = await ethers.deployContract("SoulboundToken", [svg]);
  await soulboundToken.waitForDeployment();

  console.log(`Soulbound Token address: ${await soulboundToken.getAddress()}`);

  const tx = await soulboundToken.safeMint();
  await tx.wait(4);
  console.log("Token minted");
}

// https://sepolia.etherscan.io/address/0xec1c96c3ecb4b5378fa4062bf589dbd8fb8509bf#code

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
