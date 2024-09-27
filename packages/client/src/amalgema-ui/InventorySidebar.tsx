/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DISCORD_URL,
  FEEDBACK_URL,
  HOW_TO_PLAY_URL,
  TWITTER_URL,
} from "../links";
import { addressToEntityID } from "../mud/setupNetwork";

import { CharacterSkinSale } from "./CharacterSkinSale";
import { LabeledOrbInput } from "./common";
import { CurrentProfile } from "./CurrentProfile";
import { useBurnerBalance } from "./hooks/useBalance";
import { useExternalAccount } from "./hooks/useExternalAccount";
import { SeasonPass } from "./SeasonPass";
import { SessionWalletManager } from "./SessionWalletManager";
import { Button } from "./Theme/SkyStrife/Button";
import { IconButton } from "./Theme/SkyStrife/IconButton";
import { Discord } from "./Theme/SkyStrife/Icons/Discord";
import { Tutorial } from "./Theme/SkyStrife/Icons/Tutorial";
import { Twitter } from "./Theme/SkyStrife/Icons/Twitter";
import { Link } from "./Theme/SkyStrife/Typography";

const DECIMALS = 18;

export function InventorySidebar() {
  const { address } = useExternalAccount();

  const burnerBalance = useBurnerBalance();

  return (
    <div className="flex flex-col bg-ss-bg-1 border-l border-ss-stroke h-screen overflow-y-auto p-8 pt-4 items-stretch w-[420px] shrink-0">
      <CurrentProfile />

      <div className="h-4 shrink-0"></div>

      <SeasonPass account={address} />

      <div className="h-3 mt-2" />
      <CharacterSkinSale account={address} />

      {address && (
        <>
          {/* {import.meta.env.DEV && hasSkyKey && (
            <>
              <div className="h-8 shrink-0" />
              <div className="text-red-600 font-bold text-2xl text-center">
                <p>YOU ARE LOGGED IN WITH THE SKYKEY WALLET.</p>
                <p>You are able to create matches without using 🔮</p>
              </div>
            </>
          )} */}

          {burnerBalance?.danger && (
            <>
              <div className="h-8 shrink-0" />
              <SessionWalletManager />
            </>
          )}
        </>
      )}

      <div className="h-8 shrink-0" />

      {/* <Resources /> */}

      <div className="h-1 shrink-0" />

      {/* <LabeledOrbInput amount={MATCH_COST} label="Match Creation Cost" /> */}

      <div className="h-1 shrink-0" />

      {/* <LabeledOrbInput amount={matchReward} label="Current Match Reward" /> */}

      <div className="h-1 shrink-0" />

      <div className="h-[100%]" />

      <div className="h-1 shrink-0" />

      <div className="flex h-fit">
        {/* <a
          href={FEEDBACK_URL}
          className="grow"
          target="_blank"
          rel="noreferrer"
        >
          <Button
            style={{
              fontSize: "12px",
            }}
            className="w-full text-sm"
            buttonType="tertiary"
          >
            Feedback
          </Button>
        </a> */}

        <div className="w-8" />

        <a href={DISCORD_URL} target="_blank" rel="noreferrer">
          <IconButton>
            <Discord />
          </IconButton>
        </a>

        <div className="w-2" />

        <a href={TWITTER_URL} target="_blank" rel="noreferrer">
          <IconButton>
            <Twitter />
          </IconButton>
        </a>

        <div className="w-2" />

        <a href={HOW_TO_PLAY_URL} target="_blank" rel="noreferrer">
          <IconButton>
            <Tutorial />
          </IconButton>
        </a>
      </div>

      <div className="h-12" />

      <div className="flex gap-x-3 items-center mx-auto">
        {/* <Link className="uppercase text-ss-text-x-light underline" href={"/privacy-policy"}>
          privacy policy
        </Link>

        <div className="w-6 text-center text-ss-text-x-light">|</div>

        <Link className="uppercase text-ss-text-x-light underline" href={"/terms.pdf"}>
          terms of service
        </Link> */}
      </div>
    </div>
  );
}
