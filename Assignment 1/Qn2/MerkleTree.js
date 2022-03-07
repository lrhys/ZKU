const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { soliditySha3 } = require("web3-utils");

const merkleLeaves = [
  {
    msgSender: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    receipient: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    tokenId: 1,
    tokenURI: "eyJuYW1lIjogIk15VG9rZW4gIzEiImRlc2NyaXB0aW9uIjogIlRoaXMgaXMgbXkgdG9rZW4gZGVzY3JpcHRpb24hIn0=",
  },
  {
    msgSender: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    receipient: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    tokenId: 2,
    tokenURI: "eyJuYW1lIjogIk15VG9rZW4gIzIiImRlc2NyaXB0aW9uIjogIlRoaXMgaXMgbXkgdG9rZW4gZGVzY3JpcHRpb24hIn0=",
  },
  {
    msgSender: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    receipient: "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB",
    tokenId: 3,
    tokenURI: "eyJuYW1lIjogIk15VG9rZW4gIzMiImRlc2NyaXB0aW9uIjogIlRoaXMgaXMgbXkgdG9rZW4gZGVzY3JpcHRpb24hIn0=",
  },
  {
    msgSender: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    receipient: "0x617F2E2fD72FD9D5503197092aC168c91465E7f2",
    tokenId: 4,
    tokenURI: "eyJuYW1lIjogIk15VG9rZW4gIzQiImRlc2NyaXB0aW9uIjogIlRoaXMgaXMgbXkgdG9rZW4gZGVzY3JpcHRpb24hIn0=",
  },
];

//Use the soliditySha3 function to hash the leaf information set and get its hash value.
const leaves = merkleLeaves.map(leaf => {
  const hash = soliditySha3(
    leaf.msgSender,
    leaf.receipient,
    leaf.tokenId,
    leaf.tokenURI
  );
  return hash;
});
console.log("merkleLeaves: ", leaves);

// Create Merkle Tree with the hashed leaf values and keccak256 hashing algorithm:
const tree = new MerkleTree(leaves, keccak256, {
  sortLeaves: true,
});

// Obtaining the MerkleRoot in Bytes32 format to be passed into Solidity:
const Bytes32root = tree.getHexRoot();
console.log("Bytes32Root: ", Bytes32root);

for (let i = 0; i < leaves.length; i++) {
  let currentLeaf = soliditySha3(
    merkleLeaves[i].msgSender,
    merkleLeaves[i].receipient,
    merkleLeaves[i].tokenId,
    merkleLeaves[i].tokenURI
  );

  const current_BYTES32_Proof = tree.getHexProof(currentLeaf);
  console.log(`Proof ${i + 1}: `, current_BYTES32_Proof);
}

//Code to verify the tree visually
// console.log(tree.verify(proof, leaf, root)); 

// console.log(tree.toString());
