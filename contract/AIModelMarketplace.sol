// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIModelMarketplace {
    struct Model {
        string name;
        string description;
        uint256 price;
        address payable creator;
        uint256 rating;
        uint256 ratingCount;
    }

    mapping(uint256 => Model) public models;
    uint256 public modelCount;
    mapping(uint256 => mapping(address => bool)) public hasPurchased;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // List a new model
    function listModel(string memory name, string memory description, uint256 price) public {
        modelCount++;
        models[modelCount] = Model(name, description, price, payable(msg.sender), 0, 0);
    }

    // Purchase a model
    function purchaseModel(uint256 modelId) public payable {
        Model storage model = models[modelId];
        require(msg.value == model.price, "Incorrect price");
        require(!hasPurchased[modelId][msg.sender], "Already purchased");
        model.creator.transfer(msg.value);
        hasPurchased[modelId][msg.sender] = true;
    }

    // Rate a purchased model
    function rateModel(uint256 modelId, uint8 rating) public {
        require(hasPurchased[modelId][msg.sender], "You must purchase the model first");
        Model storage model = models[modelId];
        model.rating += rating;
        model.ratingCount++;
    }

    // Withdraw funds from the contract (only contract owner)
    function withdrawFunds() public {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }

    // Get model details
    function getModelDetails(uint256 modelId) public view returns (string memory, string memory, uint256, address, uint256) {
        Model memory model = models[modelId];
        uint256 averageRating = model.ratingCount > 0 ? model.rating / model.ratingCount : 0;
        return (model.name, model.description, model.price, model.creator, averageRating);
    }
}
