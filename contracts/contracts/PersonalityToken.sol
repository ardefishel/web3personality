// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.27;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract PersonalityToken is ERC1155, AccessControl {
    string private _metadataURI;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event TokenMinted(address indexed user, uint256 tokenId, uint256 quizId);

    constructor(string memory _uri) ERC1155(_uri) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _metadataURI = _uri;
    }

    function setURI(string memory newuri) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setURI(newuri);
        _metadataURI = newuri;
    }

    function mint(
        address to,
        uint256 tokenId,
        uint256 quizId
    ) external onlyRole(MINTER_ROLE) {
        _mint(to, tokenId, 1, "");
        emit TokenMinted(to, tokenId, quizId);
    }

    function contractURI() public view returns (string memory) {
        return string(abi.encodePacked(_metadataURI, "collection.json"));
    }

    function uri(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        return
            string(
                abi.encodePacked(
                    _metadataURI,
                    Strings.toString(tokenId),
                    ".json"
                )
            );
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
