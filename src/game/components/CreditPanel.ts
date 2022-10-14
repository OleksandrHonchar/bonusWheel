import { BaseFeature } from "../features/BaseFeature";
import { Graphics, Text } from "pixi.js";
import { application } from "../App";
import { CREDIT_TEXT } from "../config/TextStyles";
import { createRoundedRect } from "../factory/PixiFactory";
import { Easing, Tween } from "@tweenjs/tween.js";
import { formatCredit } from "../../utils";
import { Howl } from "howler";

interface IPanelConfig {
  height: number;
  color: number;
  alpha: number;
}

export class CreditPanel extends BaseFeature<string> {
  private panel: Graphics;
  private readonly panelCfg = {
    height: 40,
    color: 0x571b1b,
    alpha: 0.8,
  };
  private readonly layer = "creditPanel";
  private credit: Text;
  private rollUpAnimation: Tween<Text>;
  private currentValue = 0;
  private winAmount = 0;
  private sound: Howl;

  constructor() {
    super();

    this.sound = new Howl({
      src: ["./multimedia/audio/credits-rollup.wav"],
      loop: true,
      volume: 0.7,
    });
    this.panel = this.createPanel(this.panelCfg);
    this.credit = new Text("", CREDIT_TEXT);
    this.updateCredit();
    this.rollUpAnimation = this.createRollUpAnimation();
    this.addChild(this.panel);
    this.panel.addChild(this.credit);
    application.addToLayer(this.layer, this);
    this.visible = true;
  }

  private createRollUpAnimation(): Tween<Text> {
    return new Tween(this.credit)
      .onUpdate((_credit, elapsed) => {
        const newValue = Math.min(
          Math.floor((this.currentValue + this.winAmount * elapsed) * 100),
          (this.currentValue + this.winAmount) * 100
        );
        this.updateCredit(newValue);
      })
      .duration(800)
      .easing(Easing.Exponential.In);
  }

  private createPanel(panelCfg: IPanelConfig): Graphics {
    const { color, alpha, height } = panelCfg;
    const dimensions = application.getDimensions();
    const panel = createRoundedRect({
      color,
      alpha,
      height,
      position: {
        x: 0,
        y: 0,
      },
      radius: 0,
      width: dimensions.width,
    });
    panel.position.set(0, dimensions.height - height);

    return panel;
  }

  async update(winAmount: number): Promise<void> {
    return new Promise((resolve) => {
      this.winAmount = winAmount;
      this.visible = true;
      this.sound.play();
      this.rollUpAnimation.start().onComplete(() => {
        this.currentValue += this.winAmount;
        this.winAmount = 0;
        this.sound.stop();
        resolve();
      });
    });
  }

  private updateCredit(value = 0) {
    this.credit.text = `Credit: ${formatCredit(value / 100)}`;
  }
}
