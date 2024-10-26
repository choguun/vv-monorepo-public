/* eslint-disable @typescript-eslint/no-unused-vars */
import { useComponentValue } from "@latticexyz/react";
import { Entity } from "@latticexyz/recs";
import { encodeSystemCallFrom } from "@latticexyz/world/internal";
import IWorldAbi from "contracts/out/IWorld.sol/IWorld.abi.json";
import { toast } from "react-hot-toast";
import { encodeFunctionData, maxUint256 } from "viem";

import { TimeDelegationAbi } from "../abis";
import { TIMEBOUND_DELEGATION, QUEST_SYSTEM_ID } from "../constants";
import { useAmalgema } from "../hooks/useAmalgema";
import { addressToEntityID } from "../mud/setupNetwork";

import { useExternalAccount } from "./hooks/useExternalAccount";
import { Button } from "./Theme/SkyStrife/Button";

export function PlayerPointSection() {
  const {
    externalWorldContract,
    network: {
      components: { PlayerPointS1 },
      worldContract,
      waitForTransaction,
      walletClient,
    },
    externalWalletClient,
    utils: { refreshBalance, hasTimeDelegation },
  } = useAmalgema() as any;

  const { address } = useExternalAccount();
  const hasDelegation = hasTimeDelegation(
    externalWalletClient.account.address,
    walletClient.account.address
  );
  const playerPointS1 = useComponentValue(
    PlayerPointS1,
    address ? addressToEntityID(address) : ("0" as Entity)
  )?.value;

  const handleDailyCheckIn = async () => {
    try {
      toast.loading("Check-in...");
      const hash = await worldContract.write.callFrom(
        encodeSystemCallFrom({
          abi: IWorldAbi,
          from: externalWalletClient.account.address,
          systemId: QUEST_SYSTEM_ID,
          functionName: "dailyCheckIn",
          args: [],
        })
      );
      await waitForTransaction(hash);
      toast.success("Check-in");
    } catch (e) {
      toast.error(e.message);
      console.error(e);
    }
  };

  return (
    <>
      <span className="text-xl">
        Your Point : {Number(playerPointS1).toLocaleString()}
      </span>
      {!hasDelegation ? (
        <Button
          buttonType="secondary"
          className="ml-5"
          onClick={async () => {
            await externalWorldContract.write.registerDelegation(
              [
                walletClient.account.address,
                TIMEBOUND_DELEGATION,
                encodeFunctionData({
                  abi: TimeDelegationAbi,
                  functionName: "initDelegation",
                  args: [walletClient.account.address, maxUint256],
                }),
              ],
              {
                account: externalWalletClient.account.address,
              }
            );

            setInterval(() => {
              window.location.reload();
            }, 1000);
          }}
        >
          Delegate
        </Button>
      ) : (
        <Button
          buttonType="secondary"
          className="ml-5"
          onClick={handleDailyCheckIn}
        >
          Daily Check-in
        </Button>
      )}
    </>
  );
}
