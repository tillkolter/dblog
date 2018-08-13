pragma solidity ^0.4.23;

contract BlogIndex {

    bytes[] filesHashes;

    function addPost(bytes hash) public {
        filesHashes.push(hash);
    }

    function isEmpty() public constant returns (bool){
        return filesHashes.length == 0;
    }

    function getLength() public constant returns (uint) {
        return filesHashes.length;
    }

    function get(uint pos) public constant returns (bytes memory post){
        require(filesHashes.length >= pos);
        post = filesHashes[pos];
    }
}