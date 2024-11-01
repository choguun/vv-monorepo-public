import { useCallback, useEffect, useState } from "react";

import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { DateTime, Duration } from "luxon";
import { Hex, formatEther } from "viem";

import { SEASON_NAME } from "../constants";
import { PIRATE_SKIN_PRICE } from "../constants";
import { useAmalgema } from "../hooks/useAmalgema";

import { PromiseButton } from "./hooks/PromiseButton";
import { useMainWalletBalance, useGoldBalance } from "./hooks/useBalance";
import { useSeasonPassExternalWallet } from "./hooks/useSeasonPass";
import { useSeasonPassPrice } from "./hooks/useSeasonPassPrice";
import { Modal } from "./Modal";
import { PirateSkinImg } from "./PirateSkinImg";
import { Button } from "./Theme/SkyStrife/Button";
import { Body, Caption, Heading } from "./Theme/SkyStrife/Typography";
import WarningSection from "./Theme/SkyStrife/WarningSection";

export function CharacterSkinSale({ account }: { account?: Hex }) {
  const {
    network: { publicClient, waitForTransaction },
    components: {
      SeasonPassConfig,
      SeasonPassLastSaleAt,
      SeasonTimes,
      SeasonPassSale,
    },
    executeSystemWithExternalWallet,
  } = useAmalgema() as any;

  const [now, setNow] = useState(DateTime.now().toSeconds());
  const [modalOpen, setModalOpen] = useState(false);

  const seasonPassSaleEntities = useEntityQuery([Has(SeasonPassSale)]);
  const seasonPassSales = seasonPassSaleEntities
    .map((entity) => getComponentValue(SeasonPassSale, entity))
    .filter((sale) => Boolean(sale))
    .sort((a, b) => Number(b?.purchasedAt) - Number(a?.purchasedAt));
  const mostRecentSale = seasonPassSales[0];

  const [enlarge, setEnlarge] = useState(false);
  useEffect(() => {
    const sub = SeasonPassLastSaleAt.update$.subscribe(() => {
      setEnlarge(true);
      setTimeout(() => {
        setEnlarge(false);
      }, 100);
    });
    return () => sub.unsubscribe();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(DateTime.now().toSeconds());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const seasonPassConfig = useComponentValue(SeasonPassConfig, singletonEntity);
  const mintCutoff = Number(seasonPassConfig?.mintCutoff ?? 0n);
  const secondsUntilMintCutoff = mintCutoff - now;

  const seasonTimes = useComponentValue(SeasonTimes, singletonEntity);
  const secondsUntilSeasonEnds = Number(seasonTimes?.seasonEnd ?? 0n) - now;
  const timeUntilMintCutoff = Duration.fromObject({ days: 15 }); // Duration.fromObject({ seconds: secondsUntilMintCutoff });
  const timeUntilSeasonEnds = Duration.fromObject({
    seconds: secondsUntilSeasonEnds,
  });

  const mainWalletBalance = useMainWalletBalance();
  const goldBalance = useGoldBalance();

  const seasonStart = DateTime.fromSeconds(
    Number(seasonTimes?.seasonStart ?? 0n)
  );
  const seasonEnd = DateTime.fromSeconds(Number(seasonTimes?.seasonEnd ?? 0n));

  const hasSeasonPass = useSeasonPassExternalWallet();
  const price = useSeasonPassPrice(BigInt(Math.floor(now)));
  const { nativeCurrency } = publicClient.chain;

  // const canBuy = mainWalletBalance?.value && mainWalletBalance.value >= price;
  const canBuy = goldBalance >= price;

  let disabledMessage = "";
  if (!canBuy) disabledMessage = "not enough gold. Please buy gold.";

  const formatEthPrice = useCallback(
    (price: bigint) => {
      return `${parseFloat(formatEther(price)).toFixed(3)} ${
        nativeCurrency.symbol
      }`;
    },
    [nativeCurrency.symbol]
  );

  return secondsUntilMintCutoff > 0 ? (
    <div className="flex flex-col items-start self-stretch rounded-sm border border-ss-stroke bg-ss-bg-0">
      <div className="flex flex-col justify-center items-center self-stretch py-3 px-4 border-b border-ss-stroke">
        <div className="flex flex-col justify-center items-center">
          <Caption className="text-ss-text-x-light leading-6">
            Sale start in:
          </Caption>
          <div className="text-ss-text-default text-[2rem] font-medium font-mono leading-8 uppercase">
            {timeUntilMintCutoff.toFormat("dd:hh:mm:ss")}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-3 self-stretch p-4">
        {hasSeasonPass ? (
          <div className="flex items-center gap-3 self-stretch">
            <PirateSkinImg className="w-[100px]" />
            <div className="frame_530 flex flex-col items-start">
              <Heading className="text-ss-text-default">Pirate Skin</Heading>
              <Caption className="text-ss-text-light">
                You have the Starter Pack for this Season!
              </Caption>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 self-stretch">
            <PirateSkinImg className="w-[100px]" colored={false} />
            <div className="frame_530 flex flex-col items-start">
              <Heading className="text-ss-text-default">Pirate Skin</Heading>
              <Caption className="text-ss-text-light">
                Buy Pirate Premium Skin!
              </Caption>
            </div>
          </div>
        )}

        {!hasSeasonPass ? (
          <Modal
            isOpen={modalOpen}
            setOpen={setModalOpen}
            title={`Pirate Skin`}
            trigger={
              <Button
                style={{
                  transition: "all 0.1s ease-in-out",
                  transform: enlarge ? "scale(1.2)" : "scale(1)",
                }}
                buttonType="primary"
                size="md"
                className="w-full"
                disabled={true}
                // disabled={!account}
              >
                buy - {PIRATE_SKIN_PRICE.toLocaleString()} Gold
              </Button>
            }
            footer={
              <div className="flex space-x-4 w-full">
                <Button
                  onClick={() => setModalOpen(false)}
                  buttonType="tertiary"
                  className="w-full"
                >
                  cancel
                </Button>
                <PromiseButton
                  disabled={!canBuy}
                  promise={async () => {
                    if (!account) return;

                    const tx = await executeSystemWithExternalWallet({
                      systemCall: "buySeasonPass",
                      systemId: "Buy Season Pass",
                      args: [[account as Hex], { account, value: price }],
                    });
                    if (tx) await waitForTransaction(tx);
                  }}
                  buttonType="secondary"
                  size="md"
                  className="w-full"
                >
                  {canBuy ? `buy - ${formatEthPrice(price)}` : disabledMessage}
                </PromiseButton>
              </div>
            }
          >
            <div className="flex space-x-6">
              <div className="flex flex-col items-center justify-around border border-ss-stroke bg-white w-fit p-2 rounded-md">
                <PirateSkinImg className="w-[180px]" />
              </div>

              <div className="grow flex flex-col justify-between">
                <div className="flex justify-between items-center px-3 py-2 bg-ss-bg-2">
                  <span className="text-ss-text-x-light">Season Starts</span>
                  <span>{seasonStart.toFormat("LLL dd")}</span>
                </div>

                <div className="flex justify-between items-center px-3 py-2 bg-ss-bg-2">
                  <span className="text-ss-text-x-light">Minting Ends</span>
                  <span>
                    {DateTime.fromSeconds(mintCutoff).toFormat("LLL dd")}
                  </span>
                </div>

                <div className="flex justify-between items-center px-3 py-2 bg-ss-bg-2">
                  <span className="text-ss-text-x-light">Season Ends</span>
                  <span>{seasonEnd.toFormat("LLL dd")}</span>
                </div>
              </div>
            </div>

            <div className="h-8" />

            <WarningSection>
              The Season Pass is soulbound (non-transferable) and can only be
              minted once per account. Any offers to buy or sell VoxelWorld
              Season Passes are fraudulent.
            </WarningSection>

            <div className="h-4" />

            <Body className="text-ss-text-default">
              The <span className="font-bold">VoxelWorld Season Pass</span>, for{" "}
              {SEASON_NAME}, gives you access to exclusive perks and features:
            </Body>

            <ul className="list-disc list-inside text-ss-text-light p-4">
              <li>
                Access to exclusive free matches summoned from the Sky Pool.
              </li>
              <li>Unlock additional features for creating matches.</li>
              <ul className="pl-8 list-disc list-inside">
                {/* <li>
                  Create private matches with a custom access list{" "}
                  <strong>
                    (limited to {privateMatchLimit.toString()} private matches
                    per Pass)
                  </strong>
                </li> */}
                <li>Set entrance fees and custom rewards.</li>
              </ul>
              <li>Exclusive maps from the current season.</li>
              <li>Access to all in-game Heroes.</li>
            </ul>

            <div className="h-4" />

            <div className="flex w-full space-x-4">
              <div className="flex justify-between items-center px-3 py-2 bg-ss-bg-2 grow">
                <span className="text-ss-text-x-light">Price</span>
                <span className="font-mono">
                  {PIRATE_SKIN_PRICE.toLocaleString()} Gold
                </span>
              </div>
            </div>
          </Modal>
        ) : (
          <></>
        )}

        {seasonPassSales.length > 0 && (
          <div className="w-full">
            <div className="h-2" />

            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PirateSkinImg className="w-[50px]" />
                  <div className="flex flex-col items-start">
                    <Caption className="text-ss-text-light font-bold font-mono">
                      Last Purchased:
                    </Caption>
                    <Caption className="text-ss-text-light font-mono">
                      {DateTime.fromSeconds(
                        Number(mostRecentSale?.purchasedAt ?? 0n)
                      ).toRelative()}
                    </Caption>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-start self-stretch rounded-sm border border-ss-stroke bg-ss-bg-0">
      <div className="flex flex-col justify-center items-center self-stretch py-3 px-4 border-b border-ss-stroke">
        <div className="flex flex-col justify-center items-center">
          <Caption className="text-ss-text-x-light leading-6">
            {SEASON_NAME} ends in:
          </Caption>
          <div className="text-ss-text-default text-[2rem] font-medium font-mono leading-8">
            {timeUntilSeasonEnds.toFormat("dd:hh:mm:ss")}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-3 self-stretch p-4">
        {hasSeasonPass ? (
          <div className="flex items-center gap-3 self-stretch">
            <PirateSkinImg className="w-[100px]" />
            <div className="frame_530 flex flex-col items-start">
              <Heading className="text-ss-text-default">Season Pass</Heading>
              <Caption className="text-ss-text-light">
                Minting has ended. You are a Season Pass holder this season!
              </Caption>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 self-stretch">
            <PirateSkinImg className="w-[100px]" colored={false} />
            <div className="frame_530 flex flex-col items-start">
              <Heading className="text-ss-text-default">Season Pass</Heading>
              <Caption className="text-ss-text-light">
                Minting has ended. You are not a Season Pass holder this season.
              </Caption>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
