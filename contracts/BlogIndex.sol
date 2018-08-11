pragma solidity ^0.4.23;

contract BlogIndex {

    bytes[] filesHashes;

    function addPost(bytes hash) public {
        filesHashes.push(hash);
    }

    function get(uint pos) public constant returns (bytes memory post){
        require(filesHashes.length >= pos);
        post = filesHashes[pos];
    }
}