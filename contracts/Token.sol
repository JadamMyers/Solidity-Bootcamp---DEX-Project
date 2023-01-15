// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Token{
    string public name;
    string public symbol;
    uint256 public decimals = 18;
    uint256 public totalSupply; 

    // BalanceOf mapping that takes in address as key and returns balanceOf function (state variable)
    mapping(address => uint256) public balanceOf;

    // Allowance nested mapping: address of owner and second mapping defines which specific spender
    // returns how many tokens they are approved for from allowance function
    mapping(address => mapping(address=> uint256)) public allowance;

    event Transfer(
        address indexed from,
        address indexed to, 
        uint256 value
    );

    event Approval(
        address indexed owner, 
        address indexed spender,
        uint256 value
    );

    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    // Transfer Tokens to Another Account
    function transfer(address _to, uint256 _value) 
        public 
        returns (bool success)
    {
        // Require that sender has enough tokens to spend
        require(balanceOf[msg.sender] >= _value);
        _transfer(msg.sender, _to, _value);
        
        return true;
    }

    // A common internal function that tranfer and transferFrom can use
    // Moves tokens from one account to another
    function _transfer(
        address _from,
        address _to,
        uint256 _value
    ) internal {
        // Require that sender is not sending to invalid address
        require(_to != address(0));

        // Dedecut tokens from spender, from the perspective of the person calling the function
        balanceOf[_from] = balanceOf[_from] - _value;
        // Credit tokens to receiver
        balanceOf[_to] = balanceOf[_to] + _value;

        // Emit Event
        emit Transfer(_from, _to, _value);
    }

    // Approve Spender to Withdraw Tokens
    function approve(address _spender, uint256 _value) 
        public 
        returns(bool success)
    {
        // Require that the spender has spender priviledges 
        require(_spender != address(0));

        // Update nested mapping allowance 
        allowance[msg.sender][_spender] =_value;

        // Emit Event
        emit Approval(msg.sender, _spender, _value);
        return true;

    }

    function transferFrom(address _from, address _to, uint256 _value)
        public 
        returns (bool success)
    {
        // Check that owner has enough tokens to transfer 
        // And that the delegate has approval for at least _value tokens
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        // Update allowance, subtract _value from delegate’s allowance
        allowance[_from][msg.sender] = allowance[_from][msg.sender] - _value;

        // Spend tokens
        _transfer(_from, _to, _value);
        return true;
    }
}
