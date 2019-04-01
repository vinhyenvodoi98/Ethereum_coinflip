# Play CoinFlip v1.0

**Introduction**
In this game you will betting 0.0001 ether to play and choice HEADS and TAILS if you correct outcome 10 times you can take 1 ether

**Install**

    npm install

**How to run**

    npm run dev

**config version of solidity compiler**

Thay đổi file muốn deploy bằng cách thay trong file SimpleStorage.sol 
Thay đổi compiler version trong truffle.js 
    
    solc:{
            optimizer: {
                enabled: true,
                runs: 200
            },
            version : "0.4.24"   // this is compiler version 
        }

**Setup network**

    var mnemonic = "apple banana coffie apple banana coffie apple banana coffie"

    provider: function(){
                return new HDWalletProvider(
                    mnemonic,
                    `https://ropsten.infura.io/v3/${prosse}`
                )
            },
    

**setup migrations**

    const SimpleStorage = artifacts.require("SimpleStorage")
        module.exports = function(deployer){
            deployer.deploy(SimpleStorage);
        };

Ví duj thay tên contract vào giá trị const, require, deploy

**Run command**

chay compile trước bằng lệnh
    
    truffle compile 

sau đó deploy bằng lệnh

**Đối với việc deploy lên localhost**    

    truffle deploy

**Đối với việc deploy lên Ropsten**

    truffle deploy --network ropsten

**Doi voi viec deploy len Ringkeby**

    truffle migrate -f 2 --network rinkebys