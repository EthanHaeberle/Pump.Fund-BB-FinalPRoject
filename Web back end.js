window.addEventListener('load', async () => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("MetaMask connected");
        // Now you can initialize your contract interaction here
        initializeContract(web3);
      } catch (error) {
        console.error("User denied account access or MetaMask not installed", error);
      }
    } else {
      console.log('MetaMask is not installed');
    }
  });
  
  function initializeContract(web3) {
    // Your contract initialization code here
    // For example, set up your contract ABI and address
    const contractAddress = '0x5dBe8571E483b759Ce823B1C2F3D206a0E27dDb8'; 
    const contractABI = [[
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
    ]];
  
    const contract = new web3.eth.Contract(contractABI, contractAddress);
  
    // You can now interact with the contract
    console.log(contract);
  }
  
async function loadOpenCampaigns() {
    const campaigns = await contract.methods.getOpenCampaigns().call();
    const [names, ids, descriptions] = campaigns;
    
    const campaignList = document.getElementById('campaign-list');
    campaignList.innerHTML = ''; // Clear previous content

    names.forEach((name, index) => {
        const listItem = `
            <div>
                <h3>${name}</h3>
                <p>${descriptions[index]}</p>
                <button onclick="viewCampaign(${ids[index].replace('#', '')})">View Campaign</button>
            </div>
        `;
        campaignList.innerHTML += listItem;
    });
}

async function contributeToCampaign(campaignId, amount) {
    const accounts = await web3.eth.requestAccounts();
    await contract.methods.contribute(campaignId).send({
        from: accounts[0],
        value: web3.utils.toWei(amount, 'ether')
    });
    alert('Contribution Successful!');
}

async function createNewCampaign(name, description, goalAmount, duration) {
    const accounts = await web3.eth.requestAccounts();
    await contract.methods.createCampaign(name, description, goalAmount, duration).send({
        from: accounts[0]
    });
    alert('Campaign Created!');
}

contract.events.CampaignCreated({}, (error, event) => {
    if (!error) {
        console.log('New Campaign:', event.returnValues);
        loadOpenCampaigns();
    }
});

