// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";

import { PlayerPointS1, PlayerQuestS1, PlayerQuestFinishedS1, PlayersActivity, WorldQuestS1 } from "../codegen/index.sol";
// import { addressToEntity } from "../libraries/LibUtils.sol";
// Import user types
import { QuestTypes } from "../codegen/common.sol";
import { addressToEntity, getStartOfDay } from "../libraries/LibUtils.sol";

import { POINT_DAILY_CHECK_IN, POINT_GATHER_RESOURCE, POINT_COMMON_RESOURCE, POINT_RARE_RESOURCE, POINT_MYSTICAL_RESOURCE, POINT_ARTIFACT_RESOURCE, POINT_GOD_RESOURCE, POINT_CONFIRM_CHECK_IN, POINT_CONFIRM_LOG_IN, POINT_CONFIRM_GATHER_RESOURCE, POINT_CONFIRM_COMMON_RESOURCE, POINT_CONFIRM_COMMON_RESOURCE, POINT_CONFIRM_RARE_RESOURCE, POINT_CONFIRM_MYSTICAL_RESOURCE, POINT_CONFIRM_ARTIFACT_RESOURCE, POINT_CONFIRM_GOD_RESOURCE } from "../../constants.sol";

contract QuestSystem is System {
  function dailyCheckIn() public {
    // TODO: Finished can uncomment for production
    uint256 lastCheckIn = PlayersActivity.getLastCheckin(_msgSender());
     // Get the current timestamp
    uint256 currentTime = block.timestamp;

    // Get the start of the current day in GMT+0
    uint256 startOfDay = getStartOfDay(currentTime);

    // Ensure the user is checking in after midnight GMT+0
    require(lastCheckIn < startOfDay, "Already checked in today!");
    // require(block.timestamp >= lastCheckin + 1 days, "Too early for next check-in");

    // (uint32 checkin, uint32 login, uint32 gather, uint32 common, uint32 rare, uint32 mystical, uint32 artifact, uint32 god) = WorldQuestS1.get();
    uint32 checkinLimit = WorldQuestS1.getCheckin();
    uint256 currentPlayerPoint = PlayerPointS1.get(_msgSender());
    uint32 currentPlayerCheckin = PlayerQuestS1.getCheckin(_msgSender());

    // require(currentPlayerCheckin < checkin, "Has reached the limit of check-in");
    if(PlayerQuestS1.getCheckin(_msgSender()) < checkinLimit) {
      PlayerPointS1.set(_msgSender(), currentPlayerPoint + POINT_DAILY_CHECK_IN);
      PlayerQuestS1.setCheckin(_msgSender(), currentPlayerCheckin + 1);
    }
    PlayersActivity.setLastCheckin(_msgSender(), block.timestamp);
  }

  function gatherResource() public {
    // TODO: players need to mine resources to get points
    // TODO: this related to mine system of players
  }

  function findTreasure() public {
    // TODO: players need to drop resources to get points
    // TODO: this related to drop system
  }

  function confirmFinishedQuest(QuestTypes _type) public {
    (bool checkin, bool login, bool gather, bool common, bool rare, bool mystical, bool artifact, bool god) = PlayerQuestFinishedS1.get(_msgSender());

    if (_type == QuestTypes.DAILY_CHECK_IN && !checkin) {
      PlayerPointS1.set(_msgSender(), PlayerPointS1.get(_msgSender()) + POINT_CONFIRM_CHECK_IN);
      PlayerQuestFinishedS1.set(_msgSender(), true, login, gather, common, rare, mystical, artifact, god);
    } else if (_type == QuestTypes.DAILY_LOG_IN && !login) {
      PlayerPointS1.set(_msgSender(), PlayerPointS1.get(_msgSender()) + POINT_CONFIRM_LOG_IN);
      PlayerQuestFinishedS1.set(_msgSender(), checkin, true, gather, common, rare, mystical, artifact, god);
    } else if (_type == QuestTypes.GATHER_RESOURCE && !gather) {
      PlayerPointS1.set(_msgSender(), PlayerPointS1.get(_msgSender()) + POINT_CONFIRM_GATHER_RESOURCE);
      PlayerQuestFinishedS1.set(_msgSender(), checkin, login, true, common, rare, mystical, artifact, god);
    } else if (_type == QuestTypes.COMMON_RESOURCE && !common) {
      PlayerPointS1.set(_msgSender(), PlayerPointS1.get(_msgSender()) + POINT_CONFIRM_COMMON_RESOURCE);
      PlayerQuestFinishedS1.set(_msgSender(), checkin, login, gather, true, rare, mystical, artifact, god);
    } else if (_type == QuestTypes.RARE_RESOURCE && !rare) {
      PlayerPointS1.set(_msgSender(), PlayerPointS1.get(_msgSender()) + POINT_CONFIRM_RARE_RESOURCE);
      PlayerQuestFinishedS1.set(_msgSender(), checkin, login, gather, common, true, mystical, artifact, god);
    } else if (_type == QuestTypes.MYSTICAL_RESOURCE && !mystical) {
      PlayerPointS1.set(_msgSender(), PlayerPointS1.get(_msgSender()) + POINT_CONFIRM_MYSTICAL_RESOURCE);
      PlayerQuestFinishedS1.set(_msgSender(), checkin, login, gather, common, rare, true, artifact, god);
    } else if (_type == QuestTypes.ARTIFACT_RESOURCE && !artifact) {
      PlayerPointS1.set(_msgSender(), PlayerPointS1.get(_msgSender()) + POINT_CONFIRM_ARTIFACT_RESOURCE);
      PlayerQuestFinishedS1.set(_msgSender(), checkin, login, gather, common, rare, mystical, true, god);
    } else if (_type == QuestTypes.GOD_RESOURCE && !god) {
      PlayerPointS1.set(_msgSender(), PlayerPointS1.get(_msgSender()) + POINT_CONFIRM_GOD_RESOURCE);
      PlayerQuestFinishedS1.set(_msgSender(), checkin, login, gather, common, rare, mystical, artifact, true);
    }
    else {
      revert("Quest already finished");
    }
  }
}
