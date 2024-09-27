// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

/* Autogenerated file. Do not edit manually. */

import { CharacterTypes } from "../common.sol";

/**
 * @title ICharacterSystem
 * @author MUD (https://mud.dev) by Lattice (https://lattice.xyz)
 * @dev This interface is automatically generated from the corresponding system contract. Do not edit manually.
 */
interface ICharacterSystem {
  function registerCharacter(CharacterTypes _type) external;

  function consumePotion() external;
}
