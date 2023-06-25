const { run, ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  const contractAddress = "0xec1c96c3ecb4b5378fa4062bf589dbd8fb8509bf";
  const svg = fs.readFileSync("./images/ace_of_clubs.svg", {
    encoding: "utf-8",
  });

  console.log("Verifying contract with deployer:", deployer.address);
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [svg],
    });
  } catch (err) {
    if (err.message.toLowerCase().includes("already verified")) {
      console.log("Already verified");
    } else {
      console.log(err);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
