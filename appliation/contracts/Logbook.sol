pragma solidity ^0.4.19;

import "./CreateLogbook.sol";

contract Logbook is CreateLogbook {
    
    uint[] public logbook;
    

    /**Searchs through the whole array of logbooks and returns any with a mapping associated to logbook id with
       the msg.sender (person calling the function) */
    function getOwnerLogbooks() external view returns(uint[]) {
        
        address owner = msg.sender;
        uint[] memory result = new uint[](logbookCount[owner]);
        uint count = 0;
        
        for (uint i = 0; i < logbooks.length; i++) {
            if (logbookToOwner[i] == owner) {
                result[count] = i;
                count++;
            }
        } 
        return result;
    }


    /**Returns the numberplate of the logbook with index of 'id'. Only shows the details if it is the owner of that logbook
       calling the function */
    function getNumberPlate(uint id) external view returns(string) {
        require(logbookToOwner[id] == msg.sender);

        return(bytesToString(logbooks[id].regNum));
    }

   
   /**Returns owner details of a logbook, but first uses require to check only the owner of the logbook can access this information */
    function getOwnerDet(uint id) external view returns (string _title, string _fName, string _lName, string _birthDate, string _ownerAddress,
        string _postCode) {

        require(logbookToOwner[id] == msg.sender);

        return(
           bytesToString(logbooks[id].title), 
           bytesToString(logbooks[id].fName),
           bytesToString(logbooks[id].lName), 
           bytesToString(logbooks[id].birthDate),
           bytesToString(logbooks[id].ownerAddress), 
           bytesToString(logbooks[id].postCode)
        );
    }
    

 /**Returns the car details held in the logbook. This function had to be split into two seperate functions due to the stack to deep
      error. Again checks with the require statment if the owner of the logbook is trying to access said logbook */
    function getCarDet(uint id) external view returns ( string _regNum, string _dateMade, string _make,
        string _model, string _bodyType, string _taxationClass) {

        require(logbookToOwner[id] == msg.sender);


        return(
           bytesToString(logbooks[id].regNum),
           bytesToString(logbooks[id].dateMade),
           bytesToString(logbooks[id].make),
           bytesToString(logbooks[id].model),
           bytesToString(logbooks[id].bodyType),
           bytesToString(logbooks[id].taxationClass)
        );
    }

    function getCar(uint id) external view returns ( string _colour, string _fuel, string _weight, string _cylinder) {

        require(logbookToOwner[id] == msg.sender);

        return(
            bytesToString(logbooks[id].colour),
            bytesToString(logbooks[id].fuel),
            bytesToString(logbooks[id].weight),
            bytesToString(logbooks[id].cylinderCC)
            );
    }


    function changeOwnerDet(
        uint id, bytes32 _title, bytes32 _fName, bytes32 _lName, bytes32 _birthDate, 
        bytes32 _ownerAddress, bytes32 _postCode)  external  {
        
        require(logbookToOwner[id] == msg.sender);
       
        logbooks[id].title = _title;
        logbooks[id].fName = _fName;
        logbooks[id].lName = _lName;
        logbooks[id].birthDate = _birthDate;
        logbooks[id].ownerAddress = _ownerAddress;
        logbooks[id].postCode = _postCode;
        
        
    }
    
    
    /**transfers the ownership of the logbook to the account specified. two require statments check that only the owner of
       the logbook is able to transfer ownership, and also that the owner is not trying to send the logbook to themselves,
       as this would end up costing the person*/
    function transferOwnership(uint id, address _newOwner) external {
        
        require(logbookToOwner[id] == msg.sender);
        require(_newOwner != msg.sender);

        logbookCount[msg.sender]--;
        logbookCount[_newOwner]++;
        logbookToOwner[id] = _newOwner;
    }
    
    /**function to convert bytes to strings. used when returning the logbook details to be shown in the webpage as 
       javascript does not have any byte variables. */
    function bytesToString(bytes32 x) internal pure returns (string) {

        bytes memory str = new bytes(32);
        uint count = 0;

        for (uint i = 0; i < 32; i++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * i)));
            if (char != 0) {
                str[count] = char;
                count++;
            }  
        }
        bytes memory strTrimmed = new bytes(count);

        for (i = 0; i < count; i++) {
            strTrimmed[i] = str[i];
        }

        return string(strTrimmed);
    }   


    /**function to return the address of the owner of a logbook to use in the assert statment of a unit test to ensure
       the correct address owners a logbook after it has been transferred. */
    function getOwnerForTesting(uint id) public view returns(address) {
        return(logbookToOwner[id]);
    }

}