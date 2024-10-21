// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";

import { PlayerPointS1, PlayerQuestS1, PlayerTreasureS1, Player, Equipped, Stamina, InventoryCount } from "../codegen/index.sol";
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
      // Increase stamina by 200
      require(InventoryCount._get(addressToEntity(_msgSender()), STAMINA_POTION_ID) > 0, "Not enough potions");
      InventoryCount._set(addressToEntity(_msgSender()), STAMINA_POTION_ID, InventoryCount._get(addressToEntity(_msgSender()), STAMINA_POTION_ID) - 1);

      Stamina.setStamina(playerEntityId, Stamina.getStamina(playerEntityId) + 200);
    } else if(objectID == SEASON1_PACK_ID) {
      // Open the pack
      require(InventoryCount._get(addressToEntity(_msgSender()), SEASON1_PACK_ID) > 0, "Not enough potions");
      InventoryCount._set(addressToEntity(_msgSender()), SEASON1_PACK_ID, InventoryCount._get(addressToEntity(_msgSender()), SEASON1_PACK_ID) - 1);

      InventoryCount._set(addressToEntity(_msgSender()), STAMINA_POTION_ID, InventoryCount._get(addressToEntity(_msgSender()), STAMINA_POTION_ID) + 5);
      InventoryCount._set(addressToEntity(_msgSender()), SEASON1_PACK_ID, InventoryCount._get(addressToEntity(_msgSender()), SEASON1_PACK_ID) + 2);
    }
  }
}
