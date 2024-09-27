import { useSyncStatus } from "./hooks/useSyncStatus";
import { Caption } from "./Theme/SkyStrife/Typography";

export function SyncStatus() {
  const { syncStatus, statusColor } = useSyncStatus();

  return (
    <div className="flex">
      <div className={`flex items-center`}>
        <div
          className={`animate-pulse rounded-full w-4 h-4 mr-2`}
          style={{
            backgroundColor: statusColor,
          }}
        />
        <Caption className="text-black">
          {syncStatus === "ok"
            ? "Synced"
            : syncStatus === "concerning"
            ? "Syncing"
            : "Desynced (Try Reloading)"}
        </Caption>
      </div>
    </div>
  );
}
