pragma solidity ^0.4.19;

import "./Owner.sol";

contract CreateLogbook is Owner {

/** this is the struct that will hold all the details of the lobook. This is a user defined type of all byte32 */

    struct Logbook {
        
        bytes32 regNum;
        bytes32 dateMade;
        bytes32 make;
        bytes32 model;
        bytes32 bodyType;
        bytes32 taxationClass;
        bytes32 colour;
        bytes32 fuel;
        bytes32 weight;
        bytes32 cylinderCC;
        
        bytes32 title;
        bytes32 fName;
        bytes32 lName;
        bytes32 birthDate;
        bytes32 ownerAddress;
        bytes32 postCode;
    }

    /**Array of logbooks to store every logbook that gets created. the mappings are used to keep track 
       of which owner owns what logbook, and also how many logbooks a person owns. */
    Logbook[] logbooks;
    mapping(uint => address) logbookToOwner;
    mapping(address => uint) logbookCount;
  

    /**this function creates a new logbook by storing all the parameters inside the Logbook struct, and then adding
       the newly created logbook to the array of all logbooks. It then assigns who the owner of the logbook is and adds
       one to their amount of logbook count */
    function newLogbook(
        bytes32 _regNum, bytes32 _dateMade, bytes32 _make, bytes32 _model, bytes32 _bodyType, bytes32 _taxationClass,
        bytes32 _colour, bytes32 _fuel, bytes32 _weight, bytes32 _cylinderCC) external onlyOwner {

            
        Logbook memory _logbook = Logbook(
            _regNum,
            _dateMade, 
            _make, 
            _model, 
            _bodyType,
            _taxationClass, 
            _colour, 
            _fuel,
            _weight, 
            _cylinderCC, "empty", "empty", "empty", "empty", "empty", "empty"
            );
                
        logbooks.push(_logbook);
        uint id = logbooks.length - 1;
        logbookToOwner[id] = msg.sender;
        logbookCount[msg.sender]++;
    } 
}

