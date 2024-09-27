/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useEffect } from "react";

import { useComponentValue } from "@latticexyz/react";
import { Entity } from "@latticexyz/recs";
import { encodeSystemCallFrom } from "@latticexyz/world/internal";
import IWorldAbi from "contracts/out/IWorld.sol/IWorld.abi.json";
import { Hex, encodeFunctionData, hexToString, maxUint256, padHex } from "viem";
import { useAccount } from "wagmi";

import { TimeDelegationAbi, SystemDelegationAbi } from "../../abis";
import {
  NAME_SYSTEM_ID,
  SEASON_PASS_ONLY_SYSTEM_ID,
  SYSTEMBOUND_DELEGATION,
  TIMEBOUND_DELEGATION,
} from "../../constants";
import { NATIVE_SYMBOL } from "../../constants";
import { useAmalgema } from "../../hooks/useAmalgema";
import { useStore } from "../../hooks/useStore";
import { addressToEntityID } from "../../mud/setupNetwork";
import { EthInput } from "../common";
import { PromiseButton } from "../hooks/PromiseButton";
import { useBurnerBalance, useMainWalletBalance } from "../hooks/useBalance";
import { useExternalAccount } from "../hooks/useExternalAccount";
import { useNameIsValid } from "../hooks/useNameIsValid";
import { Modal } from "../Modal";
import { NetworkStatus } from "../NetworkStatus";
import { SessionWalletModal } from "../SessionWalletManager";
import { Button } from "../Theme/SkyStrife/Button";
import { ExternalArrow } from "../Theme/SkyStrife/Icons/ExternalArrow";
import { Link, OverlineSmall } from "../Theme/SkyStrife/Typography";
import WarningSection from "../Theme/SkyStrife/WarningSection";

