const { inputToConfig } = require("@ethereum-waffle/compiler")
const { assert } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Basic NFT Unit Tests", function () {
          let basicNFT, deployer

          beforeEach(async function () {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["basicnft"])
              basicNFT = await ethers.getContract("BasicNFT")
          })

          describe("Constructor", function () {
              it("initializes the nft correctly", async function () {
                  const name = await basicNFT.name()
                  const symbol = await basicNFT.symbol()
                  const tokenCounter = await basicNFT.getTokenCounter()
                  assert.equal(name, "Doggie")
                  assert.equal(symbol, "DOG")
                  assert.equal(tokenCounter.toString(), "0")
              })
          })

          describe("Mint NFT", function () {
              beforeEach(async function () {
                  const txResponse = await basicNFT.mintNFT()
                  await txResponse.wait(1)
              })
              it("allows users to mint an NFT and updates appropriately", async function () {
                  const tokenURI = await basicNFT.tokenURI(0)
                  const tokenCounter = await basicNFT.getTokenCounter()
                  assert.equal(tokenCounter.toString(), "1")
                  assert.equal(tokenURI, await basicNFT.TOKEN_URI())
              })
              it("shows the correct balance and owner of an NFT", async function () {
                  const deployerAddress = deployer.address
                  const deployerBalance = await basicNFT.balanceOf(deployerAddress)
                  const owner = await basicNFT.ownerOf("0")
                  assert.equal(deployerBalance.toString(), "1")
                  assert.equal(owner, deployerAddress)
              })
          })
      })
