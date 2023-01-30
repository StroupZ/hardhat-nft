const { ethers, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async function ({ getNamedAccounts }) {
    const { deployer } = await getNamedAccounts()

    // Bsic NFT
    const basicNFT = await ethers.getContract("BasicNFT", deployer)
    const basicMintTx = await basicNFT.mintNFT()
    await basicMintTx.wait(1)
    console.log(`Basic NFT index 0 has tokenURI: ${await basicNFT.tokenURI(0)}`)

    // Random IPFS NFT
    const randomIpfsNFT = await ethers.getContract("RandomIpfsNFT", deployer)
    const mintFee = await randomIpfsNFT.getMintFee()

    await new Promise(async (resolve, reject) => {
        setTimeout(resolve, 300000) // 5 mins
        randomIpfsNFT.once("NFTMinted", async function () {
            resolve()
        })
        const randomIpfsNFTMintTx = await randomIpfsNFT.requestNFT({ value: mintFee.toString() })
        const randomIpfsNFTMintTxReceipt = await randomIpfsNFTMintTx.wait(1)
        if (developmentChains.includes(network.name)) {
            const requestId = randomIpfsNFTMintTxReceipt.events[1].args.requestId.toString()
            const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
            await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNFT.address)
        }
    })
    console.log(`Random IPFS NFT index 0 has tokenURI: ${await randomIpfsNFT.tokenURI(0)}`)

    // Dynamic SVG NFT
    const highValue = ethers.utils.parseEther("4000")
    const dynamicSvgNFT = await ethers.getContract("DynamicSvgNFT", deployer)
    const dynamicSvgNFTMintTx = await dynamicSvgNFT.mintNFT(highValue.toString())
    await dynamicSvgNFTMintTx.wait(1)
    console.log(`Dynamic SVG NFT index 0 has tokenURI: ${await dynamicSvgNFT.tokenURI(0)}`)
}

module.exports.tags = ["all", "mint"]
