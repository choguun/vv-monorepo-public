/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useState, useEffect } from "react";

import { useComponentValue } from "@latticexyz/react";
import { Entity } from "@latticexyz/recs";
import { encodeSystemCallFrom } from "@latticexyz/world/internal";
import { ConnectButton } from "@particle-network/connectkit";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import IWorldAbi from "contracts/out/IWorld.sol/IWorld.abi.json";
import {
  Hex,
  encodeFunctionData,
  hexToString,
  maxUint256,
  padHex,
  formatEther,
  parseEther,
} from "viem";

import { TimeDelegationAbi, SystemDelegationAbi } from "../abis";
import { NATIVE_SYMBOL } from "../constants";
import {
  NAME_SYSTEM_ID,
  SEASON_PASS_ONLY_SYSTEM_ID,
  SYSTEMBOUND_DELEGATION,
  TIMEBOUND_DELEGATION,
} from "../constants";
import { useAmalgema } from "../hooks/useAmalgema";
import { addressToEntityID } from "../mud/setupNetwork";

import { ChooseUsernameForm } from "./ChooseUsernameForm";
import { EthInput } from "./common";
import { CustomConnectButton } from "./CustomConnectButton";
import { GoldShopModal } from "./GoldShopModal";
import { PromiseButton } from "./hooks/PromiseButton";
import { useBurnerBalance, useMainWalletBalance } from "./hooks/useBalance";
// import { useDrip } from "./hooks/useDrip";
import { useExternalAccount } from "./hooks/useExternalAccount";
import { Modal } from "./Modal";
import {
  SessionWalletModal,
  SessionWalletWarning,
} from "./SessionWalletManager";
import { Button } from "./Theme/SkyStrife/Button";
import { Heading, Caption } from "./Theme/SkyStrife/Typography";

export const formatAddress = (address: Hex) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;
const MIN_SESSION_WALLET_BALANCE = parseEther("0.000004");

const CopyInput = ({
  val,
  label,
  hidden,
}: {
  val: string;
  label: string;
  hidden?: boolean;
}) => {
  const [hideVal, setHideVal] = useState(hidden);
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full">
      <span
        style={{
          fontSize: "14px",
        }}
        className="text-ss-text-x-light uppercase"
      >
        {label}
      </span>
      <div className="relative flex bg-ss-bg-2 px-4 pr-[64px] py-2 border border-[#DDDAD0]">
        <input
          ref={ref}
          onMouseEnter={() => setHideVal(false)}
          onMouseLeave={() => setHideVal(true)}
          className={"w-full bg-ss-bg-2"}
          type={hidden && hideVal ? "password" : "text"}
          readOnly
          value={val}
        />

        <div
          onClick={async () => {
            if (ref.current) {
              ref.current.select();
              try {
                await navigator.clipboard.writeText(val);
              } catch (e) {
                console.error(e);
              }
            }
          }}
          className="absolute right-4 top-[8px] cursor-pointer text-[16px] uppercase text-ss-text-link hover:underline hover:text-[#8B5D29] active:translate-y-[2px]"
        >
          copy
        </div>
      </div>
    </div>
  );
};

const GenerateNewSessionWalletModal = () => {
  const {
    externalWalletClient,
    externalWorldContract,
    network: { walletClient, waitForTransaction },
    utils: { refreshBalance },
  } = useAmalgema();

  const burnerBalance = useBurnerBalance();
  const burnerWalletAddress = walletClient.account?.address;
  const mainWalletAddress = externalWalletClient?.account?.address;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      small
      isOpen={isOpen}
      setOpen={setIsOpen}
      title={"withdraw & generate new wallet"}
      trigger={
        <Button buttonType="danger" className="w-full">
          withdraw & generate new wallet
        </Button>
      }
      footer={
        <div className="w-full flex gap-x-3">
          <Button
            buttonType="tertiary"
            className="w-full"
            onClick={() => setIsOpen(false)}
          >
            i changed my mind
          </Button>
          <PromiseButton
            promise={async () => {
              if (
                !burnerWalletAddress ||
                !mainWalletAddress ||
                !externalWorldContract ||
                !externalWalletClient ||
                !externalWalletClient.account
              ) {
                throw new Error("No external wallet connected");
              }

              let value = burnerBalance.value ?? 0n;
              if (value > MIN_SESSION_WALLET_BALANCE) {
                value -= MIN_SESSION_WALLET_BALANCE;

                const tx = await walletClient.sendTransaction({
                  chain: walletClient.chain,
                  account: walletClient.account,
                  to: mainWalletAddress,
                  value,
                });
                await waitForTransaction(tx);
                refreshBalance(burnerWalletAddress);
              }

              const tx = await externalWorldContract.write.unregisterDelegation(
                [walletClient.account.address],
                {
                  account: externalWalletClient.account,
                }
              );
              await waitForTransaction(tx);

              localStorage.removeItem("mud:burnerWallet");
              window.location.reload();
            }}
            buttonType="danger"
            className="w-full"
          >
            generate new session wallet
          </PromiseButton>
        </div>
      }
    >
      <div>
        Are you sure you want to revoke access to your session wallet and
        withdraw all remaining {NATIVE_SYMBOL} (
        {formatEther(burnerBalance?.value ?? 0n)})? You will be granted a new
        session wallet that will need to be funded again.
        <br />
        <br />
        This action is irreversible and will trigger a page refresh.
        <div className="h-4" />
      </div>
    </Modal>
  );
};

