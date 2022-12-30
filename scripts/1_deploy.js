async function main() {
    // Fetch contract to deploy
    // Gets all necessary info from artifacts folders about the correct contract
    const Token = await ethers.getContractFactory("Token")
  
    // Deploy contract
        // Token.deploy puts smart contract on the blockchain
        // assign to variable, deploy() writes to the blockchain
        // .deployed() get info deployed to the blockchain and load it up into smart contract
    const token = await Token.deploy()
    await token.deployed()
    console.log(`Token Deployed to: ${token.address}`)
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  