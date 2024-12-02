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

