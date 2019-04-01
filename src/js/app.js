
var choice;
var waiting;

// function chọn sấp hoặc ngửa
function sap(){ 
    choice = true;
    $('#chon span').text(' Sấp');
}

function ngua(){
    choice = false;
    $('#chon span').text(' Ngửa');
}
 
function flip(){
    waiting = true;
    console.log("beggin flip");
    App.filpnow();
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
        var CoinflipContract = web3.eth.contract([{  "constant": true,  "inputs": [],  "name": "consecutiveWins",  "outputs": [    {      "name": "",      "type": "uint256"    }  ],  "payable": false,  "stateMutability": "view",  "type": "function"},{  "inputs": [],  "payable": false,  "stateMutability": "nonpayable",  "type": "constructor"},{  "constant": false,  "inputs": [    {      "name": "_guess",      "type": "bool"    }  ],  "name": "flip",  "outputs": [],  "payable": true,  "stateMutability": "payable",  "type": "function"},{  "constant": true,  "inputs": [],  "name": "viewResult",  "outputs": [    {      "name": "",      "type": "uint8"    }  ],  "payable": false,  "stateMutability": "view",  "type": "function"},{  "constant": true,  "inputs": [],  "name": "viewConsecutivewins",  "outputs": [    {      "name": "",      "type": "uint256"    }  ],  "payable": false,  "stateMutability": "view",  "type": "function"},{  "constant": true,  "inputs": [],  "name": "viewBalance",  "outputs": [    {      "name": "",      "type": "uint256"    }  ],  "payable": false,  "stateMutability": "view",  "type": "function"},{  "constant": false,  "inputs": [],  "name": "collectCoin",  "outputs": [],  "payable": false,  "stateMutability": "nonpayable",  "type": "function"}
          ]);
        App.contract = CoinflipContract.at("0xc294e8ba73f1288e1b4687c0739987b6bebf5c15")
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
              $("#wincount").text(result.toNumber());
            }
            else console.error(err);
        });

        contract.viewResult((e,r)=>{
            if( r ==  1 ){
                $("#sapngua").text("sấp");
            }else if( r == 2 ){
                $("#sapngua").text("ngửa");
            }
            // TODO try setup waiting
            // if(waiting){
            //     $("#sapngua").text("Hãy đợi trong giây lát ...");
            // }
        })
    },

    filpnow: function() {
        let contract = App.contract;
        console.log("pening");
        contract.flip(choice, { value: web3.toWei(0.00001, 'ether')},(err,result) =>{
            console.log(result)
            if (result){
                $("sapngua").text("Sấp");
            }else{
                $("sapngua").text("Ngửa");
            }
        })
    }
    
};

$(function() {
    $(window).load(function() {
    App.init();
    });
});