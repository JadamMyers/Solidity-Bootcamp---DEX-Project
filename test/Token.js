const { ethers } = require('hardhat');
const { expect } = require('chai');

// Convert any n into wei (18 decimals)
const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}
 
describe('Token', () => {
    // Tests go inside here...
    let token, accounts, deployer

    beforeEach( async () => {
        // Code executed before each test

        // Fetch Token from blockchain
        const Token = await ethers.getContractFactory('Token')
        token = await Token.deploy('Lucky Charms', 'LC', '1000000')

        accounts = await ethers.getSigners()
        deployer = accounts[0]
    })


    // Create block for all constructor deployment tests
    describe('Deployment', () => {
        const name = 'Lucky Charms'
        const symbol = 'LC'
        const decimals = 18
        const totalSupply = tokens('1000000')

        it('has correct name', async () => {
            // Read token name
            // Check that name is correct
            expect(await token.name()).to.equal(name)
        })
    
        it('has correct symbol', async () => {
            // Read token symbol
            // Check that symbol is correct
            expect(await token.symbol()).to.equal(symbol)
        })
    
        it('has correct decimals', async () => {
            // Read token decimals
            // Check that decimals is correct
            expect(await token.decimals()).to.equal(decimals)
        })
    
        it('has correct Total Supply', async () => {
            // Read token Total Supply
            // Check that Total Supply is correct
            expect(await token.totalSupply()).to.equal(totalSupply)
        })

        it('assigns total supply to deployer', async () => {
            expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
        })
    })

})
