import { useMemo } from "react";

import { useComponentValue } from "@latticexyz/react";
import { singletonEntity } from "@latticexyz/store-sync/recs";

import { useAmalgema } from "../../hooks/useAmalgema";

export function useSeasonPassPrice(atTime: bigint) {
  const {
    components: { SeasonPassConfig, SeasonPassLastSaleAt },
  } = useAmalgema() as any;

  const config = useComponentValue(SeasonPassConfig, singletonEntity);
  const lastSaleAt = useComponentValue(SeasonPassLastSaleAt, singletonEntity);

  const price = useMemo(() => {
    if (!config || !lastSaleAt) return 0n;
    const { startingPrice, rate, minPrice } = config;
    const timeSinceLastSale = atTime - BigInt(lastSaleAt.lastSaleAt);
    const decrease =
      ((BigInt(startingPrice) * BigInt(rate)) / 10_000_000_000n) *
      timeSinceLastSale;

    if (BigInt(startingPrice) > decrease) {
      const newPrice = startingPrice - decrease;
      if (newPrice > minPrice) {
        return startingPrice - decrease;
      } else {
        return minPrice;
      }
    } else {
      return minPrice;
    }
  }, [config, lastSaleAt, atTime]);

  return price;
}
