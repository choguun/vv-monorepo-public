import { useComponentValue } from "@latticexyz/react";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { Tooltip } from "react-tooltip";

import { useAmalgema } from "../hooks/useAmalgema";

export function WorldResourceSection() {
  const {
    network: {
      components: { WorldResourceS1 },
    },
  } = useAmalgema() as any;

  const worldResourceS1 = useComponentValue(WorldResourceS1, singletonEntity);

  return (
    <div className="mt-5 mb-3 bg-orange-400 p-4 rounded-md">
      <div>
        <span className="text-xl font-black">World Treasures status:</span>
        <a
          data-tooltip-id="my-tooltip"
          data-tooltip-html="<b>Common Treasure Box:</b><br/>
              <p>A basic treasure box that can be easily found in the game world or awarded for simple quests.
              These boxes contain standard items, providing useful but non-special rewards.</p><br/>
              <b>Elite Treasure Box:</b><br/>
              <p>A step up from the common box, offering slightly better rewards with a chance for enhanced items.
              These boxes may be found in mid-tier dungeons or awarded for completing challenging quests.</p><br/>
              <b>Epic Treasure Box:</b><br/>
              <p>A highly sought-after treasure box that provides powerful and unique items.
              These are often found in difficult areas or as rewards for tough boss battles, making them rare and exciting to open.</p><br/>
              <b>Legendary Treasure Box:</b><br/>
              <p>A box of immense value and significance, containing legendary items steeped in the lore of the game.
              These boxes are extremely rare and require players to complete the most challenging raids, events, or quests to obtain.</p><br/>
              <b>Mythic Treasure Box:</b><br/>
              <p>The ultimate treasure box, containing god-like rewards.
              These are so rare they might be limited to special events, world-ending bosses, or one-time achievements.
              The contents of these boxes can reshape the course of gameplay for the lucky recipient.</p><br/>"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="25"
            height="25"
            viewBox="0 0 50 50"
          >
            <path d="M25,2C12.297,2,2,12.297,2,25s10.297,23,23,23s23-10.297,23-23S37.703,2,25,2z M25,11c1.657,0,3,1.343,3,3s-1.343,3-3,3 s-3-1.343-3-3S23.343,11,25,11z M29,38h-2h-4h-2v-2h2V23h-2v-2h2h4v2v13h2V38z"></path>
          </svg>
        </a>
        <Tooltip id="my-tooltip" />
      </div>
      <div>
        {/* <span className="text-xl mb-2">Remaining:</span>
         */}
        <br />
        <span className="text-xl">
          Mythic: {worldResourceS1?.god}/{worldResourceS1?.maxGod}{" "}
          <span className="ml-1">|</span>{" "}
        </span>
        <span className="ml-2 text-xl">
          Legendary: {worldResourceS1?.artifact}/{worldResourceS1?.maxArtifact}{" "}
          <span className="ml-1">|</span>
        </span>
        <span className="ml-2 text-xl">
          Epic: {worldResourceS1?.mystical}/{worldResourceS1?.maxMystical}{" "}
          <span className="ml-1">|</span>
        </span>
        <span className="ml-2 text-xl">
          Elite: {worldResourceS1?.rare}/{worldResourceS1?.maxRare}{" "}
          <span className="ml-1">|</span>
        </span>
        <span className="ml-2 text-xl">
          Common: {worldResourceS1?.common.toLocaleString()}/
          {worldResourceS1?.maxCommon.toLocaleString()}{" "}
        </span>
      </div>
    </div>
  );
}
