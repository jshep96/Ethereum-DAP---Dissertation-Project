/**All of code is placed inside an object to keep the varaibles local and not global to the whole webpage */

var App = {
    web3Provider: null,
    contracts: {},
    accounts: {},
    account: null,
    currId: null,

    initWeb3: function () {
        'use strict';

        //check if there is injected web3 provider eg metamask
        if (typeof web3 !== "undefined") {
            App.web3Provider = web3.currentProvider;
            //$('.hello').text("undefiened");

            //start a new provider on local host if no provider found
        } else {
            App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
            $('.hello').text("local");

        }
        web3 = new Web3(App.web3Provider);
        return App.initAccounts();
    },

    initAccounts: function () {

        'use strict';
        // get the accounts from the web3 provider... eg metamask
        web3.eth.getAccounts(function (err, result) {
            if (err !== null) {
                // alert("Error fetching accounts");
                return;
            }

            if (result.length === 0) {
                // alert("No accounts found");
                return;
            }

            App.accounts = result;
            App.account = App.accounts[0];
            console.log(App.accounts);
        });
        return App.initContract();
    },


    // get the contracts json file to retrive the information about the contracts deployed address so the functions can be called
    initContract: function () {
        "use strict";
        $.getJSON("Logbook.json", function (data) {
            var LogbookArtifact = data;
            //assign the truffle contact library to be used with the smart contract instead of the web3 library
            App.contracts.Logbook = new TruffleContract(LogbookArtifact);
            //set the web3 provider as the provider that was injected. most likely metamask
            App.contracts.Logbook.setProvider(App.web3Provider);
            App.getLogbooks();
        });

        return App.bindEvents();
    },


    /**Calls the getLogbook function from the smart contract, waits for it to be executed using the promise and then
     * returns the results to be displayed in the webpage.
     */
    getLogbooks: function () {
        "use strict";
        App.contracts.Logbook.deployed().then(function (contract) {
            return contract.getOwnerLogbooks.call({
                from: App.account
            });
        }).then(function (result) {

            for ( let i = 0; i < result.length; i += 1) {
                var column = i % 2;
                App.renderLogbooks(result[i], column);
            }
        }).catch(function (e) {
            Console.log(e);
        });
    },


    renderLogbooks: function (id, column) {
        "use strict";
        var elem;
        if (column === 0) {
            elem = $("#fColumn");
        } else {
            elem = $("#sColumn");
        }

        App.contracts.Logbook.deployed().then(function (contract) {
            return contract.getCarDet.call(id);
        }).then(function (result) {

            elem.append(
                "<div class='boxContainer'>" +
                    "<div class='box' id='id'>" +
                    "<img class='wheel' src='images/wheelsmall.png' alt='Wheel'>" +
                    "<h1 class='make'>" + result[2] +
                    "<h1 class='model'>" + result[3] + "</div>" +
                    "<button class='boxBtn transBtn' id='tId' type='button'>Transfer</button>" +
                    "<button class='boxBtn editBtn'  id='eId' type='button'>Edit</button>"
            );
            elem.append("<h1 class='numPlate'>" + result[0]);

            document.getElementById("id").id = (id);
            document.getElementById("tId").id = (id);
            document.getElementById("eId").id = (id);

        }).catch(function (e) {
            Console.log(e);
        });
    },


    bindEvents: function () {
        "use strict";

        $(document).on("click", ".get", App.getLogbooks);
        $(document).on("click", ".box", function () {
            App.openLogbook(this.id);
        });
        $(document).on("click", "#detClose", App.closeLogbook);
        $(document).on("click", ".boxBtn.transBtn", function() {
            App.openTransfer(this.id);  
        });
        $(document).on("click", ".submitBtn", function() {
            let address = $("#sInput").val();
            App.transfer(App.currId, address);
        });
        $(document).on("click", "#transClose", App.closeTransfer);
        $(document).on("click", ".boxBtn.editBtn", function () {
            App.openEdit(this.id);
        });
        $(document).on("click", ".overlayEditBtn", function () {
            App.confirmEdit(App.currId);
        });
    },



    openLogbook: function (id) {
        "use strict";
        var contract;
        document.getElementById("detOverlay").style.height = "85%";

        App.contracts.Logbook.deployed().then(function (c) {
            contract = c;
            return contract.getOwnerDet.call(id);
        }).then(function (result) {

            for (var i = 0; i < result.length; i += 1) {
                $(".ownerDet").append("<li>" + result[i] + "</li>");
            }
            return contract.getCarDet.call(id);

        }).then(function (result) {
            for (var i = 0; i < result.length; i += 1) {
                $(".carDet").append("<li>" + result[i] + "</li>");
            }

        }).catch(function (e) {
            console.log(e);
        });

    // App.contracts.Logbook.deployed().then(function(i) {
    //     return i.getCar.call(id);
    // }).then(function(result) {
    //     for (var i = 0; i < result.length; i++ ) {
    //         $(".carDet").append("<li>" + result[i] + "</li>");
    //     }
    // }).catch(function (e) {
    //     console.log(e);
    // });

    },


    closeLogbook: function () {
        "use strict";
        document.getElementById("detOverlay").style.height = "0%";
        $(".carDet li").remove();
        $(".ownerDet li").remove();
        $(".overlayEditBtn").remove();
    },

    openTransfer: function(id) {

        document.getElementById("transOverlay").style.height = "250px";
        App.currId = id;

        App.contracts.Logbook.deployed().then(function(contract) {
            return contract.getNumberPlate.call(id);
        }).then(function (result) {
            $("#fInput").val(result);

        }).catch(function(e) {
            console.log(e);
        });
    },

    transfer: function(id, address) {
        
        App.contracts.Logbook.deployed().then(function(contract) {
            console.log(address);
            console.log(id);
            return contract.transferOwnership(id, address, {from: App.account, gas: 90000});
        }).then(function(result) {
            let plate = $("#fInput").val();
            alert("Transaction successful. The logbook with number plate: " + plate + " was transfered to the address: " + address);
            document.location.reload();
        }).catch(function(e){
            console.log(e);
        });
    },

    closeTransfer: function() {
        document.getElementById("transOverlay").style.height = "0%";
    },


    openEdit: function (id) {
        "use strict";
        var contract;
        document.getElementById("detOverlay").style.height = "85%";

        App.contracts.Logbook.deployed().then(function (c) {
            contract = c;
            return contract.getOwnerDet.call(id);

        }).then(function (result) {
            var details=["ownertitle", "fname", "lname","bday", "address", "postcode"];

            for (var i = 0; i < result.length; i += 1) {
                $(".ownerDet").append("<li><textarea id='x' rows='1' cols='20'>" + result[i] + "</textarea></li>");
                document.getElementById("x").id = (details[i]);
            }
            return contract.getCarDet.call(id);

        }).then(function (result) {
            for (var i = 0; i < result.length; i += 1) {
                $(".carDet").append("<li>" + result[i] + "</li>");
            }

            $(".content").append("<button  class='overlayEditBtn' id='editId' type='button'>Confirm</button>")
            App.currId = id;
        //     return contract.getCar.call(id);

        // }).then(function(result) {
        //     for(var i = 0; i < result.length; i+= 1) {
        //         $(".carDet").append("<li>" + result[i] + "</li>");
        //     }

        }).catch(function (e) {
            console.log(e);
        });
    },

    confirmEdit: function(id) {
            var ids = ["ownertitle", "fname", "lname","bday", "address", "postcode"];
            var details = new Array(6);
        
            for(i=0; i<6; i++) {
            details[i] = document.getElementById(ids[i]).value;
            }

            App.contracts.Logbook.deployed().then(function(contract) {
                return contract.changeOwnerDet(id, details[0], details[1], details[2], details[3], details[4], details[5]);
            }).catch(function(e) {
                console.log(e);
            });
        
    },

};


$(document).ready(function () {
    "use strict";
    App.initWeb3();
});