// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";
import { Player } from "../codegen/tables/Player.sol";
import { PlayerMetadata } from "../codegen/tables/PlayerMetadata.sol";
import { Position } from "../codegen/tables/Position.sol";
import { LastKnownPosition } from "../codegen/tables/LastKnownPosition.sol";
import { ReversePosition } from "../codegen/tables/ReversePosition.sol";
import { Health } from "../codegen/tables/Health.sol";
import { Stamina } from "../codegen/tables/Stamina.sol";
import { PlayerActivity } from "../codegen/tables/PlayerActivity.sol";
import { VoxelCoord, addressToEntity, getStartOfDay } from "../libraries/LibUtils.sol";
import { PlayerPointS1, PlayerQuestS1, PlayerQuestFinishedS1, PlayersActivity, WorldQuestS1 } from "../codegen/index.sol";
import { MAX_STAMINA, MAX_HP, POTION_STAMINA, POINT_DAILY_LOG_IN } from "../../constants.sol";

contract LoginSystem is System {
  function loginP(VoxelCoord memory respawnCoord) public {
    bytes32 playerEntityId = Player._get(_msgSender());
    require(playerEntityId != bytes32(0), "Player does not exist");
    require(PlayerMetadata._getIsLoggedOff(playerEntityId), "LoginSystem: player already logged in");

    Position._set(playerEntityId, respawnCoord.x, respawnCoord.y, respawnCoord.z);
    ReversePosition._set(respawnCoord.x, respawnCoord.y, respawnCoord.z, playerEntityId);

    PlayerMetadata._setIsLoggedOff(playerEntityId, false);
    PlayerActivity._set(playerEntityId, block.timestamp);

    // Reset update time to current time
    Health._setLastUpdatedTime(playerEntityId, block.timestamp);
    Stamina._setLastUpdatedTime(playerEntityId, block.timestamp);
  }

  function loginPlayer(VoxelCoord memory respawnCoord) public {
    bytes32 playerEntityId = Player._get(_msgSender());
    require(playerEntityId != bytes32(0), "Player does not exist");
    // require(PlayerMetadata._getIsLoggedOff(playerEntityId), "LoginSystem: player already logged in");

    // VoxelCoord memory lastKnownCoord = lastKnownPositionDataToVoxelCoord(LastKnownPosition._get(playerEntityId));
    // require(inWorldBorder(respawnCoord), "LoginSystem: cannot respawn outside world border");
    // require(
    //   inSurroundingCubeIgnoreY(lastKnownCoord, MAX_PLAYER_RESPAWN_HALF_WIDTH, respawnCoord),
    //   "LoginSystem: respawn coord too far from last known position"
    // );

    // bytes32 respawnEntityId = ReversePosition._get(respawnCoord.x, respawnCoord.y, respawnCoord.z);
    // if (respawnEntityId == bytes32(0)) {
    //   // Check terrain block type
    //   uint8 terrainObjectTypeId = getTerrainObjectTypeId(respawnCoord);
    //   require(
    //     terrainObjectTypeId == AirObjectID || terrainObjectTypeId == WaterObjectID,
    //     "LoginSystem: cannot respawn on terrain non-air block"
    //   );
    // } else {
    //   require(ObjectType._get(respawnEntityId) == AirObjectID, "LoginSystem: cannot respawn on non-air block");

    //   // Transfer any dropped items
    //   transferAllInventoryEntities(respawnEntityId, playerEntityId, PlayerObjectID);

    //   Position._deleteRecord(respawnEntityId);
    // }

    // Position._set(playerEntityId, respawnCoord.x, respawnCoord.y, respawnCoord.z);
    // ReversePosition._set(respawnCoord.x, respawnCoord.y, respawnCoord.z, playerEntityId);
    // LastKnownPosition._deleteRecord(playerEntityId);
    // PlayerMetadata._setIsLoggedOff(playerEntityId, false);
    // PlayerActivity._set(playerEntityId, block.timestamp);

    // Reset update time to current time
    // Health._setLastUpdatedTime(playerEntityId, block.timestamp);
    // Stamina._setLastUpdatedTime(playerEntityId, block.timestamp);

    uint256 currentPlayerPoint = PlayerPointS1.get(_msgSender());
    uint32 currentPlayerLogin = PlayerQuestS1.getLogin(_msgSender());

    uint256 lastLogin = PlayersActivity.getLastLogin(_msgSender());
     // Get the current timestamp
    uint256 currentTime = block.timestamp;

    // Get the start of the current day in GMT+0
    uint256 startOfDay = getStartOfDay(currentTime);

    uint32 loginLimit = WorldQuestS1.getLogin();

    // Ensure the user is checking in after midnight GMT+0
    if(lastLogin < startOfDay) {
      if(PlayerQuestS1.getLogin(_msgSender()) < loginLimit) {
        PlayerPointS1.set(_msgSender(), currentPlayerPoint + POINT_DAILY_LOG_IN);
        PlayerQuestS1.setLogin(_msgSender(), currentPlayerLogin + 1);
      }

      Stamina.setStamina(playerEntityId, MAX_STAMINA);
    }

    PlayersActivity.setLastLogin(_msgSender(), block.timestamp);
  }
}
