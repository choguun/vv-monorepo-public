import { voxelizeWorldLocalStorageKey } from "../constants";
import type { KnownWorldName } from "../types";

export const reloadAndJoinWorld = (worldName: KnownWorldName) => {
  localStorage.setItem(voxelizeWorldLocalStorageKey, worldName);
  window.location.reload();
};
