// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";

import { PlayerPointS1, PlayerQuestS1, PlayerTreasureS1, Player, Equipped, Stamina, InventoryObjects, InventoryCount } from "../codegen/index.sol";
import { addressToEntity } from "../libraries/LibUtils.sol";
import { STAMINA_POTION_ID, WOODEN_PICK_ID, SEASON1_PACK_ID } from "../ObjectTypeIds.sol";

contract InventorySystem is System {

  function getCurentEquippedTool() public view returns (bytes32) {
    bytes32 ownerEntityId = addressToEntity(_msgSender());
    bytes32 currentTool = Equipped.getToolEntityId(ownerEntityId);

    return currentTool;
  }

  function equipTool(uint32 objectTypeId, uint8 side) public {
    bytes32 ownerEntityId = addressToEntity(_msgSender());
    bytes32 currentTool = Equipped.getToolEntityId(ownerEntityId);
    uint8 currentSide = Equipped.getSide(ownerEntityId);
    
    if (currentTool != 0) {
      // If the player already has a tool equipped, unequip it
      Equipped.setToolEntityId(ownerEntityId, 0);
      Equipped.setSide(ownerEntityId, 0);
    }
  }

  function useItem(uint16 objectID) public {
    bytes32 playerEntityId = Player._get(_msgSender());
    require(playerEntityId != bytes32(0), "Player does not exist");

    if (objectID == STAMINA_POTION_ID) {
      require(InventoryCount._get(addressToEntity(_msgSender()), STAMINA_POTION_ID) > 0, "Not enough potions");
      InventoryCount._set(addressToEntity(_msgSender()), STAMINA_POTION_ID, InventoryCount._get(addressToEntity(_msgSender()), STAMINA_POTION_ID) - 1);

      if(Stamina.getStamina(playerEntityId) > 800) {
        Stamina.setStamina(playerEntityId, 1000);
      } else {
        Stamina.setStamina(playerEntityId, Stamina.getStamina(playerEntityId) + 200);
      }
    } else if(objectID == SEASON1_PACK_ID) {
      openPack();
    }
  }

  function openPack() public {
    bytes32 playerEntityId = Player._get(_msgSender());
    require(playerEntityId != bytes32(0), "Player does not exist");

    require(InventoryCount._get(playerEntityId, SEASON1_PACK_ID) > 0, "Not enough pack");

    InventoryCount._set(playerEntityId, SEASON1_PACK_ID, InventoryCount._get(playerEntityId, SEASON1_PACK_ID) - 1);

    uint16[] memory currentInventory = InventoryObjects._getObjectTypeIds(playerEntityId);
    uint16[] memory newInventory = new uint16[](currentInventory.length + 1); // 2 if have woonden pick

    for (uint256 i = 0; i < currentInventory.length; i++) {
        newInventory[i] = currentInventory[i];
    }

    newInventory[currentInventory.length] = STAMINA_POTION_ID;
    // newInventory[currentInventory.length+1] = WOODEN_PICK_ID;
    InventoryObjects._setObjectTypeIds(playerEntityId, newInventory);

    InventoryCount._set(playerEntityId, STAMINA_POTION_ID, InventoryCount._get(playerEntityId, STAMINA_POTION_ID) + 8);
    // InventoryCount._set(playerEntityId, WOODEN_PICK_ID, InventoryCount._get(playerEntityId, WOODEN_PICK_ID) + 0);
  }
}
