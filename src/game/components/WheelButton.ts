import { Sprite, Text } from "pixi.js";
import { createText } from "../factory/PixiFactory";
import { AbstractButton } from "./AbstractButton";
import { Howl } from "howler";

export interface IBaseButtonConfig {
  sprite: Sprite;
  states: {
    disable: number;
    up: number;
    down: number;
    over: number;
  };
  text: string;
}

export class WheelButton extends AbstractButton {
  private button: Sprite;
  private config: IBaseButtonConfig;
  private text: Text;
  private sound: Howl;

  public constructor(config: IBaseButtonConfig) {
    super();

    this.sound = new Howl({
      src: ["./multimedia/audio/wheel-click.wav"],
    });
    this.config = config;
    this.button = this.createButton();
    this.text = createText(config.text, { fill: 0xffd966, fontSize: "52px" });

    this.button.addChild(this.text);
    this.visible = true;
  }

  private createButton(): Sprite {
    const { sprite } = this.config;
    const button = sprite;

    this.addChild(button);

    return button;
  }

  public enable() {
    super.enable();
    this.text.visible = true;
    this.update(this.config.states.up);
  }

  public disable() {
    super.disable();
    this.update(this.config.states.disable);
  }

  async stop(): Promise<void> {
    super.stop();

    this.visible = false;
  }

  protected onButtonDown() {
    this.update(this.config.states.down, 0.85);
  }

  protected onButtonUp() {
    this.update(this.config.states.up);
  }

  protected onButtonOver() {
    this.update(this.config.states.over, 1.2);
  }

  protected onButtonOut() {
    this.update(this.config.states.up);
  }

  protected onButtonClick() {
    super.onButtonClick();

    this.sound.play();
    this.text.visible = false;
  }

  private update(tint: number, scale = 1) {
    this.button.tint = tint;
    this.button.scale.set(scale);
  }
}
