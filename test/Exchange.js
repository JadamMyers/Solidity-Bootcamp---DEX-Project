const { ethers } = require('hardhat');
const { expect } = require('chai');

// Convert any n into wei (18 decimals)
const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}
 
describe('Exchange', () => {
    let deployer, feeAccount, exchange

    const feePercent = 10

    beforeEach( async () => {
        // Code executed before each test

        // Get all wallets connected to hardhat with ethers
        // Account for deployer and feeAccount
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        feeAccount = accounts[1]

        const Exchange = await ethers.getContractFactory('Exchange')
        exchange = await Exchange.deploy(feeAccount.address, feePercent)

    })
    
    describe('Deployment', () => {

        it('tracks the fee account', async () => {
            expect(await exchange.feeAccount()).to.equal(feeAccount.address)
        })

        it('tracks the fee percent', async () => {
            expect(await exchange.feePercent()).to.equal(feePercent)
        })
    })
})
