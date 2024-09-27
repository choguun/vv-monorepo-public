/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useEffect, useState } from "react";

import { Header } from "./Header";
import { useStore } from "../hooks/useStore";
import { Button } from "./Theme/SkyStrife/Button";

import { CharacterModal } from "./CharacterModal";
import { CharacterPlayerSection } from "./CharacterPlayerSection";
// import GDPR from "./GDPR";
import { InventorySidebar } from "./InventorySidebar";
import { Layer } from "./Layer";
import { LeaderBoardModal } from "./LeaderBoardModal";
// import { ComponentBrowser } from "./Admin/ComponentBrowser";

import { PlayerPointSection } from "./PlayerPointSection";
import { QuestModal } from "./QuestModal";
import { SeasonTimer } from "./SeasonTimer";
import { SyncStatus } from "./SyncStatus";
import { TopRight } from "./TopRight";
import { Transactions } from "./Transactions";
import { WelcomeToSkyStrifeModal } from "./WelcomeModal/WelcomeToSkyStrifeModal";
import { WorldResourceSection } from "./WorldResourceSection";

export const UIRoot = () => {
  const [openCharacterModal, setOpenCharacterModal] = useState(false);
  const [openLeaderBoardModal, setOpenLeaderBoardModal] = useState(false);
  const [openQuestModal, setOpenQuestModal] = useState(false);

  const layers = useStore((state) => {
    return {
      networkLayer: state.networkLayer,
    };
  });

  if (!layers.networkLayer) return <></>;

  return (
    <div className="flex h-screen">
      <div className="h-screen flex flex-col grow">
        <Header />
        <div
          style={{
            background:
              "linear-gradient(152deg, rgba(244, 243, 241, 0.98) 0%, rgba(244, 243, 241, 0.88) 100%), lightgray -381.491px 0.145px / 126.42% 100% no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "right",
            zIndex: -2,
          }}
          className="fixed top-0 left-0 h-screen w-screen bg-cover"
        />
        <div className="grow px-8 py-6 flex flex-col">
          <div className="h-6" />
          <div>
            <PlayerPointSection />
            <Button
              buttonType="primary"
              className="ml-3"
              onClick={() => setOpenQuestModal(true)}
            >
              Quests
            </Button>
            <Button
              buttonType="primary"
              className="ml-3"
              onClick={() => setOpenLeaderBoardModal(true)}
            >
              LeaderBoard
            </Button>
            <SeasonTimer />
          </div>
          <WorldResourceSection />
          <CharacterPlayerSection
            setOpenCharacterModal={setOpenCharacterModal}
          />
          {/* <MatchTable /> */}
        </div>
      </div>
      <InventorySidebar />
      <Transactions />
      <WelcomeToSkyStrifeModal />
      {/* <GDPR /> */}
      <CharacterModal
        setOpen={setOpenCharacterModal}
        isOpen={openCharacterModal}
      />
      <LeaderBoardModal
        setOpen={setOpenLeaderBoardModal}
        isOpen={openLeaderBoardModal}
      />
      <QuestModal setOpen={setOpenQuestModal} isOpen={openQuestModal} />
    </div>
  );
};
