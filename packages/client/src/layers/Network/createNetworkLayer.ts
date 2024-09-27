/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  Has,
  HasValue,
  getComponentValue,
  getComponentValueStrict,
  hasComponent,
  runQuery,
  setComponent,
} from "@latticexyz/recs";
import { decodeEntity } from "@latticexyz/store-sync/recs";
import { Hex } from "viem";
import { getBalance } from "viem/actions";

import {
  ALLOW_LIST_SYSTEM_ID,
  BUILD_SYSTEM_ID,
  BYTES32_ZERO,
  MOVE_SYSTEM_ID,
  SEASON_PASS_ONLY_SYSTEM_ID,
  SPAWN_SETTLEMENT,
  UNLIMITED_DELEGATION,
} from "../../constants";
import { skystrifeDebug } from "../../debug";
import { setup } from "../../mud/setup";
import { addressToEntityID } from "../../mud/setupNetwork";
import { NetworkConfig } from "../../mud/utils";

import { createSystemExecutor } from "./createSystemExecutor";
import { createWalletBalanceSystem } from "./systems/WalletBalanceSystem";

const debug = skystrifeDebug.extend("network-layer");

/**
 * The Network layer is the lowest layer in the client architecture.
 * Its purpose is to synchronize the client components with the contract components.
 */
export async function createNetworkLayer(config: NetworkConfig) {
  const { network, components } = await setup(config);
  const { worldContract } = network;

  const isBrowser = typeof window !== "undefined";

  const calculateMeanTxResponseTime = () => {
    const allTransactions = [...runQuery([Has(components.Transaction)])];

    return (
      allTransactions.reduce((acc, entity) => {
        const transaction = getComponentValue(components.Transaction, entity);
        if (!transaction || transaction.status !== "completed") return acc;

        const responseTime = Number(
          (transaction.completedTimestamp ?? 0n) -
            (transaction.submittedTimestamp ?? 0n)
        );
        return acc + responseTime;
      }, 0) /
      (allTransactions.filter(
        (t) =>
          getComponentValue(components.Transaction, t)?.status === "completed"
      ).length || 1)
    );
  };

  const { executeSystem, executeSystemWithExternalWallet } =
    createSystemExecutor({
      worldContract,
      network,
      components,
      calculateMeanTxResponseTime,
    });

  const refreshBalance = async (address: Hex) => {
    try {
      const balance = await getBalance(network.walletClient as any, {
        address,
      });
      const addressEntity = addressToEntityID(address);
      setComponent(components.WalletBalance, addressEntity, {
        value: balance,
      });
    } catch (e) {
      debug(`Failed to fetch external wallet balance for address ${address}`);
    }
  };

  const hasPendingAction = (entity: Entity) => {
    const pendingAction = [
      ...runQuery([
        HasValue(components.Action, {
          entity,
          status: "pending",
        }),
      ]),
    ][0];

    return Boolean(pendingAction);
  };

  function hasUnlimitedDelegation(delegator: Hex, delegatee: Hex): boolean {
    return Array.from(runQuery([Has(components.UserDelegationControl)])).some(
      (entity) => {
        const key = decodeEntity(
          (components.UserDelegationControl.metadata as any)?.keySchema,
          entity
        );

        const { delegationControlId } = getComponentValueStrict(
          components.UserDelegationControl,
          entity
        );

        return (
          key.delegator === delegator &&
          key.delegatee === delegatee &&
          delegationControlId === UNLIMITED_DELEGATION
        );
      }
    );
  }

  function hasSystemDelegation(
    delegator: Hex,
    delegatee: Hex,
    systemId: Hex
  ): boolean {
    return Array.from(runQuery([Has(components.SystemboundDelegations)])).some(
      (entity) => {
        const key = decodeEntity(
          components.SystemboundDelegations.metadata.keySchema,
          entity
        );

        return (
          key.delegator === delegator &&
          key.delegatee === delegatee &&
          key.systemId === systemId
        );
      }
    );
  }

  function hasTimeDelegation(delegator: Hex, delegatee: Hex): boolean {
    return Array.from(runQuery([Has(components.TimeboundDelegations)])).some(
      (entity) => {
        const key = decodeEntity(
          components.TimeboundDelegations.metadata.keySchema,
          entity
        );

        return key.delegator === delegator && key.delegatee === delegatee;
      }
    );
  }

  const layer = {
    world: network.world,
    network,
    components: {
      ...network.components,
      ...components,
    },
    executeSystem,
    executeSystemWithExternalWallet,
    isBrowser,
    api: {},
    utils: {
      refreshBalance,
      hasPendingAction,
      hasUnlimitedDelegation,
      hasSystemDelegation,
      hasTimeDelegation,
    },
  };

  createWalletBalanceSystem(layer);

  return layer;
}
