
var choice;

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
        var CoinflipContract = web3.eth.contract([{  "constant": true,  "inputs": [],  "name": "consecutiveWins",  "outputs": [    {      "name": "",      "type": "uint256"    }  ],  "payable": false,  "stateMutability": "view",  "type": "function"},{  "inputs": [],  "payable": false,  "stateMutability": "nonpayable",  "type": "constructor"},{  "constant": false,  "inputs": [    {      "name": "_guess",      "type": "bool"    }  ],  "name": "flip",  "outputs": [    {      "name": "",      "type": "bool"    }  ],  "payable": true,  "stateMutability": "payable",  "type": "function"},{  "constant": true,  "inputs": [],  "name": "viewConsecutivewins",  "outputs": [    {      "name": "",      "type": "uint256"    }  ],  "payable": false,  "stateMutability": "view",  "type": "function"},{  "constant": true,  "inputs": [],  "name": "viewBalance",  "outputs": [    {      "name": "",      "type": "uint256"    }  ],  "payable": false,  "stateMutability": "view",  "type": "function"},{  "constant": false,  "inputs": [],  "name": "collectCoin",  "outputs": [],  "payable": false,  "stateMutability": "nonpayable",  "type": "function"}
          ]);
        App.contract = CoinflipContract.at("0xfecda425b0c8a2e86ad7e485093e6a8df4a89958")
        // $(document).on('click', '.flip', App.filpnow);
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
    },

    // TODO fix this contract.flip
    filpnow: async function() {
        let contract = App.contract;
        console.log("pening");
        let result = await contract.flip(choice, { value: web3.toWei(0.00001, 'ether')})
        if (result){
            $("sapngua").text("Sấp");
        }else{
            $("sapngua").text("Ngửa");
        }
        console.log("success");
    }
};

$(function() {
    $(window).load(function() {
    App.init();
    });
});