const WithdrawFundsButton = () => {
  const {
    externalWalletClient,
    externalWorldContract,
    network: { walletClient, waitForTransaction },
    utils: { refreshBalance },
  } = useAmalgema();

  const burnerBalance = useBurnerBalance();
  const mainWalletAddress = externalWalletClient?.account?.address;
  const burnerWalletAddress = walletClient.account?.address;

  return (
    <PromiseButton
      buttonType="tertiary"
      className="w-full"
      disabled={(burnerBalance.value ?? 0n) <= MIN_SESSION_WALLET_BALANCE}
      promise={async () => {
        if (
          !burnerWalletAddress ||
          !mainWalletAddress ||
          !externalWorldContract ||
          !externalWalletClient ||
          !externalWalletClient.account
        ) {
          throw new Error("No external wallet connected");
        }

        let value = burnerBalance.value ?? 0n;
        if (value > MIN_SESSION_WALLET_BALANCE) {
          value -= MIN_SESSION_WALLET_BALANCE;

          const tx = await walletClient.sendTransaction({
            chain: walletClient.chain,
            account: walletClient.account,
            to: mainWalletAddress,
            value,
          });
          await waitForTransaction(tx);
          refreshBalance(burnerWalletAddress);
        }
      }}
    >
      withdraw all
    </PromiseButton>
  );
};

const SettingsModal = () => {
  const {
    externalWorldContract,
    externalWalletClient,
    network: {
      walletClient,
      worldContract,
      waitForTransaction,
      networkConfig: { privateKey },
    },
    utils: { refreshBalance, hasTimeDelegation },
  } = useAmalgema();
  const [isOpen, setIsOpen] = useState(false);
  const [alreadyDelegated, setAlreadyDelegated] = useState(false);
  const [delegateText, setDelegateText] = useState("Delegate");

  const burnerAddress =
    walletClient.account.address ??
    "0x0000000000000000000000000000000000000000";
  const burnerBalance = useBurnerBalance();

  // const { address } = useExternalAccount();
  const hasDelegation = hasTimeDelegation(
    externalWalletClient.account.address,
    walletClient.account.address
  );

  return (
    <Modal
      isOpen={isOpen}
      setOpen={setIsOpen}
      title="settings"
      trigger={<Button buttonType="tertiary">Settings</Button>}
    >
      <h3 className="text-ss-text-x-light uppercase">connection</h3>
      <div className="flex w-full">
        <div
          className="w-full cursor-pointer border border-black border-solid rounded-xl"
          onClick={() => setIsOpen(false)}
        >
          <CustomConnectButton />
          {/* <ConnectButton /> */}
        </div>
      </div>

      <div className="h-6" />

      <ChooseUsernameForm />

      <div className="h-6" />

      <div className="w-full border border-ss-stroke" />

      <div className="h-6" />

      <h3 className="text-ss-text-x-light uppercase">session wallet</h3>

      <div className="h-2" />

      <SessionWalletWarning />

      <div className="flex flex-col m-2">
        <PromiseButton
          buttonType="primary"
          disabled={hasDelegation || alreadyDelegated}
          promise={async () => {
            if (!externalWorldContract) return;
            if (!externalWalletClient || !externalWalletClient.account) return;

            const account = externalWalletClient.account;

            const result = await externalWorldContract.write.registerDelegation(
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
                account: account.address,
              }
            );
            setAlreadyDelegated(true);
            setDelegateText("Delegated");
            return result;
          }}
        >
          {delegateText}
        </PromiseButton>
      </div>

      <div className="h-6" />

      <div className="flex gap-x-6">
        <CopyInput val={burnerAddress} label="Address" />
        <CopyInput val={privateKey} label="Private Key" hidden />
      </div>

      <div className="h-4" />

      <EthInput
        amount={burnerBalance.value ? burnerBalance.value : 0n}
        className="pr-2"
        label="Session Wallet Balance"
      />

      <div className="h-4" />

      <div className="flex w-full gap-x-3">
        <div className="grow">
          <SessionWalletModal />
        </div>
        <div className="grow">
          <WithdrawFundsButton />
        </div>
      </div>

      <div className="h-4" />

      <GenerateNewSessionWalletModal />

      <div className="h-8" />
    </Modal>
  );
};

function Profile({ address }: { address: Hex }) {
  const {
    network: {
      components: { Name, GameToken },
    },
  } = useAmalgema();

  const [gameToken, setgameToken] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const name = useComponentValue(Name, addressToEntityID(address));
  const _gameToken =
    useComponentValue(
      GameToken,
      address ? addressToEntityID(address) : ("0" as Entity)
    )?.amount ?? 0;

  const balance = useMainWalletBalance();

  useEffect(() => {
    if (Number(_gameToken) > 0) setgameToken(Number(_gameToken));
  }, [_gameToken]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <Heading className="text-lg">
            {name ? name.value : formatAddress(address)}
          </Heading>
          <Caption className="text-sm text-ss-text-x-light">
            Balance:{" "}
            {balance.value
              ? parseFloat(formatEther(balance.value)).toFixed(6)
              : 0}{" "}
            {NATIVE_SYMBOL}
            <br />
            <span className="text-orange-500 font-bold text-md">
              Gold: {gameToken.toLocaleString()}
            </span>
            <button
              onClick={() => setOpenModal(true)}
              className="ml-3 p-2 bg-amber-400 cursor-pointer rounded-sm"
            >
              BUY Gold
            </button>
          </Caption>
        </div>

        <SettingsModal />
      </div>
      <GoldShopModal open={openModal} setOpen={setOpenModal} />
    </div>
  );
}

function SkyStrifeConnectButton() {
  const { openConnectModal } = useConnectModal();

  return (
    <Button
      buttonType="secondary"
      className="h-fit w-full"
      onClick={openConnectModal}
    >
      connect wallet
    </Button>
  );
}

export function CurrentProfile() {
  const { address: externalAddress } = useExternalAccount();

  // useDrip();

  return externalAddress ? (
    <Profile address={externalAddress} />
  ) : (
    <SkyStrifeConnectButton />
  );
}
