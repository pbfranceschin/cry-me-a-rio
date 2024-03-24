// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {AccuWeatherData} from "./AccuWeatherData.sol";

struct BetCheckpoint {
    uint256 timestamp;
    uint256 totalNumYes;
    uint256 totalNumNo;
    uint256 totalYesPaid;
    uint256 totalNoPaid;
}

contract BettingContract {
    uint256 public constant BASE_ENTRY_FEE = 0.00001 ether;
    uint256 public strikeTimestamp;
    uint256 public strikeTarget;
    // 1 = no, 2 = yes.
    uint256 public result;
    
    AccuWeatherData public immutable dataSource;

    address[] public yesVoters;
    address[] public noVoters;
    mapping(address => uint256) public yesPaidBy;
    mapping(address => uint256) public noPaidBy;

    BetCheckpoint[] internal _betCheckpoints;

    // Events
    event BetPlaced(address indexed voter, uint256 numYes, uint256 numNo, BetCheckpoint checkpoint);
    event WinnersPaidOut(
        uint256 result, uint256 totalPrize, uint256 totalNumCorrectBid 
    );

    /**
     * Constructor
     * for _strikeTarget, 3 mm == 300.
     */
    constructor(AccuWeatherData _dataSource, uint256 _strikeTimestamp, uint256 _strikeTarget)
    {
        dataSource = _dataSource;
        strikeTimestamp = _strikeTimestamp;
        strikeTarget = _strikeTarget;
    }

    function betCheckpoints() external view returns (BetCheckpoint[] memory) {
        return _betCheckpoints;
    }

    function priceOfBet(uint256 _numYes, uint256 _numNo) public view returns (uint256 costOfYes, uint256 costOfNo) {
        BetCheckpoint memory latestCheckpooint = _betCheckpoints.length == 0 ? BetCheckpoint(0, 0, 0, 0, 0) : _betCheckpoints[_betCheckpoints.length - 1];
        uint256 totalAvgNewNumYes = latestCheckpooint.totalNumYes + (_numYes / 2);
        uint256 totalAvgNewNumNo = latestCheckpooint.totalNumNo + (_numNo / 2);

        // If there's more yes than no, make the yes's more expensive.
        if (totalAvgNewNumYes > totalAvgNewNumNo) {
            costOfYes = BASE_ENTRY_FEE * (latestCheckpooint.totalNumYes - latestCheckpooint.totalNumNo);
            costOfNo = BASE_ENTRY_FEE;
            // If there's more no than yes, make the no's more expensive.
        } else if (totalAvgNewNumNo > totalAvgNewNumYes) {
            costOfNo = BASE_ENTRY_FEE * (latestCheckpooint.totalNumNo - latestCheckpooint.totalNumYes);
            costOfYes = BASE_ENTRY_FEE;
            // Make them the same.
        } else {
            costOfNo = BASE_ENTRY_FEE;
            costOfYes = BASE_ENTRY_FEE;
        }
    }

    /**
     * Function to place a bet.
     */
    function placeBet(uint256 _numYes, uint256 _numNo) external payable {
        require(block.timestamp <= strikeTimestamp, "Betting period has expired.");

        // Basic validation to ensure at least one of _numYes or _numNo is non-zero
        require(_numYes > 0 || _numNo > 0, "Must place a bet on at least one outcome.");

        // Get the cost of the bets.
        (uint256 costOfYes, uint256 costOfNo) = priceOfBet(_numYes, _numNo);

        // Calculate the entry fee based on the multiplier
        uint256 entryFee = (_numYes * costOfYes) + (_numNo * costOfNo);

        require(msg.value == entryFee, "Incorrect value sent.");

        BetCheckpoint memory latestCheckpooint = _betCheckpoints.length == 0 ? BetCheckpoint(0, 0, 0, 0, 0) : _betCheckpoints[_betCheckpoints.length - 1];
        BetCheckpoint memory newCheckpoint = BetCheckpoint({
            timestamp: block.timestamp,
            totalNumYes: latestCheckpooint.totalNumYes,
            totalNumNo: latestCheckpooint.totalNumNo,
            totalYesPaid: latestCheckpooint.totalYesPaid,
            totalNoPaid: latestCheckpooint.totalNoPaid
        });

        if (_numYes != 0) {
            if (yesPaidBy[msg.sender] == 0) {
                yesVoters.push(msg.sender);
            }
            newCheckpoint.totalNumYes += _numYes;
            newCheckpoint.totalYesPaid += (_numYes * costOfYes);
            yesPaidBy[msg.sender] += _numYes * costOfYes;
        } 

        if (_numNo != 0) {
            if (noPaidBy[msg.sender] == 0) {
                noVoters.push(msg.sender);
            }
            newCheckpoint.totalNumNo += _numNo;
            newCheckpoint.totalNoPaid += (_numNo * costOfNo);
            noPaidBy[msg.sender] += _numNo * costOfNo;
        }
        
        _betCheckpoints.push(newCheckpoint);

        emit BetPlaced(msg.sender, _numYes, _numNo, newCheckpoint);
    }

    /**
     * Function to request randomness
     */
    function requestResult() external {
        require(result == 0, "Result already settled.");
        require(block.timestamp > strikeTimestamp, "Betting period has not expired.");
        result = dataSource.precipitation() > strikeTarget ? 2 : 1;
        payOutWinners();
    }

    /**
     * Function to distribute the Ether to winners
     */
    function payOutWinners() private {
        require(result == 1 || result == 2, "Result has not been declared yet.");

        address[] storage winners = result == 2 ? yesVoters : noVoters;
        require(winners.length > 0, "No winners to pay out.");

        BetCheckpoint memory latestCheckpooint = _betCheckpoints[_betCheckpoints.length - 1];

        uint256 totalPrize = address(this).balance;
        uint256 totalNumCorrectPaid = result == 2 ? latestCheckpooint.totalYesPaid : latestCheckpooint.totalNoPaid;

        for (uint256 i = 0; i < winners.length; i++) {
            uint256 correctPaid = result == 2 ? yesPaidBy[winners[i]] : noPaidBy[winners[i]];
            uint256 payout = totalPrize * correctPaid / totalNumCorrectPaid;

            if (address(this).balance >= payout) {
                payable(winners[i]).transfer(payout);
            } else {
                payable(winners[i]).transfer(address(this).balance);
            }
        }

        emit WinnersPaidOut(result, totalPrize, totalNumCorrectPaid);
        // Consider resetting the contract state here if you want to allow for another round of betting
    }

    // Consider adding a function to withdraw LINK or unclaimed Ether, accessible by the contract owner for safety.
}