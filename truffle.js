require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {

    networks: {
        ropsten: {
            provider: ()=>
                new HDWalletProvider(
                    process.env.mnemonic,
                    `https://ropsten.infura.io/v3/${process.env.INFURA_API}`
                )
            ,
            gas: 4712388,
            gasPrice: 100000000000,
            network_id: 3
        },
        rinkeby: {
            provider: function() {
                return new HDWalletProvider(
                    process.env.mnemonic,
                    `https://rinkeby.infura.io/v3/${process.env.INFURA_API}`
                    )},
            network_id: "*"
        },
        development:{
            host: "127.0.0.1",
            port: 9545,
            network_id: "*"
        },
    },
        
    compilers:{
        solc:{
            optimizer: {
                enabled: true,
                runs: 200
            },
            version : "0.4.24"
        }
    }
};