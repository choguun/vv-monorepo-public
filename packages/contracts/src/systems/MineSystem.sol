// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";

import { PlayerPointS1, Player, PlayerQuestS1, PlayerQuestFinishedS1, PlayersActivity, WorldQuestS1, Stamina, Health, GameToken, PlayerTreasureS1, WorldResourceS1 } from "../codegen/index.sol";
// import { addressToEntity } from "../libraries/LibUtils.sol";
import { QuestTypes } from "../codegen/common.sol";
import { NORMAL_REWARD, COMMON_REWARD, RARE_REWARD, MYSTICAL_REWARD, ARTIFACT_REWARD, GOD_REWARD } from "../MinningReward.sol";

contract MineSystem is System {
   event DropResulted(address indexed user, uint256 timestamp, uint256 coins, uint8 tier);

   function mineBlock() public {
        bytes32 playerEntityId = Player._get(_msgSender());
        require(playerEntityId != bytes32(0), "Player does not exist");
        require(Stamina.getStamina(playerEntityId) > 0, "Not enough stamina");

        Stamina.setStamina(playerEntityId, Stamina.getStamina(playerEntityId) - 10);
        Stamina.setLastUpdatedTime(playerEntityId, block.timestamp);
        PlayerQuestS1.setGather(_msgSender(), PlayerQuestS1.getGather(_msgSender()) + 1);
        dropTreasure();
   }

   // God: 5/5| Artifact: 20/20 |Mystical: 50/50 |Rare: 150/150 |Common: 1,000/1,000
   uint16 public constant COMMON_DROP = 100; // 10% Chance
   uint16 public constant RARE_DROP = 50; // 5% Chance
   uint16 public constant MYSTICAL_DROP = 10; // 1% Chance
   uint16 public constant ARTIFACT_DROP = 5; // 0.5% Chance
   uint16 public constant GOD_DROP = 1; // 0.1% Chance

   function dropTreasure() private {
      bytes32 playerEntityId = Player._get(_msgSender());
      require(playerEntityId != bytes32(0), "Player does not exist");
      uint256 randomSeed = (uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, _msgSender(), tx.gasprice, block.number))) % 1000);
      
      if(randomSeed < GOD_DROP) {
         if(WorldResourceS1.getGod() == 0) {
            GameToken.setAmount(playerEntityId, GameToken.getAmount(playerEntityId) + GOD_REWARD);
            emit DropResulted(_msgSender(), block.timestamp, GOD_REWARD, 5);
         } else {
            WorldResourceS1.setGod(WorldResourceS1.getGod() - 1);
            PlayerTreasureS1.setGod(_msgSender(), PlayerTreasureS1.getGod(_msgSender()) + 1);
            PlayerQuestS1.setCommon(_msgSender(), PlayerQuestS1.getCommon(_msgSender()) + 1);
            emit DropResulted(_msgSender(), block.timestamp, 0, 5);
         }
      }
      else if(randomSeed < ARTIFACT_DROP) {
         if(WorldResourceS1.getArtifact() == 0) {
            GameToken.setAmount(playerEntityId, GameToken.getAmount(playerEntityId) + ARTIFACT_REWARD);
            
            emit DropResulted(_msgSender(), block.timestamp, ARTIFACT_REWARD, 4);
         } else {
            WorldResourceS1.setArtifact(WorldResourceS1.getArtifact() - 1);
            PlayerTreasureS1.setArtifact(_msgSender(), PlayerTreasureS1.getArtifact(_msgSender()) + 1);
            PlayerQuestS1.setArtifact(_msgSender(), PlayerQuestS1.getArtifact(_msgSender()) + 1);

            emit DropResulted(_msgSender(), block.timestamp, 0, 4);
         }
      }
      else if(randomSeed < MYSTICAL_DROP) {
         if(WorldResourceS1.getMystical() == 0) {
            GameToken.setAmount(playerEntityId, GameToken.getAmount(playerEntityId) + MYSTICAL_REWARD);
            emit DropResulted(_msgSender(), block.timestamp, MYSTICAL_REWARD, 3);
         } else {
            WorldResourceS1.setMystical(WorldResourceS1.getMystical() - 1);
            PlayerTreasureS1.setMystical(_msgSender(), PlayerTreasureS1.getMystical(_msgSender()) + 1);
            PlayerQuestS1.setMystical(_msgSender(), PlayerQuestS1.getMystical(_msgSender()) + 1);

            emit DropResulted(_msgSender(), block.timestamp, 0, 3);
         }
      } else if(randomSeed < RARE_DROP) {
         if(WorldResourceS1.getRare() == 0) {
            GameToken.setAmount(playerEntityId, GameToken.getAmount(playerEntityId) + RARE_REWARD);

            emit DropResulted(_msgSender(), block.timestamp, RARE_REWARD, 2);
         } else {
            WorldResourceS1.setRare(WorldResourceS1.getRare() - 1);
            PlayerTreasureS1.setRare(_msgSender(), PlayerTreasureS1.getRare(_msgSender()) + 1);
            PlayerQuestS1.setRare(_msgSender(), PlayerQuestS1.getRare(_msgSender()) + 1);

            emit DropResulted(_msgSender(), block.timestamp, 0, 2);
         }
      } else if(randomSeed < COMMON_DROP) {
         if(WorldResourceS1.getCommon() == 0) {
            GameToken.setAmount(playerEntityId, GameToken.getAmount(playerEntityId) + COMMON_REWARD);

            emit DropResulted(_msgSender(), block.timestamp, COMMON_REWARD, 1);
         } else {
            WorldResourceS1.setCommon(WorldResourceS1.getCommon() - 1);
            PlayerTreasureS1.setCommon(_msgSender(), PlayerTreasureS1.getCommon(_msgSender()) + 1);
            PlayerQuestS1.setCommon(_msgSender(), PlayerQuestS1.getCommon(_msgSender()) + 1);

            emit DropResulted(_msgSender(), block.timestamp, 0, 1);
         }
      } else {
         GameToken.setAmount(playerEntityId, GameToken.getAmount(playerEntityId) + NORMAL_REWARD);

         emit DropResulted(_msgSender(), block.timestamp, NORMAL_REWARD, 0);
      }
   }
}
