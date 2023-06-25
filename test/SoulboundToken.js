const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");

describe("SoulboundToken", () => {
  async function deploySoulboundToken() {
    const [owner] = await ethers.getSigners();
    const svg = fs.readFileSync("./images/ace_of_clubs.svg", {
      encoding: "utf-8",
    });

    const soulboundToken = await ethers.deployContract("SoulboundToken", []);
    await soulboundToken.waitForDeployment();

    return { soulboundToken, owner };
  }

  describe("Deployment", function () {
    it("Should deploy with the correct name and symbol", async function () {
      const { soulboundToken } = await loadFixture(deploySoulboundToken);
      expect(await soulboundToken.name()).to.equal("SoulboundToken");
      expect(await soulboundToken.symbol()).to.equal("SBT");
    });
  });

  describe("Burn", function () {
    it("Should burn the token if the sender is the owner", async function () {
      const { soulboundToken, owner } = await loadFixture(deploySoulboundToken);
      await soulboundToken.safeMint();
      await soulboundToken.burn(0);
      expect(await soulboundToken.balanceOf(owner.address)).to.equal(0);
    });

    it("Should revert if the sender is not the owner", async function () {
      const { soulboundToken } = await loadFixture(deploySoulboundToken);
      const [, notOwner] = await ethers.getSigners();
      await soulboundToken.safeMint();
      await expect(
        soulboundToken.connect(notOwner).burn(0)
      ).to.be.revertedWithCustomError(
        soulboundToken,
        "SoulboundToken__NotOwner"
      );
    });
  });

  describe("SafeMint", function () {
    it("Should mint a token and assign it to the sender", async function () {
      const { soulboundToken, owner } = await loadFixture(deploySoulboundToken);
      await soulboundToken.safeMint();
      expect(await soulboundToken.ownerOf(0)).to.equal(owner.address);
    });
  });

  describe("BeforeTokenTransfer", function () {
    it("Should revert if trying to transfer the token", async function () {
      const { soulboundToken, owner } = await loadFixture(deploySoulboundToken);
      const [, notOwner] = await ethers.getSigners();
      await soulboundToken.safeMint();
      await expect(
        soulboundToken
          .connect(owner)
          .transferFrom(owner.address, notOwner.address, 0)
      ).to.be.revertedWithCustomError(
        soulboundToken,
        "SoulboundToken__CannotBeTransferred"
      );
    });
  });
});