export function WelcomeToSkyStrifeModal() {
  const {
    externalWorldContract,
    components: { Name },
    externalWalletClient,
    executeSystemWithExternalWallet,
    waitForTransaction,
    network: { networkConfig, walletClient, worldContract },
    utils: { refreshBalance, hasTimeDelegation },
  } = useAmalgema();

  const { loadingPageHidden } = useStore();

  const [visible, setVisible] = useState(false);
  const [skip, setSkip] = useState(false);

  const { address } = useExternalAccount();
  const hasDelegation = address
    ? hasTimeDelegation(address, walletClient.account.address)
    : false;
  const sessionWalletAddress = walletClient.account.address;

  const name = useComponentValue(
    Name,
    address ? addressToEntityID(address) : ("0" as Entity)
  )?.value;

  const { chain: walletChain } = useAccount();
  const clientChain = networkConfig.chain;
  const wrongChain = walletChain?.id !== clientChain.id;

  const balanceData = useMainWalletBalance();
  const noBalance = balanceData?.value === 0n;

  const sessionWalletBalanceData = useBurnerBalance();
  const noSessionWalletBalance = sessionWalletBalanceData?.value === 0n;

  const [newName, setNewName] = useState<string>(
    typeof name === "string" ? name : ""
  );
  const [alreadyCreateAccount, setAlreadyCreateAccount] = useState(false);
  const [alreadyDelegated, setAlreadyDelegated] = useState(false);
  const { nameValid, nameValidityMessage } = useNameIsValid(newName);

  useEffect(() => {
    if (!address) return;

    refreshBalance(address);
    refreshBalance(sessionWalletAddress);
    console.log(name);
    if (name && name.length > 0) {
      console.log("false");
      setVisible(false);
    } else {
      console.log("true");
      setVisible(true);
    }
  }, [address, name, skip, refreshBalance, sessionWalletAddress]);

  if (!loadingPageHidden || !address || !externalWalletClient) return <></>;

  let submitButtonLabel = "save and continue";
  if (wrongChain) {
    submitButtonLabel = "wrong network";
  } else if (noBalance) {
    submitButtonLabel = `insufficient ${NATIVE_SYMBOL}`;
  } else if (!nameValid) {
    submitButtonLabel = nameValidityMessage;
  }

  const disabled = wrongChain || noBalance;
  const showSessionWalletSection = !wrongChain && !noBalance;
  const showNameSection = !noSessionWalletBalance && showSessionWalletSection;

  return (
    <Modal
      isOpen={visible}
      setOpen={(o) => setSkip(!o)}
      title="Welcome to Voxel World!"
      noClose={true}
      footer={
        <>
          <PromiseButton
            buttonType="primary"
            disabled={
              disabled ||
              !nameValid ||
              !alreadyCreateAccount ||
              !alreadyDelegated
            }
            promise={() => {
              const result = executeSystemWithExternalWallet({
                systemCall: "setName",
                systemId: "Set Name",
                args: [[newName], { account: address }],
              });
              // setVisible(false);
              return result;
            }}
            className="uppercase grow"
          >
            {submitButtonLabel}
          </PromiseButton>
        </>
      }
    >
      <div className="flex flex-col gap-y-4">
        {/* <WarningSection>
          <p className="font-bold">
            Some wallets do not use the correct gas fees for Redstone.
          </p>
          <p>
            To avoid excessive gas costs, please follow{" "}
            <Link href="https://latticexyz.notion.site/Redstone-Network-Fee-Config-26802608ef8343ce855a68ca44b9499e">
              this guide
            </Link>{" "}
            to set the proper fees. You can configure it while sending the
            transaction to set your username.
          </p>
        </WarningSection> */}

        <div>
          <OverlineSmall>1. network and {NATIVE_SYMBOL}</OverlineSmall>
          <NetworkStatus className="w-full" />
        </div>

        {!wrongChain && (
          <>
            <EthInput
              amount={balanceData.value ? balanceData.value : 0n}
              className="pr-2"
              label={`${clientChain.name} balance`}
              danger={noBalance}
            />
          </>
        )}

        {!wrongChain && noBalance && (
          <>
            <a
              rel="noreferrer"
              href={clientChain.bridgeUrl ?? "#"}
              target="_blank"
            >
              <Button buttonType={"primary"} className="w-full">
                <div className="flex gap-x-3 items-center">
                  <span>bridge to {clientChain.name}</span> <ExternalArrow />
                </div>
              </Button>
            </a>
          </>
        )}

        {showSessionWalletSection && (
          <div className="w-full">
            <OverlineSmall>2. fund session wallet</OverlineSmall>
            <>
              <EthInput
                amount={
                  sessionWalletBalanceData.value
                    ? sessionWalletBalanceData.value
                    : 0n
                }
                className="pr-2"
                label={`session wallet balance`}
                danger={noSessionWalletBalance}
              />

              {noSessionWalletBalance && (
                <>
                  <div className="h-4" />
                  <SessionWalletModal primary />
                </>
              )}
            </>
          </div>
        )}

        {showNameSection && (
          <div>
            <OverlineSmall>3. create account</OverlineSmall>
            <PromiseButton
              buttonType="primary"
              disabled={disabled || alreadyCreateAccount}
              promise={() => {
                const result = executeSystemWithExternalWallet({
                  systemCall: "createAccount",
                  systemId: "Create Account",
                  args: [{ account: address }],
                });
                setAlreadyCreateAccount(true);
                return result;
              }}
              className="uppercase grow w-full"
            >
              {!alreadyCreateAccount ? (
                <>Create Account</>
              ) : (
                <>Account Created</>
              )}
            </PromiseButton>
          </div>
        )}

        {showNameSection && (
          <div>
            {!hasDelegation && (
              <div>
                <OverlineSmall>3.1 delegate session wallet</OverlineSmall>
                <div className="flex flex-col m-2">
                  <PromiseButton
                    buttonType="primary"
                    disabled={hasDelegation || !alreadyCreateAccount}
                    promise={async () => {
                      if (!externalWorldContract) return;
                      if (
                        !externalWalletClient ||
                        !externalWalletClient.account
                      )
                        return;

                      const account = externalWalletClient.account;

                      console.log(walletClient.account.address);
                      console.log(externalWorldContract);
                      console.log(worldContract);

                      const result =
                        await externalWorldContract.write.registerDelegation(
                          [
                            walletClient.account.address,
                            SYSTEMBOUND_DELEGATION,
                            encodeFunctionData({
                              abi: SystemDelegationAbi,
                              functionName: "initDelegation",
                              args: [
                                walletClient.account.address,
                                NAME_SYSTEM_ID,
                                maxUint256,
                              ],
                            }),
                          ],
                          {
                            account: account.address,
                          }
                        );
                      setAlreadyDelegated(true);
                      return result;
                    }}
                  >
                    Delegate
                  </PromiseButton>
                </div>
              </div>
            )}
          </div>
        )}

        {showNameSection && (
          <div>
            <OverlineSmall>4. set VoxelWorld username</OverlineSmall>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!nameValid) {
                  // executeSystemWithExternalWallet({
                  //   systemCall: "setName",
                  //   systemId: "Set Name",
                  //   args: [[newName], { account: address }],
                  // });
                  if (!externalWorldContract || !address) return;

                  const hash = await worldContract.write.callFrom(
                    encodeSystemCallFrom({
                      abi: IWorldAbi,
                      from: address,
                      systemId: NAME_SYSTEM_ID,
                      functionName: "setName",
                      args: [newName],
                    })
                  );

                  await waitForTransaction(hash);
                }
              }}
              className="flex flex-col items-start"
            >
              <div className="h-1" />
              <input
                id="username"
                className="bg-ss-bg-0 rounded border border-ss-stroke border-solid w-full px-3 py-2 shadow-ss-small"
                placeholder="Enter a username"
                value={newName}
                onChange={(e) => {
                  // eslint-disable-next-line no-control-regex
                  const ascii = e.target.value.replace(/[^\x00-\x7F]/g, "");

                  setNewName(ascii);
                }}
              />
            </form>
          </div>
        )}
      </div>
    </Modal>
  );
}
