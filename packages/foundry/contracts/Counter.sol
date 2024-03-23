// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/v0.8/VRFConsumerBase.sol";


contract BettingContract is VRFConsumerBase {
    uint256 public constant ENTRY_FEE = 0.01 ether;
    uint256 public bettingDeadline;
    bool public bettingActive;
    bool public resultDeclared;
    bool public winningChoice;

    address[] public yesVoters;
    address[] public noVoters;
    mapping(address => bool) public hasVoted;

    bytes32 internal keyHash;
    uint256 internal fee;

    // Events
    event BetPlaced(address indexed voter, bool choice);
    event WinnersPaidOut(bool winningChoice);

    /**
     * Constructor
     */
    constructor(address _vrfCoordinator, address _linkToken, bytes32 _keyHash, uint256 _fee)
        VRFConsumerBase(_vrfCoordinator, _linkToken)
    {
        keyHash = _keyHash;
        fee = _fee;
        bettingDeadline = block.timestamp + 1 hours;
        bettingActive = true;
    }

    /**
     * Function to place a bet.
     */
    function placeBet(bool _choice) external payable {
        require(bettingActive, "Betting is not active.");
        require(block.timestamp <= bettingDeadline, "Betting period has expired.");
        require(msg.value == ENTRY_FEE, "Incorrect value sent.");
        require(!hasVoted[msg.sender], "You have already voted.");

        hasVoted[msg.sender] = true;
        if (_choice) {
            yesVoters.push(msg.sender);
        } else {
            noVoters.push(msg.sender);
        }

        emit BetPlaced(msg.sender, _choice);
    }

    /**
     * Function to request randomness
     */
    function requestResult() external {
        require(block.timestamp > bettingDeadline, "Betting period has not expired.");
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        requestRandomness(keyHash, fee);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 /* requestId */, uint256 randomness) internal override {
        require(!resultDeclared, "Result already declared.");
        winningChoice = randomness % 2 == 0;
        resultDeclared = true;
        payOutWinners();
    }

    /**
     * Function to distribute the Ether to winners
     */
    function payOutWinners() private {
        require(resultDeclared, "Result has not been declared yet.");

        address[] storage winners = winningChoice ? yesVoters : noVoters;
        require(winners.length > 0, "No winners to pay out.");

        uint256 totalPrize = address(this).balance;
        uint256 payoutPerWinner = totalPrize / winners.length;

        for (uint256 i = 0; i < winners.length; i++) {
            payable(winners[i]).transfer(payoutPerWinner);
        }

        emit WinnersPaidOut(winningChoice);
        // Consider resetting the contract state here if you want to allow for another round of betting
    }

    // Consider adding a function to withdraw LINK or unclaimed Ether, accessible by the contract owner for safety.
}
