import { Container } from "pixi.js";
import * as EventEmitter from "eventemitter3";

export enum EBaseFeatureEvent {
  Start = "start",
  Stop = "stop",
}

export class BaseFeature<T extends string> extends Container {
  public readonly events = new EventEmitter<T | EBaseFeatureEvent>();

  public constructor() {
    super();

    this.visible = false;
  }

  public async start(..._args: unknown[]): Promise<void> {
    this.events.emit(EBaseFeatureEvent.Start, ..._args);
  }

  public async stop(..._args: unknown[]): Promise<void> {
    this.events.emit(EBaseFeatureEvent.Stop, ..._args);
  }
}
