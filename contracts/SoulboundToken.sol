// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

contract SoulboundToken is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    string private _imageSvgUri;

    error SoulboundToken__CannotBeTransferred();
    error SoulboundToken__NotOwner();

    constructor(string memory svg) ERC721("SoulboundToken", "SBT") {
        _imageSvgUri = _svgImageToURI(svg);
    }

    function burn(uint256 tokenId) external {
        if (ownerOf(tokenId) != msg.sender) {
            revert SoulboundToken__NotOwner();
        }
        _burn(tokenId);
    }

    function safeMint() public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }

    function tokenURI(
        uint256 /* tokenId */
    ) public view override returns (string memory) {
        bytes memory metadataURI = abi.encodePacked(
            "{",
            '"name": "',
            name(),
            '", ',
            '"description" : ',
            '"An NFT that represents the ace of clubs playing card", ',
            '"image": "',
            _imageSvgUri,
            '"',
            "}"
        );

        return string.concat(_baseURI(), Base64.encode(metadataURI));
    }

    function _burn(uint256 tokenId) internal override {
        super._burn(tokenId);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256,
        /* firstTokenId */ uint256 /* batchSize */
    ) internal pure override {
        if (from != address(0) && to != address(0)) {
            revert SoulboundToken__CannotBeTransferred();
        }
    }

    function _svgImageToURI(
        string memory svg
    ) internal pure returns (string memory) {
        string memory baseURI = "data:image/svg+xml;base64,";
        string memory encodedUri = Base64.encode(
            bytes(string(abi.encodePacked(svg)))
        );

        return string.concat(baseURI, encodedUri);
    }
}
