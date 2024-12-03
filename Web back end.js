// backend.js

let provider;
let signer;
let crowdfundingContract;

const contractAddress = "0x5dBe8571E483b759Ce823B1C2F3D206a0E27dDb8"; 
const contractABI = [
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
]; 

// Initialize Ethers.js and MetaMask
async function initEthers() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // Request wallet connection
        signer = provider.getSigner();
        crowdfundingContract = new ethers.Contract(contractAddress, contractABI, signer);
        document.getElementById("status").innerText = "MetaMask Connected";
    } else {
        alert("MetaMask is not installed. Please install it to use this app.");
    }
}

// Fetch Open Campaigns
async function fetchOpenCampaigns() {
    try {
        const campaigns = await crowdfundingContract.getOpenCampaigns();
        const [names, ids, descriptions] = campaigns;

        const campaignList = document.getElementById("campaign-list");
        campaignList.innerHTML = ""; // Clear previous list

        for (let i = 0; i < ids.length; i++) {
            const campaign = document.createElement("div");
            campaign.innerHTML = `
                <h3>${names[i]}</h3>
                <p>${descriptions[i]}</p>
                <button onclick="viewCampaignDetails(${ids[i].replace('#', '')})">View Details</button>
            `;
            campaignList.appendChild(campaign);
        }
    } catch (error) {
        console.error("Error fetching campaigns:", error);
    }
}

// View Campaign Details
async function viewCampaignDetails(campaignId) {
    try {
        const details = await crowdfundingContract.getCampaignDetails(campaignId);
        const [creator, name, description, goal, pledged, deadline, fundsClaimed, goalReached] = details;

        const detailsSection = document.getElementById("campaign-details");
        const detailsDiv = document.getElementById("details");
        detailsDiv.innerHTML = `
            <p><strong>Creator:</strong> ${creator}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Goal:</strong> ${goal} ETH</p>
            <p><strong>Pledged:</strong> ${pledged} ETH</p>
            <p><strong>Deadline:</strong> ${new Date(deadline * 1000).toLocaleString()}</p>
            <p><strong>Funds Claimed:</strong> ${fundsClaimed}</p>
            <p><strong>Goal Reached:</strong> ${goalReached}</p>
        `;

        detailsSection.style.display = "block";
        document.getElementById("campaigns").style.display = "none";
    } catch (error) {
        console.error("Error fetching campaign details:", error);
    }
}

// Contribute to a Campaign
async function makeContribution() {
    const amount = document.getElementById("amount").value;
    const campaignId = prompt("Enter Campaign ID:");
    if (!amount || !campaignId) return alert("Please enter a valid amount and campaign ID.");

    try {
        const tx = await crowdfundingContract.contribute(campaignId, {
            value: ethers.utils.parseEther(amount),
        });
        await tx.wait();
        alert("Contribution successful!");
        fetchOpenCampaigns(); // Refresh campaigns
    } catch (error) {
        console.error("Error contributing:", error);
    }
}

// Create a New Campaign
async function createCampaign() {
    const name = document.getElementById("campaign-name").value;
    const description = document.getElementById("campaign-description").value;
    const goal = document.getElementById("campaign-goal").value;
    const duration = document.getElementById("campaign-duration").value;

    if (!name || !description || !goal || !duration) {
        return alert("All fields are required!");
    }

    try {
        const tx = await crowdfundingContract.createCampaign(name, description, goal, duration);
        await tx.wait();
        alert("Campaign created successfully!");
        fetchOpenCampaigns();
    } catch (error) {
        console.error("Error creating campaign:", error);
    }
}

// Claim Refund
async function claimRefund() {
    const campaignId = prompt("Enter Campaign ID:");
    if (!campaignId) return alert("Please enter a valid campaign ID.");

    try {
        const tx = await crowdfundingContract.claimRefund(campaignId);
        await tx.wait();
        alert("Refund claimed successfully!");
    } catch (error) {
        console.error("Error claiming refund:", error);
    }
}

// Withdraw Funds
async function withdrawFunds() {
    const campaignId = prompt("Enter Campaign ID:");
    if (!campaignId) return alert("Please enter a valid campaign ID.");

    try {
        const tx = await crowdfundingContract.withdrawFunds(campaignId);
        await tx.wait();
        alert("Funds withdrawn successfully!");
    } catch (error) {
        console.error("Error withdrawing funds:", error);
    }
}

// Go Back to Campaigns List
function goBack() {
    document.getElementById("campaign-details").style.display = "none";
    document.getElementById("campaigns").style.display = "block";
}


initEthers();
