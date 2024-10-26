import { useMemo } from "react";

import { useComponentValue } from "@latticexyz/react";
import { singletonEntity } from "@latticexyz/store-sync/recs";

import { useAmalgema } from "../../hooks/useAmalgema";

export function useSeasonPassPrice(atTime: bigint) {
  const price = 10000000000000000n;

  return price;
}
