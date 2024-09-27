import { useComponentValue } from "@latticexyz/react";
import { Entity } from "@latticexyz/recs";

import { useAmalgema } from "../hooks/useAmalgema";
import { addressToEntityID } from "../mud/setupNetwork";

import { useExternalAccount } from "./hooks/useExternalAccount";
import { Button } from "./Theme/SkyStrife/Button";

export function PlayerPointSection() {
  const {
    network: {
      components: { PlayerPointS1 },
    },
    executeSystemWithExternalWallet,
  } = useAmalgema() as any;

  const { address } = useExternalAccount();
  const playerPointS1 = useComponentValue(
    PlayerPointS1,
    address ? addressToEntityID(address) : ("0" as Entity)
  )?.value;

  const handleDailyCheckIn = async () => {
    await executeSystemWithExternalWallet({
      systemCall: "dailyCheckIn",
      systemId: "Daily Check-in",
      args: [{ account: address }],
    });
  };

  return (
    <>
      <span className="text-xl">
        Your Point : {Number(playerPointS1).toLocaleString()}
      </span>
      <Button
        buttonType="secondary"
        className="ml-5"
        onClick={handleDailyCheckIn}
      >
        Daily Check-in
      </Button>
    </>
  );
}
