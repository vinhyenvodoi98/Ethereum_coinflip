
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

function flipnow(){
    let contract = App.contract;
    contract.flip(choice, { value: web3.toWei(1, 'ether')},(err,result) =>{
        console.log(result)
    })
}

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
        var CoinflipContract = web3.eth.contract([{  "constant": true,  "inputs": [],  "name": "consecutiveWins",  "outputs": [    {      "name": "",      "type": "uint256"    }  ],  "payable": false,  "stateMutability": "view",  "type": "function"},{  "inputs": [],  "payable": false,  "stateMutability": "nonpayable",  "type": "constructor"},{  "constant": false,  "inputs": [    {      "name": "_guess",      "type": "bool"    }  ],  "name": "flip",  "outputs": [    {      "name": "",      "type": "bool"    }  ],  "payable": false,  "stateMutability": "nonpayable",  "type": "function"},{  "constant": true,  "inputs": [],  "name": "viewConsecutivewins",  "outputs": [    {      "name": "",      "type": "uint256"    }  ],  "payable": false,  "stateMutability": "view",  "type": "function"}
          ]);
        App.contract = CoinflipContract.at("0x281763afe37612da885bf65b36bfa1246f0ea174")
        // $(document).on('click', '.bet-number', App.handleBet);
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

    // filpnow: function(event) {
    // event.preventDefault();

    // var betNumber = parseInt($(event.target).text());
    // let contract = App.contract;
    // contract.bet(betNumber, { value: web3.toWei(1, 'ether') }, function (err, result) {
    //     if (!err) console.log(result);
    //     else console.error(err);
    // })
    // console.log("bet Number = " + betNumber);
    // }
};

$(function() {
    $(window).load(function() {
    App.init();
    });
});