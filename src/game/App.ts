import {
  Application,
  Container,
  DisplayObject,
  Loader,
  Spritesheet,
  Texture,
} from "pixi.js";
import { Dict } from "@pixi/utils";
import { LoaderResource } from "@pixi/loaders";
import { fetchData } from "../utils";
import * as TWEEN from "@tweenjs/tween.js";

export interface IAppConfig {
  layers: Array<string>;
  assetsConfigUrl: string;
}

type ILayers = {
  [key: string]: Container;
};

export class App {
  private pixiApp: Application;
  private readonly dimensions = {
    width: 1280,
    height: 720,
  };
  public sprites: Map<string, Texture> = new Map();
  public spriteSheets: Map<string, Spritesheet> = new Map();
  private layers: ILayers;

  constructor() {
    const { width, height } = this.dimensions;
    this.pixiApp = new Application({
      width,
      height,
      backgroundColor: 0xffffff,
    });
    this.layers = {};
    this.resize();

    document.body.appendChild(this.pixiApp.view);
    window.onresize = this.resize.bind(this);
  }

  private resize() {
    const { width, height } = this.dimensions;
    const { innerWidth, innerHeight } = window;
    const ratio = width / height;
    let w = innerWidth;
    let h = innerWidth / ratio;

    if (innerWidth / window.innerHeight >= ratio) {
      w = innerHeight * ratio;
      h = innerHeight;
    }

    this.pixiApp.renderer.resize(w, h);
    this.pixiApp.stage.scale.set(w / width);
  }

  public async init({ layers, assetsConfigUrl }: IAppConfig): Promise<void> {
    const loadedAssets = await this.loadAssets(assetsConfigUrl);

    this.parseLoadedAssets(loadedAssets);
    layers.forEach((layer) => {
      this.layers[layer] = new Container();
      this.pixiApp.stage.addChild(this.layers[layer]);
    });
    this.addTweenToTicker();
  }

  private addTweenToTicker() {
    this.pixiApp.ticker.add(() => {
      TWEEN.update();
    });
  }

  private parseLoadedAssets(loadedAssets: Dict<LoaderResource>) {
    for (const key in loadedAssets) {
      const data = loadedAssets[key];
      if (data.spritesheet) {
        this.spriteSheets.set(key, data.spritesheet);
      } else if (data.texture) {
        this.sprites.set(key, data.texture);
      }
    }
  }

  private async loadAssets(cfgUrl: string): Promise<Dict<LoaderResource>> {
    const loader = new Loader();
    const assetsToLoad = await fetchData(cfgUrl);

    for (const assetName in assetsToLoad) {
      loader.add(assetName, assetsToLoad[assetName]);
    }

    loader.load();

    return new Promise((resolve, reject) => {
      loader.onComplete.add(
        (_loader: Loader, resources: Dict<LoaderResource>) => resolve(resources)
      );
      loader.onError.add(
        (_error: Error, _loader: Loader, resource: LoaderResource) =>
          reject(new Error(`Failed to load resource: ${resource.url}`))
      );
    });
  }

  public getSprite(id: string): Texture {
    if (!this.sprites.has(id)) {
      throw new Error(`There is no asset loaded with id: ${id}`);
    }
    return this.sprites.get(id)!;
  }

  public getSpriteSheet(id: string): Spritesheet {
    if (!this.spriteSheets.has(id)) {
      throw new Error(`There is no asset loaded with id: ${id}`);
    }
    return this.spriteSheets.get(id)!;
  }

  public generateTexture(displayObj: DisplayObject): Texture {
    return this.pixiApp.renderer.generateTexture(displayObj);
  }

  public addToLayer(layerId: string, displayObj: DisplayObject) {
    const layer = this.layers[layerId];

    if (!layer) {
      throw new Error(`Specified ${layerId} layer doesn't exist`);
    }
    layer.addChild(displayObj);
  }

  public getCenterPosition(): { x: number; y: number } {
    const { width, height } = this.dimensions;

    return {
      x: width / 2,
      y: height / 2,
    };
  }

  public getDimensions(): { width: number; height: number } {
    return this.dimensions;
  }
}

export const application = new App();
