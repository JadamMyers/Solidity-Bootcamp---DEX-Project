// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Exchange{
    address public feeAccount;
    uint256 public feePercent;

    constructor(address _feeAccount, uint256 _feePercent) {
        // pass in local var to state var
        // state var is public
        feeAccount = _feeAccount;
        feePercent = _feePercent;

    }

    
}
