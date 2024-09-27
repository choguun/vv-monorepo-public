import { useComponentValue } from "@latticexyz/react";
import { Entity } from "@latticexyz/recs";
import { Hex } from "viem";

import { useAmalgema } from "../../hooks/useAmalgema";
import { addressToEntityID } from "../../mud/setupNetwork";

export const useSeasonPass = (account: Hex): boolean => {
  const {
    components: { SeasonPass_Balances },
  } = useAmalgema() as any;

  const balance = useComponentValue(
    SeasonPass_Balances,
    addressToEntityID(account)
  );

  if (!balance) return false;
  return balance && balance.value > 0;
};

export const useSeasonPassExternalWallet = (): boolean => {
  const {
    externalWalletClient,
    components: { SeasonPass_Balances },
  } = useAmalgema();

  const balance = useComponentValue(
    SeasonPass_Balances,
    externalWalletClient && externalWalletClient.account
      ? addressToEntityID(externalWalletClient.account.address)
      : ("0" as Entity)
  );

  if (!balance) return false;
  return balance && balance.value > 0;
};
