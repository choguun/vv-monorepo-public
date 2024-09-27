// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";

import { PlayerPointS1, PlayerQuestS1, PlayerTreasureS1, Player } from "../codegen/index.sol";
import { addressToEntity } from "../libraries/LibUtils.sol";

contract AccountSystem is System {

  function createAccount() public {
    bytes32 entity = addressToEntity(_msgSender());
    uint256 currentPlayerPoint = PlayerPointS1.get(_msgSender());
    uint256 currentPlayerCheckin = PlayerQuestS1.getCheckin(_msgSender());
    uint256 currentPlayerLogin = PlayerQuestS1.getLogin(_msgSender());

    require(currentPlayerPoint == 0 && currentPlayerCheckin == 0 && currentPlayerLogin == 0, "Account already exists");

    PlayerPointS1._set(_msgSender(), 0);
    PlayerQuestS1._set(_msgSender(), 0, 0, 0, 0, 0, 0, 0, 0);
    PlayerTreasureS1._set(_msgSender(), 0, 0, 0, 0, 0);
    Player._set(_msgSender(), entity);
  }
}
