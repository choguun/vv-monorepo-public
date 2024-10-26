import { useEntityQuery, useComponentValue } from "@latticexyz/react";
import { Entity, Has, getComponentValue } from "@latticexyz/recs";

import { useAmalgema } from "../../hooks/useAmalgema";
import { useExternalAccount } from "../../hooks/useExternalAccount";
import { addressToEntityID } from "../../mud/setupNetwork";
import { Modal } from "../Modal";

interface LeaderBoardModalProps {
  setOpen: (open: boolean) => void;
  isOpen: boolean;
}

export function LeaderBoardModal({ setOpen, isOpen }: LeaderBoardModalProps) {
  const {
    components: { PlayerPointS1, Name },
  } = useAmalgema() as any; // Temporary type assertion to bypass TypeScript error

  const leaderboardList = useEntityQuery([Has(PlayerPointS1)]);

  // now you can map these to their name as an example
  const playerPointList = leaderboardList.map((pointEntity) =>
    getComponentValue(PlayerPointS1, pointEntity)
  );
  const playerNameList = leaderboardList.map((nameEntity) =>
    getComponentValue(Name, nameEntity)
  );

  const combinedArray = playerPointList.map((score: any, index: any) => {
    return {
      score: score.value,
      username: playerNameList[index]?.value,
    };
  });

  combinedArray.sort((a, b) => Number(b.score) - Number(a.score));

  // const xxx = [...runQuery([Has(PlayerPointS1)])];

  let { address } = useExternalAccount();
  if (typeof address === "undefined") {
    address = "0x0000000000000000000000000000000000000000";
  }
  const playerPointS1 = useComponentValue(
    PlayerPointS1,
    address ? addressToEntityID(address) : ("0" as Entity)
  )?.value;

  const name = useComponentValue(Name, addressToEntityID(address));

  const rank =
    combinedArray.findIndex(
      (entry: any) => Number(entry.score) <= Number(playerPointS1)
    ) + 1;

  return (
    <Modal
      isOpen={isOpen}
      setOpen={setOpen}
      footer={
        <>
          <div className="w-full border-2 border-black py-2 px-4 rounded-md">
            <span>
              Your Rank #{rank}: {name?.value}
            </span>
            <span className="float-right">
              {Number(playerPointS1).toLocaleString()} Point
            </span>
          </div>
        </>
      }
      title="LeaderBoard"
    >
      <div>
        {combinedArray.length < 10
          ? [
              ...combinedArray,
              ...Array(10 - combinedArray.length).fill(""),
            ].map((item, index) => (
              <div
                className="w-full border-2 border-black border-solid py-2 px-4 rounded-md mb-2"
                key={index}
              >
                <span>
                  #{index + 1}. {item.username}
                </span>
                <span className="float-right">
                  {Number(item.score || 0).toLocaleString()} Point
                </span>
              </div>
            ))
          : combinedArray.map((item, index) => (
              <div
                className="w-full border-2 border-black border-solid py-2 px-4 rounded-md mb-2"
                key={index}
              >
                <span>
                  #{index + 1}. {item.username}
                </span>
                <span className="float-right">
                  {Number(item.score).toLocaleString()} Point
                </span>
              </div>
            ))}
      </div>
    </Modal>
  );
}
