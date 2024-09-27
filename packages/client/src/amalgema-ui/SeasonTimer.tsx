import { useComponentValue } from "@latticexyz/react";
import { singletonEntity } from "@latticexyz/store-sync/recs";

import { useAmalgema } from "../hooks/useAmalgema";

export function SeasonTimer() {
  const {
    network: {
      components: { SeasonConfig },
    },
  } = useAmalgema();

  const seasonConfig = useComponentValue(SeasonConfig, singletonEntity);
  // console.log(seasonConfig);
  const date = new Date(Number(seasonConfig?.end));
  // console.log(date);
  return (
    <div className="float-right">
      <span className="text-2xl ml-10">SEASON: {seasonConfig?.season}</span>
      <span className="text-2xl ml-3">END IN: 30 Days</span>
    </div>
  );
}
