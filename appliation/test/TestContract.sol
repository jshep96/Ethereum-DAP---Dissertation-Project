pragma solidity ^0.4.19;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Logbook.sol";

contract TestContract {
    Logbook logContract;

    function beforeAll() public {
        logContract = Logbook(DeployedAddresses.Logbook());
        logContract.newLogbook("NA57ZGT", "05/05/1997", "Vauxhall", "Corsa", "Sport", "A001", "Blue", "Petrol", "5000", "1000");
    }

    function testgetLogbookDetails() public {
        string memory expectedReg;
        string memory expectedDate;
        string memory expectedMake;
        string memory expectedModel;
        string memory expectedBodyType;
        string memory expectedTax;
        string memory expectedColour;
        string memory expectedFuel;
        string memory  expectedWeight;
        string memory expectedCylinder;
    
        (expectedReg, expectedDate, expectedMake, expectedModel, expectedBodyType,
        expectedTax) = logContract.getCarDet(0);

        (expectedColour, expectedFuel, expectedWeight, expectedCylinder) = logContract.getCarDetSecond(0);

        Assert.equal("NA57ZGT", expectedReg, "should equal the same reg");
        Assert.equal("05/05/1997", expectedDate, "should equal the same date");
        Assert.equal("Vauxhall", expectedMake, "should equal the same make");
        Assert.equal("Corsa", expectedModel, "should equal the same model");
        Assert.equal("Sport", expectedBodyType, "should equal the same body type");
        Assert.equal("A001", expectedTax, "should equal the same tax");
        Assert.equal("Blue", expectedColour, "should equal the same colour");
        Assert.equal("Petrol", expectedFuel, "should equal the same fuel");
        Assert.equal("5000", expectedWeight, "should equal the same as weight");
        Assert.equal("1000", expectedCylinder, "should equal the same as cylinder");
    }



    function testChangeAndGetOwnerDetails() public {
        logContract.changeOwnerDet(0, "Mr", "Joe", "Shepherd", "00/00/00", "someAddress", "somePostCode");

        string memory title;
        string memory fName;
        string memory lName;
        string memory bday;
        string memory ownerAddress;
        string memory postCode;

        (title, fName, lName, bday, ownerAddress, postCode) = logContract.getOwnerDet(0);


        Assert.equal("Mr", title, "should equal the same as the title after being changed");
        Assert.equal("Joe", fName, "should equal the same as the name after being changed");
        Assert.equal("Shepherd", lName, "should equal the same as the lName after being changed");
        Assert.equal("00/00/00", bday, "should equal the same as the bday after being changed");
        Assert.equal("someAddress", ownerAddress, "should equal the same as the address after being changed");
        Assert.equal("somePostCode", postCode, "should equal the same as the postcode after being changed");
    }

    function testGetNumberPlate() public {
        string memory numberPlate;

        numberPlate = logContract.getNumberPlate(0);

        Assert.equal("NA57ZGT", numberPlate, "should return the correct numberplate");
    }

    function testTransfer() public {
        address newOwner = 0x627306090abaB3A6e1400e9345bC60c78a8BEf57;
        
        logContract.transferOwnership(0, newOwner);

        address getNewOwner = logContract.getOwnerForTesting(0);

        Assert.equal(newOwner, getNewOwner, "should return the address of the new owner");
    }
}