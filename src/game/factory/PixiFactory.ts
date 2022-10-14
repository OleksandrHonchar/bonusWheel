import { Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";

export interface IPosition {
  x: number;
  y: number;
}

export interface IRectConfig {
  color: number;
  alpha: number;
  position: IPosition;
  width: number;
  height: number;
  radius: number;
}

export const createText = (
  text: string,
  style: Partial<TextStyle>,
  position?: IPosition
): Text => {
  const t = new Text(text, style);
  const x = position ? position.x : 0;
  const y = position ? position.y : 0;

  t.anchor.set(0.5);
  t.position.set(x, y);

  return t;
};

export const createRoundedRect = (config: IRectConfig): Graphics => {
  const { color, alpha, radius, position, width, height } = config;
  const r = new Graphics();

  r.beginFill(color, alpha);
  r.drawRoundedRect(position.x, position.y, width, height, radius);
  r.endFill();

  return r;
};

export const createSprite = (
  texture: Texture,
  position?: IPosition
): Sprite => {
  const s = new Sprite(texture);

  const x = position ? position.x : 0;
  const y = position ? position.y : 0;

  s.anchor.set(0.5);
  s.position.set(x, y);

  return s;
};
