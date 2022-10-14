import { BaseFeature } from "./BaseFeature";
import { AnimatedSprite, Container, ObservablePoint, Text } from "pixi.js";
import { createText } from "../factory/PixiFactory";
import { WIN_TEXT } from "../config/TextStyles";
import { application } from "../App";
import { Easing, Tween } from "@tweenjs/tween.js";
import { formatCredit, getValueFromRange } from "../../utils";

export class WinAnimation extends BaseFeature<string> {
  private winningText: Text;
  private readonly layer = "winAnimation";
  private readonly ANIMATION_DURATION = 2500;
  private readonly COINS_AMOUNT = 32;
  private scaleUpAnimation: Tween<ObservablePoint>;
  private coinsAnimation: Tween<Container>;
  private coins: Array<AnimatedSprite> = [];

  public constructor() {
    super();

    const { x, y } = application.getCenterPosition();

    this.winningText = createText("", WIN_TEXT, { x, y });
    this.createsCoinsEmitter();
    this.winningText.scale.set(0);
    this.scaleUpAnimation = this.createScaleUpAnimation();
    this.coinsAnimation = this.createCoinsAnimation();

    application.addToLayer(this.layer, this);
    this.addChild(this.winningText);
  }

  private createCoinsAnimation(): Tween<Container> {
    return new Tween(this)
      .onUpdate((_tween, elapsed) => {
        this.coins.forEach((coin) => {
          const speed = coin.animationSpeed / elapsed;
          const rotation = speed * 0.03;
          const position = {
            x: (speed * 0.5) / Math.random(),
            y: 0,
          };

          if (elapsed <= 0.5) {
            position.y = -Math.abs(speed * 3.5);
          } else {
            position.y = Math.abs(speed * 60);
          }
          coin.rotation += rotation;
          coin.position.set(
            coin.position.x + position.x,
            coin.position.y + position.y
          );
        });
      })
      .onStart(() => {
        const { x } = application.getCenterPosition();
        const { height } = application.getDimensions();

        this.coins.forEach((coin) => {
          coin.position.set(x, height + coin.height / 2);
        });
      })
      .duration(this.ANIMATION_DURATION)
      .easing(Easing.Linear.None);
  }

  private createsCoinsEmitter() {
    const spriteSheet = application.getSpriteSheet("coins");
    const coinsTextures = Object.values(spriteSheet.textures);

    for (let i = 0; i < this.COINS_AMOUNT; i++) {
      const coins = new AnimatedSprite(coinsTextures);
      const speed = getValueFromRange(0.2, 0.4);

      coins.anchor.set(0.5);
      coins.loop = true;
      coins.animationSpeed = Math.random() > 0.5 ? -speed : speed;
      coins.gotoAndPlay(getValueFromRange(0, coinsTextures.length - 1));
      this.addChild(coins);
      this.coins.push(coins);
    }
  }

  private createScaleUpAnimation(): Tween<ObservablePoint> {
    return new Tween(this.winningText.scale)
      .to({ x: 1, y: 1 }, this.ANIMATION_DURATION)
      .easing(Easing.Exponential.Out);
  }

  async start(credit: number): Promise<void> {
    return new Promise((resolve) => {
      super.start(credit);
      this.visible = true;
      this.winningText.text = `YOU WON ${formatCredit(credit)} CREDITS!`;
      this.coinsAnimation.start().onComplete(() => {
        this.visible = false;
        resolve();
      });
      this.scaleUpAnimation.start().onComplete(() => {
        this.winningText.scale.set(0);
      });
    });
  }
}
