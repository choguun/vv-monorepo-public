export type ChatItem = {
  type: "chat" | "owner-chat" | "system";
  sender: string;
  body: string;
};

export type KnownWorldName = "main" | "flat" | "flat2" | "lab" | "terrain";

export type BlockEntityPayload = {
  type: "wallpaper";
  resolutionFactor: number;
  imageSource: string;
};
