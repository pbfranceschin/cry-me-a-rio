// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import { BettingContract } from "../src/Counter.sol";

contract BettingContractTest is Test {
    
    BettingContract bettingContract;
    address vrfCoordinatorMock = address(0x123); // Use a mock address for the VRF Coordinator
    address linkTokenMock = address(0x456); // Use a mock address for the LINK token
    bytes32 keyHash = 0x0; // Use an appropriate key hash
    uint256 fee = 0.1 * 10 ** 18; // Adjust the fee as necessary

    function setUp() public {
        bettingContract = new BettingContract(vrfCoordinatorMock, linkTokenMock, keyHash, fee);
    }

    function testPlaceBet() public {
        // Simulate sending ETH with the transaction
        address bettor = address(0x1);
        vm.deal(bettor, 1 ether); // Provide the bettor with 1 ETH for betting

        vm.startPrank(bettor);
        bettingContract.placeBet{value: 0.01 ether}(true);
        vm.stopPrank();

        // Verify the bet was placed
        assertTrue(bettingContract.hasVoted(bettor), "Bettor should have voted.");
    }

    function testFailPlaceBetAfterDeadline() public {
        // Move time forward to simulate betting period has ended
        vm.warp(block.timestamp + 2 hours);

        address bettor = address(0x1);
        vm.deal(bettor, 1 ether); // Provide the bettor with 1 ETH for betting

        vm.startPrank(bettor);
        bettingContract.placeBet{value: 0.01 ether}(true); // This should fail
        vm.stopPrank();
    }

    // Add more tests here...

}

