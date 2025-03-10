// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IMigrations {
    function setCompleted(uint completed) external;
}

contract Migrations {
    address public owner;
    uint public lastCompletedMigration;

    constructor() {
        owner = msg.sender;
    }

    modifier restricted() {
        require(msg.sender == owner, "Access Denied");
        _;
    }

    function setCompleted(uint completed) external restricted {
        lastCompletedMigration = completed;
    }

    function upgrade(address newAddress) external restricted {
        require(newAddress != address(0), "Invalid new address");
        IMigrations(newAddress).setCompleted(lastCompletedMigration);
    }
}
