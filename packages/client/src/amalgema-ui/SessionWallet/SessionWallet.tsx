/* eslint-disable no-empty-pattern */
import { parseEther } from "viem";

import { Modal } from "../../amalgema-ui/Modal";
import { useAmalgema } from "../../hooks/useAmalgema";
import { EthInput } from "../common";
import { PromiseButton } from "../hooks/PromiseButton";
import { useMainWalletBalance } from "../hooks/useBalance";
import { useBurnerBalance } from "../hooks/useBalance";
import { Button } from "../Theme/SkyStrife/Button";
import { Card } from "../Theme/SkyStrife/Card";
import { Body, OverlineLarge } from "../Theme/SkyStrife/Typography";

function TopUpButton() {
  const {
    externalWalletClient,
    network: { walletClient },
  } = useAmalgema() as any;

  return (
    <PromiseButton
      promise={async () => {
        if (!externalWalletClient || !externalWalletClient.account) {
          throw new Error("No external wallet connected");
        }

        await externalWalletClient.sendTransaction({
          chain: walletClient.chain,
          account: externalWalletClient.account,
          to: walletClient.account.address,
          value: parseEther("0.001"),
        });
      }}
      buttonType="primary"
      className="grow w-full"
    >
      send eth to session wallet
    </PromiseButton>
  );
}

/**
 * When the session wallet balance reaches the danger threshold, display a warning
 * and a prompt to send more ETH to session wallet.
 *
 * When it goes below the minimum to send an in-game tx, display a fullscreen
 * takeover Modal that requires them to send to the session wallet, or return to the main
 * menu otherwise.
 */
export function SessionWallet() {
  const {
    network: {},
  } = useAmalgema() as any;

  const burnerBalance = useBurnerBalance();
  const mainWalletBalance = useMainWalletBalance();

  return (
    <>
      {!import.meta.env.DEV && burnerBalance?.danger && (
        <Card className="w-fit py-2 px-3 pointer-events-auto">
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-red-600 h-3 w-3 animate-pulse" />

            <div className="w-2" />

            <OverlineLarge
              style={{
                fontWeight: 400,
                fontSize: "14px",
              }}
              className="text-ss-text-light"
            >
              session wallet balance
            </OverlineLarge>

            <div className="w-2" />

            <OverlineLarge
              style={{
                fontWeight: 500,
                fontSize: "14px",
              }}
              className="text-ss-text-default"
            >
              {burnerBalance.formatted} {NATIVE_SYMBOL}
            </OverlineLarge>
          </div>

          <div className="h-2" />

          <TopUpButton />

          <Modal
            isOpen={burnerBalance.unplayable}
            title="no more session wallet funds"
            trigger={<></>}
            footer={
              <div className="flex w-full space-x-2">
                <a href="/" className="grow">
                  <Button buttonType="danger" className="w-full">
                    quit match
                  </Button>
                </a>

                {!mainWalletBalance.unplayable && <TopUpButton />}
              </div>
            }
          >
            <div className="flex flex-row space-x-6">
              <EthInput
                amount={mainWalletBalance.value ? mainWalletBalance.value : 0n}
                className="pr-2"
                label="Main Wallet"
              />
              <EthInput
                amount={burnerBalance.value ? burnerBalance.value : 0n}
                className="pr-2"
                label="Session Wallet"
              />
            </div>

            <div className="h-4" />

            {!mainWalletBalance.unplayable && burnerBalance.unplayable && (
              <>
                <Body>
                  You do not have enough {NATIVE_SYMBOL} in your session wallet
                  to play this match of VoxelWorld. If you would like to
                  continue playing, you must top up your session wallet or
                  transfer a custom amount.
                </Body>
              </>
            )}

            {mainWalletBalance.unplayable && (
              <Body>
                You do not have enough {NATIVE_SYMBOL} to play this match of VoxelWorld.
              </Body>
            )}
          </Modal>
        </Card>
      )}
    </>
  );
}
