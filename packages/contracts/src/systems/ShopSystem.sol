// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";

import { Player, GameToken, InventoryObjects, InventoryCount, GoldRate } from "../codegen/index.sol";
import { addressToEntity } from "../libraries/LibUtils.sol";
import { STAMINA_POTION_ID, SEASON1_PACK_ID, WOODEN_PICK_ID } from "../ObjectTypeIds.sol";
import { POTION_PRICE, PACK_PRICE } from "../../constants.sol";

contract ShopSystem is System {
  function buyPotion() public {
    uint64 price = POTION_PRICE;

    bytes32 playerEntityId = Player._get(_msgSender());
    require(playerEntityId != bytes32(0), "Player does not exist");

    require(GameToken.getAmount(playerEntityId) >= price, "Not enough golds");
    GameToken.setAmount(playerEntityId, GameToken.getAmount(playerEntityId) - price);

    uint16[] memory currentInventory = InventoryObjects._getObjectTypeIds(playerEntityId);
    uint16[] memory newInventory = new uint16[](currentInventory.length + 1);

    for (uint256 i = 0; i < currentInventory.length; i++) {
        newInventory[i] = currentInventory[i];
    }

    newInventory[currentInventory.length] = STAMINA_POTION_ID;
    InventoryObjects._setObjectTypeIds(playerEntityId, newInventory);
    InventoryCount._set(playerEntityId, STAMINA_POTION_ID, InventoryCount._get(playerEntityId, STAMINA_POTION_ID) + 1);
  }

  function buyPack() public {
    uint64 price = PACK_PRICE;

    bytes32 playerEntityId = Player._get(_msgSender());
    require(playerEntityId != bytes32(0), "Player does not exist");

    require(GameToken.getAmount(playerEntityId) >= price, "Not enough golds");
    GameToken.setAmount(playerEntityId, GameToken.getAmount(playerEntityId) - price);

    uint16[] memory currentInventory = InventoryObjects._getObjectTypeIds(playerEntityId);
    uint16[] memory newInventory = new uint16[](currentInventory.length + 1);

    for (uint256 i = 0; i < currentInventory.length; i++) {
        newInventory[i] = currentInventory[i];
    }

    newInventory[currentInventory.length] = SEASON1_PACK_ID;
    InventoryObjects._setObjectTypeIds(playerEntityId, newInventory);
    InventoryCount._set(playerEntityId, SEASON1_PACK_ID, InventoryCount._get(playerEntityId, SEASON1_PACK_ID) + 1);
  }

  function buyGold() public payable {
    bytes32 playerEntityId = Player._get(_msgSender());
    require(playerEntityId != bytes32(0), "Player does not exist");

    require(_msgValue() > 0, "Not enough token");
    uint256 goldRate = GoldRate.getRate();
    uint256 goldAmount = _msgValue() * goldRate / 1e18;

    GameToken.setAmount(playerEntityId, GameToken.getAmount(playerEntityId) + uint64(goldAmount));
  }

  function openPack() public {
    bytes32 playerEntityId = Player._get(_msgSender());
    require(playerEntityId != bytes32(0), "Player does not exist");

    require(InventoryCount._get(playerEntityId, SEASON1_PACK_ID) > 0, "Not enough pack");

    InventoryCount._set(playerEntityId, SEASON1_PACK_ID, InventoryCount._get(playerEntityId, SEASON1_PACK_ID) - 1);

    uint16[] memory currentInventory = InventoryObjects._getObjectTypeIds(playerEntityId);
    uint16[] memory newInventory = new uint16[](currentInventory.length + 2);

    for (uint256 i = 0; i < currentInventory.length; i++) {
        newInventory[i] = currentInventory[i];
    }

    newInventory[currentInventory.length-1] = STAMINA_POTION_ID;
    newInventory[currentInventory.length] = WOODEN_PICK_ID;
    InventoryObjects._setObjectTypeIds(playerEntityId, newInventory);

    InventoryCount._set(playerEntityId, STAMINA_POTION_ID, InventoryCount._get(playerEntityId, STAMINA_POTION_ID) + 5);
    InventoryCount._set(playerEntityId, WOODEN_PICK_ID, InventoryCount._get(playerEntityId, WOODEN_PICK_ID) + 2);
  }
}
