import { useComponentValue } from "@latticexyz/react";
import { Entity } from "@latticexyz/recs";
import { singletonEntity } from "@latticexyz/store-sync/recs";

import { useAmalgema } from "../../hooks/useAmalgema";
import { addressToEntityID } from "../../mud/setupNetwork";
import { useExternalAccount } from "../hooks/useExternalAccount";
import { Modal } from "../Modal";
import { Button } from "../Theme/SkyStrife/Button";

interface QuestModalProps {
  setOpen: (open: boolean) => void;
  isOpen: boolean;
}

enum QuestTypes {
  DAILY_CHECK_IN = 0,
  DAILY_LOG_IN = 1,
  GATHER_RESOURCE = 2,
  COMMON_RESOURCE = 3,
  RARE_RESOURCE = 4,
  MYSTICAL_RESOURCE = 5,
  ARTIFACT_RESOURCE = 6,
  GOD_RESOURCE = 7,
}

export function QuestModal({ setOpen, isOpen }: QuestModalProps) {
  const {
    network: {
      components: { WorldQuestS1, PlayerQuestS1, PlayerQuestFinishedS1 },
    },
    executeSystemWithExternalWallet,
  } = useAmalgema();

  const worldQuestS1 = useComponentValue(WorldQuestS1, singletonEntity);
  let { address } = useExternalAccount();
  if (typeof address === "undefined") {
    address = "0x0000000000000000000000000000000000000000";
  }
  const playerQuestS1 = useComponentValue(
    PlayerQuestS1,
    address ? addressToEntityID(address) : ("0" as Entity)
  );
  const playerQuestFinishedS1 = useComponentValue(
    PlayerQuestFinishedS1,
    address ? addressToEntityID(address) : ("0" as Entity)
  );
  // console.log(playerQuestFinishedS1);

  const handleClaim = async (type: QuestTypes) => {
    // console.log("handleClaim");
    await executeSystemWithExternalWallet({
      systemCall: "confirmFinishedQuest",
      systemId: "Clear Quest",
      args: [[type], { account: address }],
    });
  };

  return (
    <Modal isOpen={isOpen} setOpen={setOpen} title="quests">
      <div className="mb-5">
        <div className="px-10 py-4 border-2 border-black border-solid rounded-md inline-block w-full">
          <span className="text-xl">
            Daily Check-in {playerQuestS1?.checkin}/{worldQuestS1?.checkin}
          </span>
          <div className="float-right">
            <span className="text-xl font-black mr-5 text-green-700">
              500 Points
            </span>
            <Button
              buttonType="secondary"
              disabled={
                playerQuestS1?.checkin < worldQuestS1?.checkin ||
                playerQuestFinishedS1?.checkin
              }
              onClick={() => handleClaim(QuestTypes.DAILY_CHECK_IN)}
            >
              {playerQuestFinishedS1?.checkin ? "CLAIMED" : "CLAIM"}
            </Button>
          </div>
        </div>
        <div className="px-10 py-4 border-2 border-black border-solid rounded-md inline-block w-full mt-2">
          <span className="text-xl">
            Daily Log-in {playerQuestS1?.login}/{worldQuestS1?.login}
          </span>
          <div className="float-right">
            <span className="text-xl font-black mr-5 text-green-700">
              500 Points
            </span>
            <Button
              buttonType="secondary"
              className="float-right"
              disabled={playerQuestS1?.login < worldQuestS1?.login}
              onClick={() => handleClaim(QuestTypes.DAILY_LOG_IN)}
            >
              CLAIM
            </Button>
          </div>
        </div>
        {/* <div className="px-10 py-4 border-2 border-black rounded-md inline-block w-full mt-2">
            <span className="text-xl mt-2">Grathering Resource</span>
            <Button buttonType="secondary" className="float-right">CLAIM</Button>
          </div> */}
        <div className="px-10 py-4 border-2 border-black border-solid rounded-md inline-block w-full mt-2">
          <span className="text-xl">
            Gather Resource {playerQuestS1?.gather}/{worldQuestS1?.gather}
          </span>
          <div className="float-right">
            <span className="text-xl font-black mr-5 text-green-700">
              1,000 Points
            </span>
            <Button
              buttonType="secondary"
              className="float-right"
              disabled={playerQuestS1?.gather < worldQuestS1?.gather}
              onClick={() => handleClaim(QuestTypes.GATHER_RESOURCE)}
            >
              CLAIM
            </Button>
          </div>
        </div>
        <div className="px-10 py-4 border-2 border-black border-solid rounded-md inline-block w-full mt-2">
          <span className="text-xl">
            Find Common Treasure {playerQuestS1?.common}/{worldQuestS1?.common}
          </span>
          <div className="float-right">
            <span className="text-xl font-black mr-5 text-green-700">
              1,000 Points
            </span>
            <Button
              buttonType="secondary"
              className="float-right"
              disabled={playerQuestS1?.common < worldQuestS1?.common}
              onClick={() => handleClaim(QuestTypes.COMMON_RESOURCE)}
            >
              CLAIM
            </Button>
          </div>
        </div>
        <div className="px-10 py-4 border-2 border-black border-solid rounded-md inline-block w-full mt-2">
          <span className="text-xl">
            Find Elite Treasure {playerQuestS1?.rare}/{worldQuestS1?.rare}
          </span>
          <div className="float-right">
            <span className="text-xl font-black mr-5 text-green-700">
              1,500 Points
            </span>
            <Button
              buttonType="secondary"
              className="float-right"
              disabled={playerQuestS1?.rare < worldQuestS1?.rare}
              onClick={() => handleClaim(QuestTypes.RARE_RESOURCE)}
            >
              CLAIM
            </Button>
          </div>
        </div>
        <div className="px-10 py-4 border-2 border-black border-solid rounded-md inline-block w-full mt-2">
          <span className="text-xl">
            Find Epic Treasure {playerQuestS1?.mystical}/
            {worldQuestS1?.mystical}
          </span>
          <div className="float-right">
            <span className="text-xl font-black mr-5 text-green-700">
              2,000 Points
            </span>
            <Button
              buttonType="secondary"
              className="float-right"
              disabled={playerQuestS1?.mystical < worldQuestS1?.mystical}
              onClick={() => handleClaim(QuestTypes.MYSTICAL_RESOURCE)}
            >
              CLAIM
            </Button>
          </div>
        </div>
        <div className="px-10 py-4 border-2 border-black border-solid rounded-md inline-block w-full mt-2">
          <span className="text-xl">
            Find Legendary Treasure {playerQuestS1?.artifact}/
            {worldQuestS1?.artifact}
          </span>
          <div className="float-right">
            <span className="text-xl font-black mr-5 text-green-700">
              5,000 Points
            </span>
            <Button
              buttonType="secondary"
              className="float-right"
              disabled={playerQuestS1?.artifact < worldQuestS1?.artifact}
              onClick={() => handleClaim(QuestTypes.ARTIFACT_RESOURCE)}
            >
              CLAIM
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
