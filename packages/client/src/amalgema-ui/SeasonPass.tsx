/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from "react";

import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { DateTime, Duration } from "luxon";
import { twMerge } from "tailwind-merge";
import { Hex, formatEther } from "viem";

import { STARTER_PACK_PRICE } from "../constants";
import { useAmalgema } from "../hooks/useAmalgema";

import { PromiseButton } from "./hooks/PromiseButton";
import { useMainWalletBalance, useGoldBalance } from "./hooks/useBalance";
import { useSeasonPassPrice } from "./hooks/useSeasonPassPrice";
import { Modal } from "./Modal";
import { SeasonPassImg } from "./SeasonPassImg";
import { Button } from "./Theme/SkyStrife/Button";
import { Caption, Heading } from "./Theme/SkyStrife/Typography";

export function SeasonPass({ account }: { account?: Hex }) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const timeUntilMintCutoff = Duration.fromObject({
    seconds: secondsUntilMintCutoff,
  });
  const timeUntilSeasonEnds = Duration.fromObject({
    seconds: secondsUntilSeasonEnds,
  });

  const mainWalletBalance = useMainWalletBalance();
  const goldBalance = useGoldBalance();

  const price = STARTER_PACK_PRICE; // useSeasonPassPrice(BigInt(Math.floor(now)));
  const { nativeCurrency } = publicClient.chain;

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
            Sale ends in:
          </Caption>
          <div className="text-ss-text-default text-[2rem] font-medium font-mono leading-8 uppercase">
            {timeUntilMintCutoff.toFormat("dd:hh:mm:ss")}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-3 self-stretch p-4">
        <div className="flex items-center gap-3 self-stretch">
          <SeasonPassImg className="w-[100px]" colored={false} />
          <div className="frame_530 flex flex-col items-start">
            <Heading className="text-ss-text-default">Starter Pack</Heading>
            <Caption className="text-ss-text-light">
              Buy a Starter Pack to get special in-game item!
            </Caption>
          </div>
        </div>
        <Modal
          isOpen={modalOpen}
          setOpen={setModalOpen}
          title={`Starter Pack`}
          trigger={
            <Button
              style={{
                transition: "all 0.1s ease-in-out",
                transform: enlarge ? "scale(1.2)" : "scale(1)",
              }}
              buttonType="primary"
              size="md"
              className="w-full"
              disabled={!account}
            >
              buy - {price.toLocaleString()} Gold
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
                    systemCall: "buyPack",
                    systemId: "Buy Pack",
                    args: [[], { account }],
                  });
                  if (tx) await waitForTransaction(tx);
                }}
                buttonType="secondary"
                size="md"
                className="w-full"
              >
                {canBuy
                  ? `buy - ${price.toLocaleString()} Gold`
                  : disabledMessage}
              </PromiseButton>
            </div>
          }
        >
          <div className="flex space-x-6">
            <div className="flex flex-col items-center justify-around border border-ss-stroke bg-white w-fit p-2 rounded-md">
              <SeasonPassImg className="w-[180px]" />
            </div>

            <div className="grow flex flex-col justify-between">
              <ul className="list-disc list-inside text-ss-text-light p-4">
                <li>Special Starter Pack for VoxelWorld.</li>
                <li>Special In-game Items</li>
                <ul className="pl-8 list-disc list-inside">
                  {/* <li>2 Wooden PickAxe</li> */}
                  <li>8 Stamina Potions</li>
                </ul>
                {/* <li>Extra Inventory</li> */}
              </ul>
            </div>
          </div>

          <div className="h-4" />

          <div className="flex w-full space-x-4">
            <div className="flex justify-between items-center px-3 py-2 bg-ss-bg-2 grow">
              <span className="text-ss-text-x-light">Price</span>
              <span className="font-mono">
                {STARTER_PACK_PRICE.toLocaleString()}
              </span>
            </div>
          </div>
        </Modal>

        {seasonPassSales.length > 0 && (
          <div className="w-full">
            <div className="h-2" />

            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SeasonPassImg className="w-[50px]" />
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
            Sale ends in:
          </Caption>
          <div className="text-ss-text-default text-[2rem] font-medium font-mono leading-8">
            {timeUntilSeasonEnds.toFormat("dd:hh:mm:ss")}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-3 self-stretch p-4">
        <div className="flex items-center gap-3 self-stretch">
          <SeasonPassImg className="w-[100px]" colored={false} />
          <div className="frame_530 flex flex-col items-start">
            <Heading className="text-ss-text-default">Season Pass</Heading>
            <Caption className="text-ss-text-light">
              Minting has ended. You are not a Season Pass holder this season.
            </Caption>
          </div>
        </div>
      </div>
    </div>
  );
}
