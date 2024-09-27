import { type BlockEntityUpdateData, type World } from "@vv-libs/core";
import { CanvasTexture, Group, NearestFilter, SRGBColorSpace } from "three";

import type { BlockEntityPayload } from "../types";

export class BlockEntities extends Group {
  private unbinds: (() => void)[] = [];

  constructor(private world: World) {
    super();

    this.registerListenersToWorld(world);
    world.add(this);
  }

  handleRightClickAt = (vx: number, vy: number, vz: number) => {
    const data = this.world.getBlockEntityDataAt(vx, vy, vz);
    const block = this.world.getBlockAt(vx, vy, vz);
    console.log(data, block);
    this.world.setBlockEntityDataAt(vx, vy, vz, {
      color: [Math.random(), Math.random(), Math.random()],
    });
  };

  handleBlockEntityUpdate = (
    args: BlockEntityUpdateData<BlockEntityPayload>
  ) => {
    const { newValue, voxel, operation } = args;

    if (!newValue || !newValue.imageSource) {
      return;
    }

    if (operation === "UPDATE") {
      switch (newValue.type) {
        case "wallpaper": {
          const load = async () => {
            const image = await this.world.loader.loadImage(
              newValue.imageSource
            );
            const imageWidth = image.width;
            const imageHeight = image.height;
            const canvasAspectRatio = 3 / 2; // Aspect ratio for a 3x2 block area
            const realWidth = 3 * newValue.resolutionFactor; // 3 blocks wide
            const realHeight = 2 * newValue.resolutionFactor; // 2 blocks high

            const canvas = document.createElement("canvas");
            canvas.width = realWidth;
            canvas.height = realHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.imageSmoothingEnabled = false; // Disable smoothing to create a pixelated effect
              let sx, sy, sWidth, sHeight;
              const imageAspectRatio = imageWidth / imageHeight;

              if (imageAspectRatio > canvasAspectRatio) {
                // Image is wider than canvas
                sHeight = imageHeight;
                sWidth = imageHeight * canvasAspectRatio;
                sx = (imageWidth - sWidth) / 2;
                sy = 0;
              } else {
                // Image is taller than canvas
                sWidth = imageWidth;
                sHeight = imageWidth / canvasAspectRatio;
                sx = 0;
                sy = (imageHeight - sHeight) / 2;
              }

              ctx.drawImage(
                image,
                sx,
                sy,
                sWidth,
                sHeight,
                0,
                0,
                realWidth,
                realHeight
              );
            }

            const texture = new CanvasTexture(canvas);
            texture.magFilter = NearestFilter;
            texture.minFilter = NearestFilter;
            texture.generateMipmaps = false;
            texture.colorSpace = SRGBColorSpace;
            texture.needsUpdate = true;

            this.world.applyBlockTextureAt(
              "2x3 Painting",
              "nz",
              texture,
              voxel
            );
          };

          load();
          break;
        }
      }
    }
  };

  registerListenersToWorld = (world: World) => {
    this.unbinds.push(
      world.addBlockEntityUpdateListener(this.handleBlockEntityUpdate)
    );
  };
}
