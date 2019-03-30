// use this file to deploy smartcontract to ropsten 

pragma solidity ^0.4.24;

contract CoinFlip {
    uint256 public consecutiveWins;
    uint256 lastHash;
    uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
    address owner = 0x4C637fC36ecA2d02d5214b53c0aEc272f31F7E53;

    constructor () public {
        consecutiveWins = 0;
    }

    function flip(bool _guess) public payable returns (bool) {
        uint256 blockValue = uint256(blockhash(block.number-1));

        if (lastHash == blockValue) {
        revert();
        }

        lastHash = blockValue;
        uint256 coinFlip = blockValue / FACTOR;
        bool side = coinFlip == 1 ? true : false;

        if (side == _guess) {
        consecutiveWins++;
        return true;
        } else {
        consecutiveWins = 0;
        return false;
        }
    }

    function viewConsecutivewins() public view returns(uint256) {
        return consecutiveWins;
    }

    //TODO trying to write collectCoin when people lose
    
    function collectCoin() public{
        require(msg.sender = ower);
        ower.transfer(address(this).);
    }


}