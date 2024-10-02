// Replace these with your deployed contract address and ABI
const contractAddress = "0x55F7642A19dE63AEa0659B470Ba00ab5c4FBF4eB";
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "listModel",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "modelId",
				"type": "uint256"
			}
		],
		"name": "purchaseModel",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "modelId",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "rating",
				"type": "uint8"
			}
		],
		"name": "rateModel",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "withdrawFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "modelId",
				"type": "uint256"
			}
		],
		"name": "getModelDetails",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasPurchased",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "modelCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "models",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "rating",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ratingCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let web3;
let contract;

// Initialize web3 and the contract
async function init() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(contractABI, contractAddress);
  } else {
    alert("Please install MetaMask to use this dApp!");
  }
}

// List a new model
document.getElementById("listModelForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const modelName = document.getElementById("modelName").value;
  const modelDescription = document.getElementById("modelDescription").value;
  const modelPrice = document.getElementById("modelPrice").value;

  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.listModel(modelName, modelDescription, modelPrice).send({ from: accounts[0] });
    alert("Model listed successfully!");
    document.getElementById("listModelForm").reset();
    loadModels();
  } catch (error) {
    console.error(error);
    alert("Error listing model!");
  }
});

// Purchase a model
document.getElementById("purchaseModelForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const modelId = document.getElementById("purchaseModelId").value;
  const purchasePrice = document.getElementById("purchasePrice").value;

  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.purchaseModel(modelId).send({ from: accounts[0], value: purchasePrice });
    alert("Model purchased successfully!");
    document.getElementById("purchaseModelForm").reset();
  } catch (error) {
    console.error(error);
    alert("Error purchasing model!");
  }
});

// Rate a purchased model
document.getElementById("rateModelForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const modelId = document.getElementById("rateModelId").value;
  const rating = document.getElementById("modelRating").value;

  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.rateModel(modelId, rating).send({ from: accounts[0] });
    alert("Model rated successfully!");
    document.getElementById("rateModelForm").reset();
  } catch (error) {
    console.error(error);
    alert("Error rating model!");
  }
});

// View model details
document.getElementById("viewModelDetailsForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const modelId = document.getElementById("viewModelId").value;

  try {
    const model = await contract.methods.getModelDetails(modelId).call();
    document.getElementById("modelDetails").innerHTML = `
      <p><strong>Name:</strong> ${model[0]}</p>
      <p><strong>Description:</strong> ${model[1]}</p>
      <p><strong>Price:</strong> ${web3.utils.fromWei(model[2], "ether")} ETH</p>
      <p><strong>Creator:</strong> ${model[3]}</p>
      <p><strong>Average Rating:</strong> ${model[4]}</p>
    `;
  } catch (error) {
    console.error(error);
    alert("Error retrieving model details!");
  }
});

// Withdraw funds
document.getElementById("withdrawButton").addEventListener("click", async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.withdrawFunds().send({ from: accounts[0] });
    alert("Funds withdrawn successfully!");
  } catch (error) {
    console.error(error);
    alert("Error withdrawing funds!");
  }
});

// Load all models (display available models in the UI)
async function loadModels() {
  const modelsListDiv = document.getElementById("modelsList");
  modelsListDiv.innerHTML = "";
  try {
    const modelCount = await contract.methods.modelCount().call();
    for (let i = 1; i <= modelCount; i++) {
      const model = await contract.methods.models(i).call();
      const modelPriceInEth = web3.utils.fromWei(model.price, "ether");
      modelsListDiv.innerHTML += `
        <div class="model">
          <p><strong>ID:</strong> ${i}</p>
          <p><strong>Name:</strong> ${model.name}</p>
          <p><strong>Description:</strong> ${model.description}</p>
          <p><strong>Price:</strong> ${modelPriceInEth} ETH</p>
          <p><strong>Creator:</strong> ${model.creator}</p>
          <p><strong>Average Rating:</strong> ${model.ratingCount > 0 ? model.rating / model.ratingCount : "No ratings yet"}</p>
        </div>
        <hr>
      `;
    }
  } catch (error) {
    console.error(error);
    alert("Error loading models!");
  }
}

// Initialize the app
window.onload = async () => {
  await init();
  await loadModels();
};
