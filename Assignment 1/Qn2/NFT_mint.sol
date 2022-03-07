// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract NFT_mint is ERC721, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Variable to save merkle root:
    bytes32 public merkleRoot;

    // Mapping to denote which NFT has been minted:
    mapping(uint256 => bool) public tokenIdIsMinted;

    constructor() ERC721("NFT", "ZKU") {}
    
    function setMerkleRoot(bytes32 _newMerkleRoot) public onlyOwner {
        merkleRoot = _newMerkleRoot;
    }

    function mint(
    bytes32[] calldata _merkleProof,
    uint256 _tokenId,
    address _recipient
    ) public {
        // Check if the tokenId has been minted by the assigned owner:
        require(
            !tokenIdIsMinted[_tokenId],
            "This token has been minted by its assigned owner."
        );

        string memory currentTokenURI = tokenURI(_tokenId);

        // Compute the Hash for this particular mint transaction:
        bytes32 merkleLeaf = keccak256(
            abi.encodePacked(msg.sender, _recipient, _tokenId, currentTokenURI)
        );

        // Function to verify merkleHash with Merkle Tree:
        require(MerkleProof.verify(_merkleProof, merkleRoot, merkleLeaf));

        _safeMint(_recipient, _tokenId);

        // Update the respective state counters:
        _tokenIds.increment();
    }

    function tokenURI(uint256 tokenId)
        public
        pure
        override
        returns (string memory)
    {
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "MyToken #', tokenId.toString(), '"',
                '"description": "This is my token description!"'
                // Replace with extra ERC721 Metadata properties
            '}'
        );

        return string(
            abi.encodePacked(Base64.encode(dataURI))
        );
    }

}