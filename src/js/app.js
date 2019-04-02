var address = '0x0d1fd2be10d5f6ffe4eb92c67eb30343e2aab0e3';
var abi =  [{  "constant": true,  "inputs": [],  "name": "consecutiveWins",  "outputs": [    {      "name": "",      "type": "uint256"    }  ],  "payable": false,  "stateMutability": "view",  "type": "function"},{  "inputs": [],  "payable": false,  "stateMutability": "nonpayable",  "type": "constructor"},{  "anonymous": false,  "inputs": [    {      "indexed": false,      "name": "matchNumber",      "type": "uint256"    },    {      "indexed": false,      "name": "winorlose",      "type": "uint8"    }  ],  "name": "closeflip",  "type": "event"},{  "constant": false,  "inputs": [    {      "name": "_guess",      "type": "bool"    }  ],  "name": "flip",  "outputs": [],  "payable": true,  "stateMutability": "payable",  "type": "function"},{  "constant": false,  "inputs": [],  "name": "winPresent",  "outputs": [],  "payable": false,  "stateMutability": "nonpayable",  "type": "function"},{  "constant": true,  "inputs": [],  "name": "viewResult",  "outputs": [    {      "name": "",      "type": "uint8"    }  ],  "payable": false,  "stateMutability": "view",  "type": "function"},{  "constant": true,  "inputs": [],  "name": "viewConsecutivewins",  "outputs": [    {      "name": "",      "type": "uint256"    }  ],  "payable": false,  "stateMutability": "view",  "type": "function"},{  "constant": true,  "inputs": [],  "name": "viewBalance",  "outputs": [    {      "name": "",      "type": "uint256"    }  ],  "payable": false,  "stateMutability": "view",  "type": "function"},{  "constant": false,  "inputs": [],  "name": "collectCoin",  "outputs": [],  "payable": false,  "stateMutability": "nonpayable",  "type": "function"}
  ]
var choice;
var waiting;
var viewConsecutivewins;
var takeprize = false;

// function chọn sấp hoặc ngửa
function sap(){ 
    choice = true;
    $('#chon span').text(' Sấp');
}

function ngua(){
    choice = false;
    $('#chon span').text(' Ngửa');
}

function takePrize(){
    App.takeprize();
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
    pending: false,
    transactionHash : null,
    init: function() {
    if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider;
    } else {
        // If no injected web3 instance is detected, fall back to Ganache
        App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/33067fd895d4482fa44cbe0f5049e96b');
    }
    web3 = new Web3(App.web3Provider);
    pending = false;

    App.initContract();
    },

    initContract: function() {
        
        App.contract = new web3.eth.Contract( abi,address,{});
        $("#TakePrize").hide();
        setInterval(App.updateState, 1000);
        App.updateState();
        
    },

    updateState: async function() {
        let contract = App.contract;
        let coinbase = await web3.eth.getCoinbase();

        web3.eth.getBalance(coinbase, function (err, result) { 
            if (!err) {
                $("#account").text(coinbase);
                $("#balance ").text(web3.utils.fromWei(result));
            }
            else console.error(err);
        });

        contract.methods.viewConsecutivewins().call()
        .then((value) =>{
            viewConsecutivewins = value;
            $("#wincount").text(value);
        })
        
        if(viewConsecutivewins == 5){
            viewConsecutivewins = 0;
            $("#TakePrize").show();
        }

        if(!App.pending){
            contract.methods.viewResult().call()
            .then((value) => {
                if( value ==  1 ){
                    $("#sapngua").text("sấp");
                }else if( value == 2 ){
                    $("#sapngua").text("ngửa");
                }
            })
        }else{
            $("#sapngua").text("Đợi trong giây lát");
        }

    },

    filpnow: async function() {
        App.pending = true;
        let contract = App.contract;
        let coinbase = await web3.eth.getCoinbase();
        
        console.log("pening", App.coinbase);
        await contract.methods.flip(choice).send(
            {
                from : coinbase,
                value : 10000000
            })
        .then((receipt)=>{
            console.log(receipt);
        })
        App.pending = false;
    },

    takeprize: async function(){
        let contract = App.contract;
        let coinbase = await web3.eth.getCoinbase();
        await contract.methods.winPresent().send({
            from : coinbase,
        })
        .then((value) => {
            console.log(value);
        })
        $("#TakePrize").hide();
    }
    
};

$(function() {
    $(window).load(function() {
    App.init();
    });
});