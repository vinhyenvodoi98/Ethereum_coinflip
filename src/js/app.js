// var address = '0x634a5081e1923d7d3989deb285d8bf4ad357f39d';
var address = '0xc13d9af53dd4ed90b44e98b2090cd4033d2a17f0';
var abi =  [{	"constant": false,	"inputs": [],	"name": "collectCoin",	"outputs": [],	"payable": false,	"stateMutability": "nonpayable",	"type": "function"},{	"constant": false,	"inputs": [		{			"name": "_guess",			"type": "bool"		}	],	"name": "flip",	"outputs": [],	"payable": true,	"stateMutability": "payable",	"type": "function"},{	"constant": false,	"inputs": [],	"name": "winPresent",	"outputs": [],	"payable": false,	"stateMutability": "nonpayable",	"type": "function"},{	"inputs": [],	"payable": false,	"stateMutability": "nonpayable",	"type": "constructor"},{	"anonymous": false,	"inputs": [		{			"indexed": false,			"name": "matchNumber",			"type": "uint256"		},		{			"indexed": false,			"name": "winorlose",			"type": "uint256"		}	],	"name": "closeflip",	"type": "event"},{	"constant": true,	"inputs": [],	"name": "viewBalance",	"outputs": [		{			"name": "",			"type": "uint256"		}	],	"payable": false,	"stateMutability": "view",	"type": "function"},{	"constant": true,	"inputs": [],	"name": "viewConsecutivewins",	"outputs": [		{			"name": "",			"type": "uint256"		}	],	"payable": false,	"stateMutability": "view",	"type": "function"},{	"constant": true,	"inputs": [],	"name": "viewResult",	"outputs": [		{			"name": "",			"type": "uint256"		}	],	"payable": false,	"stateMutability": "view",	"type": "function"},{	"constant": true,	"inputs": [		{			"name": "",			"type": "address"		}	],	"name": "winloseNumber",	"outputs": [		{			"name": "",			"type": "uint256"		}	],	"payable": false,	"stateMutability": "view",	"type": "function"},{	"constant": true,	"inputs": [		{			"name": "",			"type": "address"		}	],	"name": "winNumber",	"outputs": [		{			"name": "",			"type": "uint256"		}	],	"payable": false,	"stateMutability": "view",	"type": "function"}
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
    App.takePrize();
}

function flip(){
    console.log("beggin flip");
    App.filpNow();
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
        App.contract = new web3.eth.Contract( abi,address,{
            gasPrice: '200000000'
        });
        console.log(App.contract.options.jsonInterface);
        $("#TakePrize").hide();
        setInterval(App.updateState, 1000);
        App.updateState();
        
    },

    updateState: async function() {
        let contract = App.contract;
        let coinbase = await web3.eth.getCoinbase();
        App.coinbase = coinbase ;

        web3.eth.getBalance(coinbase, function (err, result) { 
            if (!err) {
                $("#account").text(coinbase);
                $("#balance ").text(web3.utils.fromWei(result));
            }
            else console.error(err);
        });

        contract.methods.viewConsecutivewins().call({
            from : App.coinbase
        })
        .then((value) =>{
            viewConsecutivewins = value;
            $("#wincount").text(value);
        })
        
        if(viewConsecutivewins == 5){
            viewConsecutivewins = 0;
            $("#TakePrize").show();
        }

        if(!App.pending){
            contract.methods.viewResult().call({
                from : App.coinbase
            })
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

    watchEvent: function() {
        let contract = App.contract;
        contract.events.closeflip({
            filter: { 
                matchNumber: [12,15]
            },
            fromBlock : 0
        },(error, event) => { 
            // console.log ( event );
        })
        .on('data', (event)=>{
            console.log ( event );
        })
    },

    filpNow: async function() {
        App.pending = true;
        let contract = App.contract;
        let coinbase = App.coinbase;
        
        await contract.methods.flip(choice).send(
            {
                from : coinbase,
                value : '1000000000'
            })
        .then((receipt)=>{
            // console.log(receipt);
            // App.transactionHash = receipt.transactionHash;
            // console.log(transactionHash);
        })
        App.pending = false;
    },

    takePrize: async function(){
        let contract = App.contract;
        let coinbase = App.coinbase;
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