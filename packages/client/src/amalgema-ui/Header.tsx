import { twMerge } from "tailwind-merge";

import { MUD_URL } from "../links";

import { AnnouncementModal } from "./AnnouncementModal";
import { NetworkStatus } from "./NetworkStatus";
import { Caption, Link, OverlineLarge } from "./Theme/SkyStrife/Typography";

export function Header() {
  return (
    <div
      className={twMerge(
        "bg-ss-bg-1 border-b border-ss-stroke z-1 px-8 py-4 flex flex-row justify-between items-center"
      )}
    >
      <div className="flex flex-row justify-between w-full h-full items-center">
        <div className="flex flex-row items-center">
          <OverlineLarge
            className="normal-case h-[32px]"
            style={{ fontSize: "32px" }}
          >
            VoxelWorld
          </OverlineLarge>

          <Caption className="ml-4">
            powered by <Link href={MUD_URL}>Voxelverses</Link>
          </Caption>
        </div>

        <AnnouncementModal />

        <NetworkStatus />
      </div>
    </div>
  );
}
