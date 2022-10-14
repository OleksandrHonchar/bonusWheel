import { BaseFeature } from "../features/BaseFeature";
import { Container, ObservablePoint, Point, SimpleRope, Sprite } from "pixi.js";
import { createSprite, createText } from "../factory/PixiFactory";
import { application } from "../App";
import { Easing, Tween } from "@tweenjs/tween.js";
import { WheelButton } from "./WheelButton";
import { EButtonEvent } from "./AbstractButton";
import { SelectedWeight } from "../../server/WeightSelector";
import { formatCredit, getValueFromRange } from "../../utils";
import { Howl } from "howler";

interface ISection {
  credit: number;
  id: number;
  tint: number;
}
export class Wheel extends BaseFeature<string> {
  private wheel: Container;
  private readonly wheelStartXPosition = 2000;
  private readonly ANIMATION_DURATION = 4200;
  private readonly buttonStates = {
    disable: 0x212324,
    down: 0x33597a,
    over: 0x257bc8,
    up: 0x437098,
  };
  private readonly sections = [
    { id: 0, credit: 5000, tint: 0xff9f22 },
    { id: 1, credit: 200, tint: 0x107fb4 },
    { id: 2, credit: 1000, tint: 0xff8cae },
    { id: 3, credit: 400, tint: 0xb0d0b0 },
    { id: 4, credit: 2000, tint: 0xd73a22 },
    { id: 5, credit: 200, tint: 0x0daeff },
    { id: 6, credit: 1000, tint: 0xff3262 },
    { id: 7, credit: 400, tint: 0x95ae8d },
  ];
  private appearAnimation: Tween<ObservablePoint>;
  private idleAnimation: Tween<Container>;
  private startAnimation: Tween<Container>;
  private wheelButton!: WheelButton;
  private landingSound: Howl;
  private clickSound: Howl;

  public constructor() {
    super();

    this.wheel = this.createWheel(this.sections);
    this.landingSound = new Howl({
      src: ["./multimedia/audio/wheel-landing.wav"],
    });
    this.clickSound = new Howl({
      src: ["./multimedia/audio/wheel-click.wav"],
      loop: true,
    });
    this.appearAnimation = this.createAppearAnimation();
    this.scale.set(0.5);
    this.idleAnimation = this.createIdleAnimation();
    this.startAnimation = new Tween(this.wheel).easing(Easing.Cubic.Out);
  }

  private createIdleAnimation(): Tween<Container> {
    return new Tween(this.wheel)
      .to({ rotation: Math.PI * 2 }, 5400)
      .easing(Easing.Linear.None)
      .repeat(Infinity);
  }
  private createAppearAnimation(): Tween<ObservablePoint> {
    const { x, y } = application.getCenterPosition();

    return new Tween(this.position)
      .to({ x, y }, 200)
      .easing(Easing.Linear.None)
      .onStart(() => {
        this.visible = true;
      });
  }

  private createText(text: string): Sprite {
    const txt = createText(text, {
      fill: "black",
      fontSize: "48px",
    });
    const radius = 200;
    const maxRopePoints = 50;
    const step = Math.PI / maxRopePoints;

    let ropePoints =
      maxRopePoints -
      Math.round((txt.width / (radius * Math.PI)) * maxRopePoints);
    ropePoints /= 2;

    const points = [];
    for (let i = maxRopePoints - ropePoints; i > ropePoints; i--) {
      const x = radius * Math.cos(step * i);
      const y = radius * Math.sin(step * i);
      points.push(new Point(x, -y));
    }
    const rope = new SimpleRope(txt.texture, points);

    const sprite = new Sprite(application.generateTexture(rope));
    sprite.anchor.set(0.5);
    sprite.position.set(0, -380);

    return sprite;
  }

  private createWheel(sections: Array<ISection>): Container {
    const root = new Container();

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sprite = createSprite(application.getSprite("wheelSlice"));
      const text = this.createText(formatCredit(section.credit));

      sprite.anchor.set(0.5, 1);
      sprite.rotation = (Math.PI * 2 * i) / sections.length;
      sprite.tint = section.tint;
      sprite.addChild(text);
      root.addChild(sprite);
    }
    this.wheelButton = new WheelButton({
      sprite: createSprite(application.getSprite("wheelCenter")),
      states: this.buttonStates,
      text: "Click me!",
    });

    this.wheelButton.events.on(EButtonEvent.Click, () => {
      this.start();
    });
    const wheelPointer = createSprite(application.getSprite("wheelPointer"), {
      x: 0,
      y: -460,
    });
    this.addChild(root, this.wheelButton, wheelPointer);

    return root;
  }

  async appear(): Promise<void> {
    return new Promise((resolve) => {
      this.position.set(
        this.wheelStartXPosition,
        application.getCenterPosition().y
      );
      this.appearAnimation.start().onComplete(() => {
        this.wheelButton.enable();
        this.idleAnimation.start();
        resolve();
      });
    });
  }

  async roll(win: SelectedWeight): Promise<void> {
    const { id } = win;
    const sectorRange = (Math.PI / this.sections.length) * 0.9;
    const range = getValueFromRange(-sectorRange, sectorRange);
    const targetRotation =
      Math.PI * 2 * (1 - id / this.sections.length) + range + Math.PI * 6;

    this.idleAnimation.stop();
    this.clickSound.fade(1, 0, this.ANIMATION_DURATION).play();
    this.startAnimation
      .to({ rotation: targetRotation }, this.ANIMATION_DURATION)
      .start()
      .onComplete(() => {
        this.clickSound.stop();
        this.landingSound.play();
        this.stop(win);
      });
  }
}
