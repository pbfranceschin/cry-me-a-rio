// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "../Oracle.sol";

contract MockChainlinkOracle {
    function fulfillPrecipitationRequest(bytes32 _requestId, uint256 _precipitation, address _contract) public {
        // Simulate calling the fulfill function on the AccuWeatherData contract
        Oracle(_contract).fulfill(_requestId, _precipitation);
    }
}
