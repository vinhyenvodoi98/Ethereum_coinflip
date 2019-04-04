// use this file to deploy smartcontract to ropsten 

pragma solidity ^0.4.24;


contract CoinFlip {
    //add matchNumber to finter match

    event closeflip(uint256 matchNumber, uint winorlose);

    mapping(address => uint) public winNumber;
    mapping(address => uint) public winloseNumber;

    uint256 lastHash;
    uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
    address owner = 0x4C637fC36ecA2d02d5214b53c0aEc272f31F7E53;
    uint256 matchNumber = 0;
 
    constructor () public {
        winNumber[msg.sender] = 0;
        winloseNumber[msg.sender] = 0;
    }

    // try to use other random algorithm
    function flip(bool _guess ) public payable {
        matchNumber ++ ;
        // require(msg.value > ); //set require value
        uint256 blockValue = uint256(blockhash(block.number-1));

        if (lastHash == blockValue) {
            revert();
        }

        lastHash = blockValue;
        uint256 coinFlip = blockValue / FACTOR;
        bool side = coinFlip == 1 ? true : false;

        if (side == _guess) {
            winNumber[msg.sender] +=1 ;
        } else {
            winNumber[msg.sender] = 0;
        }

        if(side){ 
            winloseNumber[msg.sender] = 1;
            emit closeflip (matchNumber,winloseNumber[msg.sender]);
        }else{
            winloseNumber[msg.sender] = 2;
            emit closeflip (matchNumber,winloseNumber[msg.sender]);
        }
    }

    // if win have present
    function winPresent() public{
        require( winNumber[msg.sender] == 5);
        winNumber[msg.sender] = 0;
        msg.sender.transfer(address(this).balance);
    }

    // view result 
    function viewResult() public view returns(uint) {
        return winloseNumber[msg.sender];
    }

    // view how many time you win
    function viewConsecutivewins() public view returns(uint256) {
        return winNumber[msg.sender];
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