const { ethers } = require('hardhat');
const { expect } = require('chai');

// Convert any n into wei (18 decimals)
const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}
 
describe('Token', () => {
    // Tests go inside here...
    let token, accounts, deployer, receiver, exchange

    beforeEach( async () => {
        // Code executed before each test

        // Fetch Token from blockchain
        const Token = await ethers.getContractFactory('Token')
        token = await Token.deploy('Lucky Charms', 'LC', '1000000')

        // Get all wallets connected to hardhat with ethers
        // Create deployer account from ethers
        // Make a "exchange" account
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        receiver = accounts[1]
        exchange = accounts[2]

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

    describe('Sending Tokens', () => {
        let amount, transaction, result

        describe('Success', () => {
            beforeEach(async () =>{
                // Transfer Tokens
                // Take deployer wallet and connect it to the token smart contract 
                // so it can sign transactions and write values to the blockchain
                // Use transfer function
                // Fetch transaction and then wait for transaction to be included in the block
                amount = tokens(100)
                transaction = await token.connect(deployer).transfer(receiver.address, amount)
                result = await transaction.wait()
            })
    
            it('transfer token balances', async () => {
                // console.log('deployer balance before tranfer', await token.balanceOf(deployer.address))
                // console.log('receiver balance before tranfer', await token.balanceOf(receiver.address))
    
                // Test that tokens were transferred (balance changed)
                expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
                expect(await token.balanceOf(receiver.address)).to.equal(amount)
    
                // console.log('deployer balance after tranfer', await token.balanceOf(deployer.address))
                // console.log('receiver balance after tranfer', await token.balanceOf(receiver.address))
            })
    
            it('emits a Transfer event', async () => {
                const event = result.events[0]
                expect(event.event).to.equal('Transfer')
    
                const args = event.args
                expect(args.from).to.equal(deployer.address)
                expect(args.to).to.equal(receiver.address)
                expect(args.value).to.equal(amount)
            })
        })

        describe('Failure', () => {
            it('rejects insufficient balances', async () => {
                // Transfer more tokens then deployer has -10 mil
                const invalidAmount = tokens(100000000)
                await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted
            })
            
            it('rejects invalid recipent', async () => {
                // Avoid burning tokens
                const amount = tokens(100)
                await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
            })
        })
        
    })

    describe('Approving Tokens', () =>{

        let amount, transaction, result

        beforeEach(async () => {
            amount = tokens(100)
            transaction = await token.connect(deployer).approve(exchange.address, amount)
            result = await transaction.wait()
        })

        describe('Success', () => {
            it('allocates an allowance for delegated token spending', async () => {
                expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount)
            })

            it('emits an Approval event', async () => {
                const event = result.events[0]
                expect(event.event).to.equal('Approval')
    
                const args = event.args
                expect(args.owner).to.equal(deployer.address)
                expect(args.spender).to.equal(exchange.address)
                expect(args.value).to.equal(amount)
            })
        })

        describe('Failure', () =>{
            it('rejects invalid spenders', async () =>{
                await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
            })
        })
    })
})
