// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";

import { PlayerPointS1, Player, PlayerQuestS1, PlayerQuestFinishedS1, PlayersActivity, WorldQuestS1, Stamina, Health, GameToken, PlayerTreasureS1, WorldResourceS1 } from "../codegen/index.sol";
// import { addressToEntity } from "../libraries/LibUtils.sol";
import { QuestTypes } from "../codegen/common.sol";

contract MineSystem is System {
   function mineBlock() public {
        bytes32 playerEntityId = Player._get(_msgSender());
        require(playerEntityId != bytes32(0), "Player does not exist");
        require(Stamina.getStamina(playerEntityId) > 0, "Not enough stamina");

        Stamina.setStamina(playerEntityId, Stamina.getStamina(playerEntityId) - 10);
        Stamina.setLastUpdatedTime(playerEntityId, block.timestamp);
        GameToken.setAmount(playerEntityId, GameToken.getAmount(playerEntityId) + 100);
        dropTreasure();
   }

    // God: 5/5| Artifact: 20/20 |Mystical: 50/50 |Rare: 150/150 |Common: 1,000/1,000
    uint16 public constant COMMON_DROP = 100; // 10% Chance
    uint16 public constant RARE_DROP = 50; // 5% Chance
    uint16 public constant MYSTICAL_DROP = 10; // 1% Chance
    uint16 public constant ARTIFACT_DROP = 5; // 0.5% Chance
    uint16 public constant GOD_DROP = 1; // 0.1% Chance

    // TODO: drop treasure calculation based on chance
    function dropTreasure() public {
        bytes32 playerEntityId = Player._get(_msgSender());
        require(playerEntityId != bytes32(0), "Player does not exist");
        uint256 randomSeed = (uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, _msgSender()))) % 1000);
        
        if(randomSeed < GOD_DROP) {
            if(WorldResourceS1.getGod() == 0) {
               GameToken.setAmount(playerEntityId, GameToken.getAmount(playerEntityId) + 1000000);
            } else {
               WorldResourceS1.setGod(WorldResourceS1.getGod() - 1);
               PlayerTreasureS1.setGod(_msgSender(), PlayerTreasureS1.getGod(_msgSender()) + 1);
            }
        }
        else if(randomSeed < ARTIFACT_DROP) {
            if(WorldResourceS1.getArtifact() == 0) {
               GameToken.setAmount(playerEntityId, GameToken.getAmount(playerEntityId) + 100000);
            } else {
               WorldResourceS1.setArtifact(WorldResourceS1.getArtifact() - 1);
               PlayerTreasureS1.setArtifact(_msgSender(), PlayerTreasureS1.getArtifact(_msgSender()) + 1);
            }
         }
        else if(randomSeed < MYSTICAL_DROP) {
            if(WorldResourceS1.getMystical() == 0) {
               GameToken.setAmount(playerEntityId, GameToken.getAmount(playerEntityId) + 10000);
            } else {
               WorldResourceS1.setMystical(WorldResourceS1.getMystical() - 1);
               PlayerTreasureS1.setMystical(_msgSender(), PlayerTreasureS1.getMystical(_msgSender()) + 1);
            }
        } else if(randomSeed < RARE_DROP) {
            if(WorldResourceS1.getRare() == 0) {
               GameToken.setAmount(playerEntityId, GameToken.getAmount(playerEntityId) + 1000);
            } else {
               WorldResourceS1.setRare(WorldResourceS1.getRare() - 1);
               PlayerTreasureS1.setRare(_msgSender(), PlayerTreasureS1.getRare(_msgSender()) + 1);
            }
        } else if(randomSeed < COMMON_DROP) {
            if(WorldResourceS1.getCommon() == 0) {
               GameToken.setAmount(playerEntityId, GameToken.getAmount(playerEntityId) + 200);
            } else {
               WorldResourceS1.setCommon(WorldResourceS1.getCommon() - 1);
               PlayerTreasureS1.setCommon(_msgSender(), PlayerTreasureS1.getCommon(_msgSender()) + 1);
            }
        }
        // bytes32 playerEntityId = Player._get(_msgSender());
        // require(playerEntityId != bytes32(0), "Player does not exist");

        // Character.set(_msgSender(), _type);
        // Stamina.set(playerEntityId, block.timestamp, 1000);
        // Health.set(playerEntityId, block.timestamp, 100);
    }
}
