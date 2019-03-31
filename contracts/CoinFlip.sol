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

    // try to use other random algorithm
    function flip(bool _guess ) public payable returns (bool) {
        // require(msg.value > ); //set require value
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

    // view how many time you win
    function viewConsecutivewins() public view returns(uint256) {
        return consecutiveWins;
    }

    // ViewBalance of this contract
    function viewBalance() public view returns (uint256){
        return address(this).balance;
    }
    
    // CollectCoin function
    function collectCoin() public{
        require(msg.sender == owner);
        owner.transfer(address(this).balance);
    }


}