import { useComponentValue } from "@latticexyz/react";
import { singletonEntity } from "@latticexyz/store-sync/recs";

import { useAmalgema } from "../hooks/useAmalgema";

export function WorldResourceSection() {
  const {
    network: {
      components: { WorldResourceS1 },
    },
  } = useAmalgema() as any;

  const worldResourceS1 = useComponentValue(WorldResourceS1, singletonEntity);

  return (
    <div className="mt-5 bg-orange-400 p-4 rounded-md">
      <div>
        <span className="text-xl font-black">World Treasures status:</span>
      </div>
      <div>
        {/* <span className="text-xl mb-2">Remaining:</span>
         */}
        <br />
        <span className="text-xl">
          God: {worldResourceS1?.god}/{worldResourceS1?.maxGod}{" "}
          <span className="ml-1">|</span>{" "}
        </span>
        <span className="ml-2 text-xl">
          Artifact: {worldResourceS1?.artifact}/{worldResourceS1?.maxArtifact}{" "}
          <span className="ml-1">|</span>
        </span>
        <span className="ml-2 text-xl">
          Mystical: {worldResourceS1?.mystical}/{worldResourceS1?.maxMystical}{" "}
          <span className="ml-1">|</span>
        </span>
        <span className="ml-2 text-xl">
          Rare: {worldResourceS1?.rare}/{worldResourceS1?.maxRare}{" "}
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
