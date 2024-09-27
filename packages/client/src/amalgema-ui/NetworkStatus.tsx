/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConnectButton } from "@particle-network/connectkit";
import { twMerge } from "tailwind-merge";
import { useAccount, useSwitchChain } from "wagmi";

import { useAmalgema } from "../hooks/useAmalgema";

import { CustomConnectButton } from "./CustomConnectButton";
import { SyncStatus } from "./SyncStatus";
import { Button } from "./Theme/SkyStrife/Button";
import { Caption } from "./Theme/SkyStrife/Typography";

export function NetworkStatus({ className }: { className?: string }) {
  const {
    network: { networkConfig },
    // Remove externalWalletClient since we'll use wagmi's hooks
    externalWalletClient,
  } = useAmalgema();

  const clientChain = networkConfig.chain;

  const { chain: walletChain, isConnected } = useAccount();
  const walletChainId = walletChain?.id ?? 0;

  // Use the useSwitchNetwork hook from wagmi
  const { switchChain, isPending } = useSwitchChain();

  // You can remove this check since we're using wagmi's hooks
  if (!externalWalletClient) return <></>;

  return (
    <div className="flex gap-x-4">
      <SyncStatus />
      {!isConnected ? (
        <CustomConnectButton />
      ) : (
        <Button
          buttonType="tertiary"
          onClick={() => {
            try {
              if (switchChain) {
                switchChain({ chainId: clientChain.id });
              } else {
                console.error("Cannot switch network");
              }
            } catch (error) {
              console.error("Failed to switch chain:", error);
            }
          }}
          className={twMerge(
            "h-[32px] flex justify-center items-center border-1 rounded-2xl",
            className
          )}
          disabled={isPending}
        >
          {clientChain.id === walletChainId ? (
            <div className="flex flex-row justify-center items-center">
              <div className="w-3 h-3 bg-green-500 rounded-md m-1" />
              <Caption>{clientChain.name}</Caption>
            </div>
          ) : (
            <div className="flex flex-row justify-center items-center">
              <div className="w-3 h-3 bg-red-500 rounded-md m-1" />
              <Caption>Switch to {clientChain.name}</Caption>
            </div>
          )}
        </Button>
      )}
    </div>
  );
}
