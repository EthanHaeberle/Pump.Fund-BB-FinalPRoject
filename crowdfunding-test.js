const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Crowdfunding", function () {
    let Crowdfunding;
    let crowdfunding;
    let owner;
    let addr1;

    beforeEach(async function () {
        // Deploy the contract before each test
        Crowdfunding = await ethers.getContractFactory("Crowdfunding");
        [owner, addr1] = await ethers.getSigners();
        crowdfunding = await Crowdfunding.deploy();
        // No need to call .deployed()
    });

    it("Should create a new campaign successfully", async function () {
        // Create a new campaign
        await crowdfunding.createCampaign("Test Campaign", "This is a test campaign", 10, 30);

        // Retrieve the campaign details
        const campaign = await crowdfunding.campaigns(0);

        // Check if the campaign was created correctly
        expect(campaign.creator).to.equal(owner.address);
        expect(campaign.name).to.equal("Test Campaign#0");
        expect(campaign.description).to.equal("This is a test campaign");
        expect(campaign.goalAmount).to.equal(ethers.parseEther("10"));
    });

    it("Should allow a user to contribute to a campaign", async function () {
        // Create a new campaign
        await crowdfunding.createCampaign("Test Campaign", "This is a test campaign", 10, 30);

        // User contributes to the campaign
        await crowdfunding.connect(addr1).contribute(0, { value: ethers.parseEther("5") });

        // Retrieve the campaign details
        const campaign = await crowdfunding.campaigns(0);

        // Check if the pledged amount is updated
        expect(campaign.pledgedAmount).to.equal(ethers.parseEther("5"));
    });

    it("Should not allow contributing to a non-existent campaign", async function () {
        // Attempt to contribute to a campaign that doesn't exist
        await expect(
            crowdfunding.connect(addr1).contribute(999, { value: ethers.parseEther("1") })
        ).to.be.revertedWith("Invalid campaign ID.");
    });

    it("Should allow users to claim refunds after deadline if goal not met", async function () {
        // Create a campaign with a short duration
        await crowdfunding.createCampaign("Test Campaign", "This is a test campaign", 10, 1);

        // User contributes to the campaign
        await crowdfunding.connect(addr1).contribute(0, { value: ethers.parseEther("5") });

        // Increase time to after the campaign deadline
        await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]); // 2 days
        await ethers.provider.send("evm_mine");

        // User claims a refund
        await crowdfunding.connect(addr1).claimRefund(0);

        // Retrieve the user's contribution
        const contribution = await crowdfunding.getMyContribution(0);

        // Check if the contribution is reset to zero
        expect(contribution).to.equal(0);
    });
});
