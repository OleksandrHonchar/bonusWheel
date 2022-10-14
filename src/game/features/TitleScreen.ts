import { BaseFeature } from "./BaseFeature";
import { Graphics, ObservablePoint, Text } from "pixi.js";
import { TITLE_TEXT } from "../config/TextStyles";
import { BaseButton } from "../components/BaseButton";
import { application } from "../App";
import { Easing, Tween } from "@tweenjs/tween.js";
import { createRoundedRect, createText } from "../factory/PixiFactory";
import { EButtonEvent } from "../components/AbstractButton";

export class TitleScreen extends BaseFeature<string> {
  private title: Text;
  private readonly layer = "titleScreen";
  private readonly textCfg = {
    style: TITLE_TEXT,
    text: "Welcome to Bonus Wheel Feature!",
  };
  private readonly btnCfg = {
    states: { disable: 0x353d3e, down: 0x23828d, over: 0xc1e0e3, up: 0x536e71 },
    position: {
      x: 640,
      y: 500,
    },
    text: "Continue",
  };
  private button: BaseButton;
  private titleAnimation!: Tween<ObservablePoint>;
  private appearAnimation: Tween<Graphics>;
  private fadeOutAnimation: Tween<this>;
  private blink: Graphics;

  public constructor() {
    super();

    this.title = this.createTitle();
    this.blink = this.createBlink();
    this.appearAnimation = this.createAppearAnimation();
    this.fadeOutAnimation = this.createFadeOutAnimation();
    this.button = this.createButton();

    application.addToLayer(this.layer, this);
    this.addChild(this.title, this.button, this.blink);
  }

  private createButton(): BaseButton {
    const button = new BaseButton(this.btnCfg);

    button.on(EButtonEvent.Click, () => {
      this.titleAnimation.stop();
      this.fadeOutAnimation.start();
    });

    return button;
  }

  private createAppearAnimation(): Tween<Graphics> {
    return new Tween(this.blink)
      .to({ alpha: 0 }, 1800)
      .easing(Easing.Circular.In)
      .onComplete(this.start.bind(this));
  }

  private createFadeOutAnimation(): Tween<this> {
    return new Tween(this)
      .to({ alpha: 0 }, 1000)
      .easing(Easing.Circular.Out)
      .onComplete(this.stop.bind(this));
  }

  public show() {
    this.visible = true;
    this.alpha = 1;
    this.appearAnimation.start();
  }

  public async start(): Promise<void> {
    super.start();

    this.button.start();
    this.title.visible = true;
    this.titleAnimation.start().repeat(Infinity);
  }

  async stop(): Promise<void> {
    super.stop();
    this.visible = false;
  }

  private createBlink(): Graphics {
    const { width, height } = application.getDimensions();

    return createRoundedRect({
      alpha: 1,
      color: 0xffffff,
      height: height * 1.2,
      position: { x: 0, y: 0 },
      radius: 0,
      width: width * 1.2,
    });
  }
  private createTitle(): Text {
    const { text, style } = this.textCfg;
    const title = createText(text, style, {
      x: application.getCenterPosition().x,
      y: 50,
    });
    const mask = createRoundedRect({
      alpha: 0.6,
      color: 0xffffff,
      height: title.height * 2,
      position: {
        x: -title.width,
        y: -title.height,
      },
      radius: 2,
      width: 40,
    });
    const titleForMask = createText(text, { ...style, fill: "#FABF5799" });

    title.visible = false;
    titleForMask.mask = mask;
    this.titleAnimation = new Tween(mask.position)
      .to({ x: 1000, y: 0 }, 2600)
      .easing(Easing.Linear.None);
    titleForMask.addChild(mask);
    title.addChild(titleForMask);

    return title;
  }
}
