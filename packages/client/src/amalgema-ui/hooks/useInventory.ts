/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEntityQuery } from "@latticexyz/react";
import { useComponentValue } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { Entity } from "@latticexyz/recs";
import { Hex } from "viem";

import { useAmalgema } from "../../hooks/useAmalgema";
import { addressToEntityID } from "../../mud/setupNetwork";
import { useExternalAccount } from "../hooks/useExternalAccount";

export function useInventory(): { inventory: number[] | undefined } {
  const {
    components: { InventoryObjects },
  } = useAmalgema() as any;
  const { address } = useExternalAccount();

  const inventoryTypeList = useComponentValue(
    InventoryObjects,
    address ? addressToEntityID(address) : ("0" as Entity)
  )?.objectTypeIds;

  return { inventory: (inventoryTypeList as number[]) ?? [] };
}
