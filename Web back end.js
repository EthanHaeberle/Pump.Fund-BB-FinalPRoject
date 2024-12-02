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
    const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address
    const contractABI = [/* Your ABI goes here */];
  
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

