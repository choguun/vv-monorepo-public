// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import "forge-std/Script.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { WorldResourceIdLib } from "@latticexyz/world/src/WorldResourceId.sol";
import { BEFORE_CALL_SYSTEM } from "@latticexyz/world/src/systemHookTypes.sol";

import { StandardDelegationsModule } from "@latticexyz/world-modules/src/modules/std-delegations/StandardDelegationsModule.sol";

import { PuppetModule } from "@latticexyz/world-modules/src/modules/puppet/PuppetModule.sol";
import { IERC20Mintable } from "@latticexyz/world-modules/src/modules/erc20-puppet/IERC20Mintable.sol";
import { registerERC20 } from "@latticexyz/world-modules/src/modules/erc20-puppet/registerERC20.sol";
import { ERC20MetadataData } from "@latticexyz/world-modules/src/modules/erc20-puppet/tables/ERC20Metadata.sol";
import { IERC721Mintable } from "@latticexyz/world-modules/src/modules/erc721-puppet/IERC721Mintable.sol";
import { registerERC721 } from "@latticexyz/world-modules/src/modules/erc721-puppet/registerERC721.sol";
import { ERC721MetadataData } from "@latticexyz/world-modules/src/modules/erc721-puppet/tables/ERC721Metadata.sol";
import { _erc721SystemId } from "@latticexyz/world-modules/src/modules/erc721-puppet/utils.sol";

import { RESOURCE_SYSTEM } from "@latticexyz/world/src/worldResourceTypes.sol";
import { ResourceId, WorldResourceIdLib } from "@latticexyz/world/src/WorldResourceId.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";

import { Admin, SkyPoolConfig, SeasonConfig, WorldResourceS1, WorldQuestS1, SeasonTimes, SeasonPassConfig } from "../src/codegen/index.sol";

import { addressToEntity } from "../src/libraries/LibUtils.sol";

import { SEASON_PASS_PRIVATE_MATCH_LIMIT, SEASON_START_TIME, SEASON_PASS_STARTING_PRICE, SEASON_PASS_MIN_PRICE, SEASON_PASS_PRICE_DECREASE_PER_SECOND, SEASON_PASS_PURCHASE_MULTIPLIER_PERCENT, SEASON_PASS_MINT_DURATION, SEASON_DURATION, COST_CREATE_MATCH, WINDOW, SKYPOOL_SUPPLY, SKY_KEY_TOKEN_ID, SEASON_PASS_NAMESPACE, ORB_NAMESPACE, SKY_KEY_NAMESPACE, SEASON_PASS_SYMBOL, SEASON_PASS_NAME } from "../constants.sol";

contract PostDeploy is Script {
  function run(address worldAddress) external {
    IWorld world = IWorld(worldAddress);

    StoreSwitch.setStoreAddress(worldAddress);

    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    address admin = vm.addr(deployerPrivateKey);
    bytes32 adminEntity = addressToEntity(admin);

    Admin.set(adminEntity, true);

    world.installRootModule(new StandardDelegationsModule(), new bytes(0));
    world.installModule(new PuppetModule(), new bytes(0));

    // Global Configuration
    SkyPoolConfig.setCost(COST_CREATE_MATCH);
    SkyPoolConfig.setWindow(WINDOW);

    SeasonConfig.setSeason(1);
    SeasonConfig.setStart(block.timestamp);
    uint256 end = block.timestamp + 30 days;
    SeasonConfig.setEnd(end);

    WorldResourceS1.setGod(5);
    WorldResourceS1.setArtifact(20);
    WorldResourceS1.setMystical(50);
    WorldResourceS1.setRare(150);
    WorldResourceS1.setCommon(1000);

    WorldResourceS1.setMaxGod(5);
    WorldResourceS1.setMaxArtifact(20);
    WorldResourceS1.setMaxMystical(50);
    WorldResourceS1.setMaxRare(150);
    WorldResourceS1.setMaxCommon(1000);

    WorldQuestS1.setCheckin(18);
    WorldQuestS1.setLogin(18);
    WorldQuestS1.setGather(300);
    WorldQuestS1.setCommon(5);
    WorldQuestS1.setRare(2);
    WorldQuestS1.setMystical(1);
    WorldQuestS1.setArtifact(1);

    SeasonPassConfig.set(
      SEASON_PASS_MIN_PRICE,
      SEASON_PASS_STARTING_PRICE,
      SEASON_PASS_PRICE_DECREASE_PER_SECOND,
      SEASON_PASS_PURCHASE_MULTIPLIER_PERCENT,
      block.timestamp + SEASON_PASS_MINT_DURATION
    );
    SeasonTimes.setSeasonStart(block.timestamp);
    SeasonTimes.setSeasonEnd(block.timestamp + 30 days);

    vm.stopBroadcast();
  }
}
