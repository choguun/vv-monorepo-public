// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";

import { Character, Stamina, Health, Player } from "../codegen/index.sol";
// import { addressToEntity } from "../libraries/LibUtils.sol";
// Import user types
import { CharacterTypes } from "../codegen/common.sol";
import { MAX_STAMINA, MAX_HP, POTION_STAMINA } from "../../constants.sol";

contract CharacterSystem is System {
  function registerCharacter(CharacterTypes _type) public {
    bytes32 playerEntityId = Player._get(_msgSender());
    require(playerEntityId != bytes32(0), "Player does not exist");

    Character.set(_msgSender(), _type);
    Stamina.set(playerEntityId, block.timestamp, MAX_STAMINA);
    Health.set(playerEntityId, block.timestamp, MAX_HP);
  }

  function consumePotion() public {
    bytes32 playerEntityId = Player._get(_msgSender());
    require(playerEntityId != bytes32(0), "Player does not exist");
    require(Stamina.getStamina(playerEntityId) < MAX_STAMINA, "Health is already full");

    Stamina.set(playerEntityId, block.timestamp, Stamina.getStamina(playerEntityId) + POTION_STAMINA);
  }
}
