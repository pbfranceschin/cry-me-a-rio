// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";


contract AccuWeatherData is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    uint256 public precipitation;
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    constructor(address _oracle, string memory _jobId, uint256 _fee) {
        setPublicChainlinkToken();
        oracle = _oracle;
        jobId = stringToBytes32(_jobId);
        fee = _fee;
    }

    function requestPrecipitationData() public {
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);

        // Assuming the API endpoint and the response format, adjust as necessary
        string memory url = "http://dataservice.accuweather.com/currentconditions/v1/455825?apikey=YOUR_API_KEY&details=true";
        req.add("get", url);
        // Adjust the JSON path to match the structure of the AccuWeather response
        req.add("path", "0.PrecipitationSummary.Precipitation.mm");

        sendChainlinkRequestTo(oracle, req, fee);
    }

    function fulfill(bytes32 _requestId, uint256 _precipitation) public recordChainlinkFulfillment(_requestId) {
        precipitation = _precipitation;
    }

    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        assembly {
            result := mload(add(source, 32))
        }
    }
}


    // Callback function to receive the response
    function fulfill(bytes32 _requestId, uint256 _temperature) public recordChainlinkFulfillment(_requestId) {
        temperature = _temperature;
    }

    // Helper function to convert string to bytes32
    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }
