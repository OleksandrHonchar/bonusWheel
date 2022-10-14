import { BaseFeature } from "../features/BaseFeature";
import { Sprite } from "pixi.js";
import { application } from "../App";
import { createSprite } from "../factory/PixiFactory";

export class Background extends BaseFeature<string> {
  private background: Sprite;
  private readonly layer = "background";

  constructor() {
    super();

    const { x, y } = application.getCenterPosition();
    const texture = application.getSprite(this.layer);

    this.background = createSprite(texture, {
      x,
      y,
    });
    this.visible = true;
    this.addChild(this.background);
    application.addToLayer(this.layer, this);
  }
}
