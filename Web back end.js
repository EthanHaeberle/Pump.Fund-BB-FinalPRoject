let web3;
let contract;
let userAccount;

const contractAddress = '0x5dBe8571E483b759Ce823B1C2F3D206a0E27dDb8';
const contractABI = [ [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "campaignId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "goalAmountEth",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			}
		],
		"name": "CampaignCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "campaignId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "contributor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountEth",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "refundedEth",
				"type": "uint256"
			}
		],
		"name": "ContributionMade",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "campaignId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountEth",
				"type": "uint256"
			}
		],
		"name": "FundsWithdrawn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "campaignId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "contributor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountEth",
				"type": "uint256"
			}
		],
		"name": "RefundIssued",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "campaignCount",
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
		"name": "campaigns",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "creator",
				"type": "address"
			},
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
				"name": "goalAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pledgedAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "fundsClaimed",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "goalReached",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_campaignId",
				"type": "uint256"
			}
		],
		"name": "claimRefund",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_campaignId",
				"type": "uint256"
			}
		],
		"name": "contribute",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_goalAmountEth",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_durationInDays",
				"type": "uint256"
			}
		],
		"name": "createCampaign",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_campaignId",
				"type": "uint256"
			}
		],
		"name": "getCampaignDetails",
		"outputs": [
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
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
				"name": "goalAmountEth",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pledgedAmountEth",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "fundsClaimed",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "goalReached",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_campaignId",
				"type": "uint256"
			}
		],
		"name": "getMyContribution",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amountEth",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOpenCampaigns",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_campaignId",
				"type": "uint256"
			}
		],
		"name": "withdrawFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
] ];

window.addEventListener('load', async () => {
    if (window.ethereum) {
        // Use the Web3 provider injected by MetaMask
        web3 = new Web3(window.ethereum);

        try {
            // Request account access (MetaMask will show a pop-up)
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = await web3.eth.getAccounts(); // Get the user's Ethereum address
            console.log("Connected Account: ", userAccount[0]);
            initializeContract();
        } catch (error) {
            console.log('User denied account access or MetaMask error');
            alert('Please connect MetaMask!');
        }
    } else {
        console.log('MetaMask is not installed');
        alert('MetaMask is not installed. Please install MetaMask to interact with the application.');
    }
});

function initializeContract() {
    contract = new web3.eth.Contract(contractABI, contractAddress);
    console.log("Contract initialized.");
}

async function contributeToCampaign(campaignId, amount) {
    if (!contract) {
        alert('Contract is not initialized!');
        return;
    }

    const accounts = await web3.eth.getAccounts(); // Get the user's account
    const contributor = accounts[0];

    try {
        await contract.methods.contribute(campaignId).send({
            from: contributor,
            value: web3.utils.toWei(amount, 'ether')
        });
        console.log('Contribution successful!');
    } catch (error) {
        console.error('Error contributing to campaign:', error);
    }
}


// MetaMask connection logic
document.getElementById('connectButton').addEventListener('click', async () => {
    if (window.ethereum) {
        // Request account access (MetaMask will show a pop-up)
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = await web3.eth.getAccounts();
            document.getElementById('status').textContent = `Connected: ${userAccount[0]}`;
            initializeWeb3();
        } catch (error) {
            console.log('User denied account access or MetaMask error');
            alert('Please connect MetaMask!');
        }
    } else {
        console.log('MetaMask is not installed');
        alert('Please install MetaMask to interact with the platform.');
    }
});

function initializeWeb3() {
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(contractABI, contractAddress);
    console.log('Web3 initialized with MetaMask');
    loadCampaigns();
}

async function loadCampaigns() {
    const campaigns = await contract.methods.getOpenCampaigns().call();
    const campaignListElement = document.getElementById('campaign-list');
    campaignListElement.innerHTML = ''; // Clear the current list

    campaigns[0].forEach((campaignName, index) => {
        const campaignId = campaigns[1][index];
        const description = campaigns[2][index];
        const campaignElement = document.createElement('div');
        campaignElement.innerHTML = `
            <h3>${campaignName}</h3>
            <p>${description}</p>
            <button onclick="viewCampaignDetails(${campaignId})">View Details</button>
        `;
        campaignListElement.appendChild(campaignElement);
    });
}

function viewCampaignDetails(campaignId) {
    // Function to load campaign details
    contract.methods.getCampaignDetails(campaignId).call().then((details) => {
        const { name, description, goalAmountEth, pledgedAmountEth, deadline } = details;
        document.getElementById('campaign-details').style.display = 'block';
        document.getElementById('details').innerHTML = `
            <h3>${name}</h3>
            <p>${description}</p>
            <p>Goal: ${goalAmountEth} ETH</p>
            <p>Pledged: ${pledgedAmountEth} ETH</p>
            <p>Deadline: ${new Date(deadline * 1000).toLocaleString()}</p>
        `;
    });
}

function goBack() {
    document.getElementById('campaign-details').style.display = 'none';
}

async function makeContribution() {
    const campaignId = document.getElementById('campaignId').value;
    const amount = document.getElementById('amount').value;

    if (!userAccount) {
        alert('Please connect MetaMask first.');
        return;
    }

    try {
        await contract.methods.contribute(campaignId).send({
            from: userAccount[0],
            value: web3.utils.toWei(amount, 'ether')
        });
        alert('Contribution successful!');
    } catch (error) {
        console.error('Error contributing to campaign:', error);
        alert('Error making the contribution.');
    }
}

async function createCampaign() {
    const name = document.getElementById('campaign-name').value;
    const description = document.getElementById('campaign-description').value;
    const goal = document.getElementById('campaign-goal').value;
    const duration = document.getElementById('campaign-duration').value;

    if (!userAccount) {
        alert('Please connect MetaMask first.');
        return;
    }

    try {
        await contract.methods.createCampaign(name, description, goal, duration).send({
            from: userAccount[0]
        });
        alert('Campaign created successfully!');
    } catch (error) {
        console.error('Error creating campaign:', error);
        alert('Error creating the campaign.');
    }
}

// Example: Contribute to campaign with ID 1 and 0.1 ETH
document.getElementById('contributeButton').addEventListener('click', () => {
    contributeToCampaign(1, '0.1');  // Example campaign ID and contribution amount
});
