// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";

import { PlayerPointS1, Player, PlayerQuestS1, PlayerQuestFinishedS1, PlayersActivity, WorldQuestS1, Stamina, Health } from "../codegen/index.sol";
// import { addressToEntity } from "../libraries/LibUtils.sol";
import { QuestTypes } from "../codegen/common.sol";
import { MAX_STAMINA, MAX_HP, POTION_STAMINA, POINT_DAILY_LOG_IN } from "../../constants.sol";

contract WorldSystem is System {
   function startNewDay() public {
      bytes32 playerEntityId = Player._get(_msgSender());
      require(playerEntityId != bytes32(0), "Player does not exist");

      Stamina.set(playerEntityId, block.timestamp, MAX_STAMINA);
      Health.set(playerEntityId, block.timestamp, MAX_HP);
   }

   function buyPotion() public {
      
   }
}
