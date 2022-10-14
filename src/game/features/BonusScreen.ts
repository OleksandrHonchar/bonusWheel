import { BaseFeature, EBaseFeatureEvent } from "./BaseFeature";
import { ObservablePoint, Text } from "pixi.js";
import { createText } from "../factory/PixiFactory";
import { application } from "../App";
import { BONUS_ATTENTION_TEXT } from "../config/TextStyles";
import { Easing, Tween } from "@tweenjs/tween.js";
import { Wheel } from "../components/Wheel";
import { SelectedWeight, SelectWinCallback } from "../../server/WeightSelector";

export const enum EBonusScreenEvent {
  WheelStop = "wheelStop",
}

export class BonusScreen extends BaseFeature<string> {
  private readonly layer = "bonusScreen";
  private readonly textStartPosition = {
    x: -1200,
    y: 50,
  };
  private readonly textCfg = {
    style: BONUS_ATTENTION_TEXT,
    text: "PRESS TO SPIN",
  };
  private attentionText: Text;
  private transitionAnimation: Tween<ObservablePoint>;
  private titleAnimation!: Tween<ObservablePoint>;
  private wheel: Wheel;
  private selectWinCallback: SelectWinCallback;

  public constructor(selectWinCallback: SelectWinCallback) {
    super();

    this.attentionText = this.createAttentionText();
    this.selectWinCallback = selectWinCallback;

    this.wheel = new Wheel();
    this.setupEvents();
    this.transitionAnimation = this.createTransitionAnimation();

    application.addToLayer(this.layer, this);
    this.addChild(this.attentionText, this.wheel);
  }

  private createTransitionAnimation(): Tween<ObservablePoint> {
    return new Tween(this.position)
      .to({ x: this.x, y: application.getDimensions().height * 2.5 }, 1400)
      .easing(Easing.Exponential.Out)
      .onComplete(this.stop.bind(this));
  }

  private setupEvents() {
    this.wheel.events.on(EBaseFeatureEvent.Start, async () => {
      this.titleAnimation.stop();

      // emulate server request
      const win = await this.getWin();
      this.start(win);
    });
    this.wheel.events.on(
      EBaseFeatureEvent.Stop,
      this.events.emit.bind(this.events, EBonusScreenEvent.WheelStop)
    );
  }

  private async getWin(): Promise<SelectedWeight> {
    //simulate server request
    return new Promise((resolve) => {
      setTimeout(() => {
        const win = this.selectWinCallback() as SelectedWeight;

        resolve(win);
      }, 400);
    });
  }

  async show(): Promise<void> {
    const { x, y } = this.textStartPosition;

    this.position.set(0);
    this.visible = true;
    this.attentionText.position.set(x, y);
    this.titleAnimation.start();
    await this.wheel.appear();
  }

  async start(win: SelectedWeight): Promise<void> {
    super.start(win);

    this.wheel.roll(win);
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      super.stop();

      this.transitionAnimation.start().onComplete(() => {
        this.transitionAnimation.stop();
        this.visible = false;
        this.attentionText.visible = false;
        resolve();
      });
    });
  }

  private createAttentionText(): Text {
    const { text, style } = this.textCfg;

    const attention = createText(text, style);
    const bumpAnimation = new Tween(attention.scale)
      .to({ x: 1.2, y: 1.2 }, 1000)
      .easing(Easing.Elastic.InOut)
      .yoyo(true)
      .repeat(Infinity);

    attention.visible = false;
    this.titleAnimation = new Tween(attention.position)
      .to(
        { x: application.getCenterPosition().x, y: this.textStartPosition.y },
        200
      )
      .easing(Easing.Linear.None)
      .onStart(() => {
        attention.visible = true;
      })
      .chain(bumpAnimation);

    return attention;
  }
}
