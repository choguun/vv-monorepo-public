/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEntityQuery } from "@latticexyz/react";
import { useComponentValue } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { Entity } from "@latticexyz/recs";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { Hex } from "viem";

import { useAmalgema } from "../../hooks/useAmalgema";
import { addressToEntityID } from "../../mud/setupNetwork";
import { useExternalAccount } from "../hooks/useExternalAccount";

export function useInventoryCount(objectId: any) {
  const {
    components: { InventoryCount },
  } = useAmalgema() as any;
  const { address } = useExternalAccount();

  const InventoryCountEntity = encodeEntity(
    {
      ownerEntityId: "bytes32",
      objectTypeId: "uint16",
    },
    {
      ownerEntityId: addressToEntityID(address) as `0x${string}`,
      objectTypeId: objectId,
    }
  );

  const count =
    getComponentValue(InventoryCount, InventoryCountEntity)?.count ?? 0;

  return { count: count };
}
