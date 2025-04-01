// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Ownable.sol";

contract HashStorage is Ownable {
    mapping(string => DocInfo) private collection;
    mapping(address => Info[]) private addressToHash;

    struct DocInfo {
        string ipfshash;
        uint256 dateAdded;
        bool exist;
        address authorizedRecipient;
    }

    struct Info {
        string ipfshash;
        string filehash;
        uint256 dateAdded;
        bool exist;
        address authorizedRecipient;
    }

    event HashAdded(string ipfshash, string filehash, uint256 dateAdded, address recipient);

    constructor() Ownable() { }  

    function add(
        string memory _ipfshash,
        string memory _filehash,
        uint256 _dateAdded,
        address recipient,
        address authorizedRecipient
    ) public  {
        require(!collection[_filehash].exist, "File already uploaded");

        collection[_filehash] = DocInfo(_ipfshash, _dateAdded, true, recipient);

        Info memory docInfo2 = Info(_ipfshash, _filehash, _dateAdded, true, recipient);
        addressToHash[recipient].push(docInfo2);

        emit HashAdded(_ipfshash, _filehash, _dateAdded, recipient);
    }

    function get(string memory _hash)
        public
        view
        returns (string memory, string memory, uint256, bool)
    {
        DocInfo memory doc = collection[_hash];
        require(doc.exist, "File does not exist");
        return (_hash, doc.ipfshash, doc.dateAdded, doc.exist);
    }

    function getHashFromAddress(address _address)
        public
        view
        returns (string[] memory, string[] memory)
    {
        Info[] storage arr = addressToHash[_address];
        require(arr.length > 0, "No files associated with this address");

        string[] memory filehashes = new string[](arr.length);
        string[] memory ipfshashes = new string[](arr.length);

        for (uint256 i = 0; i < arr.length; i++) {
            filehashes[i] = arr[i].filehash;
            ipfshashes[i] = arr[i].ipfshash;
        }

        return (filehashes, ipfshashes);
    }
}
