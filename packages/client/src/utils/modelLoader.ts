import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export class ModelLoader {
  loader = new GLTFLoader();

  models = {
    pickaxe: undefined,
  };

  constructor(onLoad: any) {
    // /pickaxe-metal.glb
    this.loader.load("./models/pickaxe-normal.glb", (model: any) => {
      const mesh = model.scene;
      this.models.pickaxe = mesh;
      onLoad(this.models);
    });
  }
}
