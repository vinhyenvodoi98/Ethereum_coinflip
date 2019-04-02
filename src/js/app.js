
var choice;
var waiting;
var viewConsecutivewins;
var pending =false;
// function chọn sấp hoặc ngửa
function sap(){ 
    pending = false;
    choice = true;
    $('#chon span').text(' Sấp');
}

function ngua(){
    pending =false;
    choice = false;
    $('#chon span').text(' Ngửa');
}
 
async function flip(){
    pending = false;
    console.log("beggin flip");
    await App.filpnow();
}
// function 
//set up web3
App = {
    web3Provider: null,
    contract: null,

    init: function() {
    if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider;
    } else {
        // If no injected web3 instance is detected, fall back to Ganache
        App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/33067fd895d4482fa44cbe0f5049e96b');
    }
    web3 = new Web3(App.web3Provider);

    App.initContract();
    },

    initContract: function() {
        var CoinflipContract = web3.eth.contract([{  "constant": true,  "inputs": [],  "name": "consecutiveWins",  "outputs": [    {      "name": "",      "type": "uint256"    }  ],  "payable": false,  "stateMutability": "view",  "type": "function"},{  "inputs": [],  "payable": false,  "stateMutability": "nonpayable",  "type": "constructor"},{  "anonymous": false,  "inputs": [    {      "indexed": false,      "name": "winorlose",      "type": "uint8"    }  ],  "name": "closeflip",  "type": "event"},{  "constant": false,  "inputs": [    {      "name": "_guess",      "type": "bool"    }  ],  "name": "flip",  "outputs": [],  "payable": true,  "stateMutability": "payable",  "type": "function"},{  "constant": false,  "inputs": [],  "name": "winPresent",  "outputs": [],  "payable": false,  "stateMutability": "nonpayable",  "type": "function"},{  "constant": true,  "inputs": [],  "name": "viewResult",  "outputs": [    {      "name": "",      "type": "uint8"    }  ],  "payable": false,  "stateMutability": "view",  "type": "function"},{  "constant": true,  "inputs": [],  "name": "viewConsecutivewins",  "outputs": [    {      "name": "",      "type": "uint256"    }  ],  "payable": false,  "stateMutability": "view",  "type": "function"},{  "constant": true,  "inputs": [],  "name": "viewBalance",  "outputs": [    {      "name": "",      "type": "uint256"    }  ],  "payable": false,  "stateMutability": "view",  "type": "function"},{  "constant": false,  "inputs": [],  "name": "collectCoin",  "outputs": [],  "payable": false,  "stateMutability": "nonpayable",  "type": "function"}
          ]);
        App.contract = CoinflipContract.at("0xe7d3da690d456a0d4f581691a208a9eeebb7c558")
        setInterval(App.updateState, 1000);
        App.updateState();
    },

    updateState: async function() {
        let contract = App.contract;
        let coinbase = web3.eth.coinbase;
        
        web3.eth.getBalance(coinbase, function (err, result) { 
            if (!err) {
                $("#account").text(coinbase);
                $("#balance ").text( web3.fromWei(result.toNumber()));
            }
            else console.error(err);
        });

        contract.viewConsecutivewins((err, result) => {
            if (!err) {
                viewConsecutivewins = result.toNumber();
                $("#wincount").text(result.toNumber());
            }
            else console.error(err);
        });
        
        if(viewConsecutivewins == 5){
            contract.winPresent((e,r)=>{
                console.log(r);
            })
            viewConsecutivewins = 0;
        }

        if(pending){
            contract.viewResult((e,r)=>{
                if( r ==  1 ){
                    $("#sapngua").text("sấp");
                }else if( r == 2 ){
                    $("#sapngua").text("ngửa");
                }
            })
        }else{
            $("#sapngua").text("Đợi trong giây lát");
        }

        // console.log()
        
        contract.events.closeflip({}, { fromBlock: 0, toBlock: 'latest' })
        .on(
            'data', function(event) {
            console.log(event);
          })
    },

    filpnow: async function() {
        let contract = App.contract;
        console.log("pening");
        await contract.flip(choice,{ value: web3.toWei(0.00001, 'ether')},(e,r)=>{
            console.log(r);
        })
    }
    
};

// contract.closeflip({}, { fromBlock: 0, toBlock: 'latest' }).get((error, eventResult) => {
        //     if (error)
        //       console.log('Error in myEvent event handler: ' + error);
        //     else
        //       console.log('myEvent: ' + JSON.stringify(eventResult.args));
        //   });
        // console.log("contract", contract.events)

$(function() {
    $(window).load(function() {
    App.init();
    });
});