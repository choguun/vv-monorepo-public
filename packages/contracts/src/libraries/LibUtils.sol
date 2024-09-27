// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;

import { Admin, SkyPoolConfig } from "../codegen/index.sol";

function isAdmin(bytes32 key) view returns (bool) {
  return Admin.get(key);
}

function min(int32 a, int32 b) pure returns (int32) {
  return a < b ? a : b;
}

function max(int32 a, int32 b) pure returns (int32) {
  return a > b ? a : b;
}

function addressToEntity(address a) pure returns (bytes32) {
  return bytes32(uint256(uint160((a))));
}

function entityToAddress(bytes32 value) pure returns (address) {
  return address(uint160(uint256(value)));
}

// Function to get the start of the current day (midnight GMT+0)
function getStartOfDay(uint256 timestamp) pure returns (uint256) {
      // Seconds in a day (24 hours * 60 minutes * 60 seconds)
      uint256 dayInSeconds = 86400;

      // Calculate the number of days since Unix epoch
      uint256 daysSinceEpoch = timestamp / dayInSeconds;

      // Return the start of the current day (in seconds since epoch)
      return daysSinceEpoch * dayInSeconds;
}

struct VoxelCoord {
  int16 x;
  int16 y;
  int16 z;
}
