pragma solidity ^0.4.19;

/**
 * @title OwnerContract
 * @dev This contract implements some security features when dealing with the logbooks on the blockchain. 
 * implements methods to check that only the owner of a logbook can call functions on that logbook
 */
contract Owner {
    address public owner;
    
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);



  /**
   * @dev This is the contructor for the Owner contract. Sets the owner of the contract to the account of the person creating it on the blockchain(me).
   */
    constructor() public {
        owner = msg.sender;
    }


  /**
   * @dev Throws an error if called by any account other than the owner.
   */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }


  /**
   * @dev Allows the current owner to transfer ownership of the contract to newOwner.
   * @param newOwner The address to transfer ownership to.
   */
    function transferContract(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
