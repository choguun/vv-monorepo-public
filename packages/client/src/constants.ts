import { resourceToHex } from "@latticexyz/common";
import { stringToHex } from "viem";

import type { KnownWorldName } from "./types";

export enum Direction {
  Top,
  Right,
  Bottom,
  Left,
}

export const Directions = {
  [Direction.Top]: { x: 0, y: -1 },
  [Direction.Right]: { x: 1, y: 0 },
  [Direction.Bottom]: { x: 0, y: 1 },
  [Direction.Left]: { x: -1, y: 0 },
};
export const BYTES32_ZERO =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
export const SPAWN_SETTLEMENT = stringToHex("SpawnSettlement", { size: 32 });
export const EMOJI = "🔮";

export const LOCK_CLIENT = false;

export const SEASON_NAME = "Season 1";

export const UNLIMITED_DELEGATION = resourceToHex({
  type: "system",
  namespace: "",
  name: "unlimited",
});
export const SYSTEMBOUND_DELEGATION = resourceToHex({
  type: "system",
  namespace: "",
  name: "systembound",
});
export const TIMEBOUND_DELEGATION = resourceToHex({
  type: "system",
  namespace: "",
  name: "timebound",
});

export const WORLD_REGISTRATION_SYSTEM_ID = resourceToHex({
  type: "system",
  namespace: "",
  name: "Registration",
});
export const PLAYER_REGISTER_SYSTEM_ID = resourceToHex({
  type: "system",
  namespace: "",
  name: "PlayerRegisterSystem",
});
export const ALLOW_LIST_SYSTEM_ID = resourceToHex({
  type: "system",
  namespace: "",
  name: "AllowListSystem",
});
export const SEASON_PASS_ONLY_SYSTEM_ID = resourceToHex({
  type: "system",
  namespace: "MatchAccess",
  name: "SeasonPassOnly",
});
export const NAME_SYSTEM_ID = resourceToHex({
  type: "system",
  namespace: "",
  name: "NameSystem",
});
export const LOBBY_SYSTEM_ID = resourceToHex({
  type: "system",
  namespace: "",
  name: "LobbySystem",
});
export const PLAYER_DEREGISTER_SYSTEM_ID = resourceToHex({
  type: "system",
  namespace: "",
  name: "PlayerDeregister",
});
export const MATCH_SYSTEM_ID = resourceToHex({
  type: "system",
  namespace: "",
  name: "MatchSystem",
});
export const QUEST_SYSTEM_ID = resourceToHex({
  type: "system",
  namespace: "",
  name: "QuestSystem",
});
export const MINE_SYSTEM_ID = resourceToHex({
  type: "system",
  namespace: "",
  name: "MineSystem",
});
export const LOGIN_SYSTEM_ID = resourceToHex({
  type: "system",
  namespace: "",
  name: "LoginSystem",
});
export const CHARACTER_SYSTEM_ID = resourceToHex({
  type: "system",
  namespace: "",
  name: "CharacterSystem",
});
export const CANCEL_MATCH_SYSTEM_ID = resourceToHex({
  type: "system",
  namespace: "",
  name: "CancelMatchSyste",
});
export const LEVEL_UPLOAD_SYSTEM_ID = resourceToHex({
  type: "system",
  namespace: "",
  name: "LevelUploadSystem",
});
export const BUILD_SYSTEM_ID = resourceToHex({
  type: "system",
  namespace: "",
  name: "BuildSystem",
});
export const MOVE_SYSTEM_ID = resourceToHex({
  type: "system",
  namespace: "",
  name: "MoveSystem",
});
export const COPY_MAP_SYSTEM_ID = resourceToHex({
  type: "system",
  namespace: "",
  name: "CopyMapSystem",
});

/* -------------------------------------------------------------------------- */
/*                                    LINKS                                   */
/* -------------------------------------------------------------------------- */
export const youtubeLink = "";
export const githubLink = "";
export const linkedInLink = "";
export const twitterLink = "";
export const mailLink = "";
export const buyMeACoffeeLink = "";
export const discordLink = "";

export const voxelizeWorldLocalStorageKey = "voxelverses-world-name";
const potentialWorldName =
  new URLSearchParams(window.location.search).get("world") ??
  localStorage.getItem(voxelizeWorldLocalStorageKey) ??
  "terrain";
export const knownWorlds: KnownWorldName[] = [
  "main",
  "flat",
  "flat2",
  "lab",
  "terrain",
];
export const editableWorlds: KnownWorldName[] = ["flat", "flat2", "terrain"];
export const currentWorldName = knownWorlds.includes(
  potentialWorldName as KnownWorldName
)
  ? (potentialWorldName as KnownWorldName)
  : knownWorlds[0];

/* -------------------------------------------------------------------------- */
/*                                   COLORS                                   */
/* -------------------------------------------------------------------------- */
export const grayReplacement = "#C7C8CC";

export const characterModels = [
  "",
  "./assets/models/male1_model.glb",
  "./assets/models/male2_model.glb",
  "./assets/models/male3_model.glb",
  "./assets/models/female1_model.glb",
  "./assets/models/female2_model.glb",
  "./assets/models/female3_model.glb",
];

export const FAUCET_URL = "https://www.bnbchain.org/en/testnet-faucet";
export const BRIDGE_URL = "https://opbnb-testnet-bridge.bnbchain.org/deposit";
export const CHAIN_NAME = "opBNB Testnet";

export const NATIVE_SYMBOL = "tBNB";
