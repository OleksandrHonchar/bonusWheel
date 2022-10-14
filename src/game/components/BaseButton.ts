import { Graphics } from "pixi.js";
import { createRoundedRect, createText } from "../factory/PixiFactory";
import { AbstractButton } from "./AbstractButton";

export interface IBaseButtonConfig {
  states: {
    disable: number;
    up: number;
    down: number;
    over: number;
  };
  position: {
    x: number;
    y: number;
  };
  text: string;
}

export class BaseButton extends AbstractButton {
  private button: Graphics;
  private config: IBaseButtonConfig;

  public constructor(config: IBaseButtonConfig) {
    super();

    this.config = config;
    this.button = this.createButton();
  }

  private createButton(): Graphics {
    const button = createRoundedRect({
      alpha: 1,
      color: this.config.states.up,
      height: 60,
      position: {
        x: 0,
        y: 0,
      },
      radius: 6,
      width: 210,
    });
    const { text, position } = this.config;
    const textComponent = createText(
      text,
      { fill: "white" },
      {
        x: button.width / 2,
        y: button.height / 2,
      }
    );

    button.position.set(position.x, position.y);
    button.pivot.set(button.width / 2, button.height / 2);

    button.addChild(textComponent);
    this.addChild(button);

    return button;
  }

  public enable() {
    super.enable();
    this.update(this.config.states.up);
  }

  public disable() {
    super.disable();
    this.update(this.config.states.disable);
  }

  async start(): Promise<void> {
    super.start();

    this.visible = true;
    this.enable();
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

  private update(tint: number, scale = 1) {
    this.button.tint = tint;
    this.button.scale.set(scale);
  }
}
