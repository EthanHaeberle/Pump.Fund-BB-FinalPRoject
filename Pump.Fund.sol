// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract Crowdfunding {
    using Strings for uint256;

    // Structure to hold campaign details
    struct Campaign {
        address payable creator; // Address of the campaign creator
        string name; // Name of the campaign with '#' appended (e.g., "MyCampaign#1")
        string description; // Description of the campaign
        uint256 goalAmount; // Funding goal in wei
        uint256 pledgedAmount; // Total amount pledged in wei
        uint256 deadline; // Campaign deadline (UNIX timestamp)
        bool fundsClaimed; // Whether the creator has withdrawn the funds
        bool goalReached; // Whether the funding goal has been reached
        mapping(address => uint256) contributions; // Mapping of contributors to their pledged amounts
    }

    uint256 public campaignCount; // Total number of campaigns
    mapping(uint256 => Campaign) public campaigns; // Mapping from campaign ID to Campaign

    // Events to log activities
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        string name,
        string description,
        uint256 goalAmountEth,
        uint256 deadline
    );

    event ContributionMade(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amountEth,
        uint256 refundedEth
    );

    event FundsWithdrawn(
        uint256 indexed campaignId,
        uint256 amountEth
    );

    event RefundIssued(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amountEth
    );

    /**
     * @dev Creates a new crowdfunding campaign.
     * @param _name The name of the campaign.
     * @param _description A brief description of the campaign.
     * @param _goalAmountEth The funding goal in Ether.
     * @param _durationInDays The duration of the campaign in days.
     */
    function createCampaign(
        string memory _name,
        string memory _description,
        uint256 _goalAmountEth,
        uint256 _durationInDays
    ) external {
        require(_goalAmountEth > 0, "Goal amount must be greater than zero.");
        require(_durationInDays > 0, "Duration must be at least one day.");

        Campaign storage newCampaign = campaigns[campaignCount];
        newCampaign.creator = payable(msg.sender);
        newCampaign.name = string(abi.encodePacked(_name, "#", campaignCount.toString()));
        newCampaign.description = _description;
        newCampaign.goalAmount = _goalAmountEth * 1 ether; // Convert ETH to wei
        newCampaign.pledgedAmount = 0;
        newCampaign.deadline = block.timestamp + (_durationInDays * 1 days); // Set deadline
        newCampaign.fundsClaimed = false;
        newCampaign.goalReached = false;

        emit CampaignCreated(
            campaignCount,
            msg.sender,
            newCampaign.name,
            _description,
            _goalAmountEth,
            newCampaign.deadline
        );

        campaignCount++;
    }

    /**
     * @dev Contributes Ether to a specific campaign.
     * If the contribution exceeds the funding goal, the excess is refunded.
     * If the funding goal is reached, funds are automatically sent to the creator.
     * @param _campaignId The ID of the campaign to contribute to.
     */
    function contribute(uint256 _campaignId) external payable {
        require(_campaignId < campaignCount, "Invalid campaign ID.");
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.deadline, "Campaign has ended.");
        require(!campaign.goalReached, "Funding goal has already been reached.");
        require(msg.value > 0, "Contribution must be greater than zero.");

        uint256 excess = 0;
        uint256 acceptedAmount = msg.value;

        // Check if the contribution exceeds the goal
        if (campaign.pledgedAmount + msg.value > campaign.goalAmount) {
            excess = (campaign.pledgedAmount + msg.value) - campaign.goalAmount;
            acceptedAmount = msg.value - excess;
        }

        // Update pledged amount and contributions
        campaign.pledgedAmount += acceptedAmount;
        campaign.contributions[msg.sender] += acceptedAmount;

        // Check if goal is reached after contribution
        if (campaign.pledgedAmount >= campaign.goalAmount) {
            campaign.goalReached = true;
            campaign.fundsClaimed = true;
            // Transfer the pledged amount to the creator
            campaign.creator.transfer(campaign.pledgedAmount);
            emit FundsWithdrawn(_campaignId, campaign.pledgedAmount / 1 ether);
        }

        // Refund excess if any
        if (excess > 0) {
            payable(msg.sender).transfer(excess);
            emit ContributionMade(_campaignId, msg.sender, acceptedAmount / 1 ether, excess / 1 ether);
        } else {
            emit ContributionMade(_campaignId, msg.sender, acceptedAmount / 1 ether, 0);
        }
    }

    /**
     * @dev Retrieves all open campaigns with their names, IDs, and descriptions.
     * @return names An array of campaign names.
     * @return ids An array of campaign IDs formatted with a '#' prefix.
     * @return descriptions An array of campaign descriptions.
     */
    function getOpenCampaigns() external view returns (string[] memory, string[] memory, string[] memory) {
        uint256 openCount = 0;
        // First, count the number of open campaigns
        for(uint256 i = 0; i < campaignCount; i++) {
            if (!campaigns[i].goalReached && block.timestamp < campaigns[i].deadline) {
                openCount++;
            }
        }

        // Initialize arrays to hold open campaigns' data
        string[] memory names = new string[](openCount);
        string[] memory ids = new string[](openCount);
        string[] memory descriptions = new string[](openCount);

        uint256 index = 0;
        // Populate the arrays with open campaigns' data
        for(uint256 i = 0; i < campaignCount; i++) {
            if (!campaigns[i].goalReached && block.timestamp < campaigns[i].deadline) {
                names[index] = campaigns[i].name;
                ids[index] = string(abi.encodePacked("#", i.toString()));
                descriptions[index] = campaigns[i].description;
                index++;
            }
        }

        return (names, ids, descriptions);
    }

    /**
     * @dev Allows contributors to claim a refund if the campaign did not reach its goal by the deadline.
     * @param _campaignId The ID of the campaign.
     */
    function claimRefund(uint256 _campaignId) external {
        require(_campaignId < campaignCount, "Invalid campaign ID.");
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp >= campaign.deadline, "Campaign is still active.");
        require(!campaign.goalReached, "Funding goal was met.");

        uint256 contributedAmount = campaign.contributions[msg.sender];
        require(contributedAmount > 0, "No contributions to refund.");

        campaign.contributions[msg.sender] = 0;
        payable(msg.sender).transfer(contributedAmount);

        emit RefundIssued(_campaignId, msg.sender, contributedAmount / 1 ether);
    }

    /**
     * @dev Withdraw funds manually if the goal has been reached and deadline not yet passed.
     * Note: In the contribute function, funds are already sent automatically once the goal is met.
     * This function is kept in case the automatic transfer fails or needs to be triggered manually.
     * @param _campaignId The ID of the campaign.
     */
    function withdrawFunds(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.creator, "Only the creator can withdraw funds.");
        require(campaign.goalReached, "Funding goal not met.");
        require(!campaign.fundsClaimed, "Funds have already been withdrawn.");

        campaign.fundsClaimed = true;
        uint256 amount = campaign.pledgedAmount;
        campaign.pledgedAmount = 0;

        campaign.creator.transfer(amount);

        emit FundsWithdrawn(_campaignId, amount / 1 ether);
    }

    /**
     * @dev Retrieves detailed information about a specific campaign.
     * @param _campaignId The ID of the campaign.
     * @return creator The address of the campaign creator.
     * @return name The name of the campaign.
     * @return description The description of the campaign.
     * @return goalAmountEth The funding goal in Ether.
     * @return pledgedAmountEth The total pledged amount in Ether.
     * @return deadline The deadline timestamp of the campaign.
     * @return fundsClaimed Indicates if the funds have been claimed.
     * @return goalReached Indicates if the funding goal has been reached.
     */
    function getCampaignDetails(uint256 _campaignId) external view returns (
        address creator,
        string memory name,
        string memory description,
        uint256 goalAmountEth,
        uint256 pledgedAmountEth,
        uint256 deadline,
        bool fundsClaimed,
        bool goalReached
    ) {
        require(_campaignId < campaignCount, "Invalid campaign ID.");
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.creator,
            campaign.name,
            campaign.description,
            campaign.goalAmount / 1 ether,
            campaign.pledgedAmount / 1 ether,
            campaign.deadline,
            campaign.fundsClaimed,
            campaign.goalReached
        );
    }

    /**
     * @dev Retrieves the amount a specific contributor has pledged to a campaign.
     * @param _campaignId The ID of the campaign.
     * @return amountEth The contributed amount in Ether.
     */
    function getMyContribution(uint256 _campaignId) external view returns (uint256 amountEth) {
        require(_campaignId < campaignCount, "Invalid campaign ID.");
        Campaign storage campaign = campaigns[_campaignId];
        return campaign.contributions[msg.sender] / 1 ether;
    }
}
