// In this project, we create:

1. a basic NFT
    // mints a preprogrammed nft
2. a random IPFS NFT
    // users pay to mint an nft
    // when minted, triggers a chainlink vrf call for a random number
    // uses random number to generate random nft
    // random nft can be of 3 different dogs, each with different rarity
    // in order from most rare: pug, shiba inu, st. bernard
3. a dynamic SVG NFT
    // stored on chain and is more expensive
    // can change dynamically given certain conditions
    // if price of ETH > x then it will be a happy face, otherwise, it will be sad face