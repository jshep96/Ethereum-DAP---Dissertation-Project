var Logbook = artifacts.require("../contracts/Logbook.sol");

instance = null;
accounts = {};

contract("Logbook", function (acc) {
    accounts = acc;

    it("should create a new logbook and return the details of that logbook", function () {
        return Logbook.deployed().then(function (i) {
            instance = i;
            return instance.newLogbook("NA57ZGT", "05/05/1997", "Vauxhall", "Corsa", "Sport", "A001", "Blue", "Petrol", "5000", "1000");
        }).then(function () {
            return instance.getCarDet.call(0);
        }).then(function (result) {
            assert.equal("NA57ZGT", result[0], "reg number did not return correct value");
            assert.equal("05/05/1997", result[1], "date made did not return correct value");
            assert.equal("Vauxhall", result[2], "car make did not return correct value");
            assert.equal("Corsa", result[3], "car model did not return correct value");
            assert.equal("Sport", result[4], "car bodytype  did not return correct value");
            assert.equal("A001", result[5], "tax class did not return correct value");
        });
    });

    it("should change the ownership details and return the same values", function () {
        return Logbook.deployed().then(function (i) {
            instance = i;
            return instance.changeOwnerDet(0, "Mr", "Joe", "Shep", "00/00/00", "someAddress", "somePostcode");
        }).then(function () {
            return instance.getOwnerDet.call(0);
        }).then(function (result) {
            assert.equal("Mr", result[0], "title did not return correct value");
            assert.equal("Joe", result[1], "first name did not return correct value");
            assert.equal("Shep", result[2], "last name did not return correct value");
            assert.equal("00/00/00", result[3], "birth date did not return correct value");
            assert.equal("someAddress", result[4], "address did not return correct value");
            assert.equal("somePostcode", result[5], "postcode did not return correct value");
        });
    });

    it("should transfer ownership of logbook to another account", function () {
        return Logbook.deployed().then(function (i) {
            instance = i;
            return instance.transferOwnership(0, accounts[1]);
        }).then(function () {
            return instance.getOwnerForTesting(0);
        }).then(function (result) {
            assert.equal(accounts[1], result, "the account of logbooks new owner was incorrect");
        });
    });

    it("should show revert in console when another account tries to access logbook owner details they do not own", function () {
        return Logbook.deployed().then(function (i) {
            instance = i;
            return instance.getOwnerDet.call(0, { From: accounts[3] });
        }).then(function (result) {
            assert(false, "test should have thrown but didnt");
        }).catch(function (error) {
            console.log("this error is for the test below =======> " +  error)
        });
    });

    it("should show revert in console when another account tries to access logbook car details they do not own", function () {
        return Logbook.deployed().then(function (i) {
            instance = i;
            return instance.getCarDet.call(0, { From: accounts[3] });
        }).then(function (result) {
            assert(false, "test should have thrown but didnt");
        }).catch(function (error) {
            console.log("this error is for the test below =======> " +  error)
        });
    });

    
    it("should show revert in console when another account tries to change logbook details they do not own", function () {
        return Logbook.deployed().then(function (i) {
            instance = i;
            return instance.changeOwnerDet(0, "Mr", "Joe", "Shep", "00/00/00", "someAddress", "somePostcode", {from: accounts[5]});
        }).then(function (result) {
            assert(false, "test should have thrown but didnt");
        }).catch(function (error) {
            console.log("this error is for the test below =======> " +  error)
        });
    });

    it("should show revert in console when another account tries to transfer logbook they do not own", function () {
        return Logbook.deployed().then(function (i) {
            instance = i;
            return instance.transferOwnership(0, accounts[4], { From: accounts[3] });
        }).then(function (result) {
            assert(false, "test should have thrown but didnt");
        }).catch(function (error) {
            console.log("this error is for the test below =======> " +  error)
        });
    });

    it("should show revert in console if someone tries to create logbook if not owner of contract", function () {
        return Logbook.deployed().then(function(i) {
            instance = i;
            return instance.newLogbook("NA57ZGT", "05/05/1997", "Vauxhall", "Corsa", "Sport", "A001", "Blue", "Petrol", "5000", "1000", {from: accounts[1]});
        }).then(function (result) {
            assert(false, "test should have thrown but didnt");
        }).catch(function (error) {
            console.log("this error is for the test below =======> " +  error)
        });
    });
});