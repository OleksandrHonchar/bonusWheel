import { BaseFeature } from "../features/BaseFeature";

export const enum EButtonEvent {
  Click = "click",
}

export abstract class AbstractButton extends BaseFeature<EButtonEvent> {
  protected isEnabled = false;
  protected isDown = false;

  public constructor() {
    super();

    this.setupEvents();
  }

  private setupEvents() {
    this.on("mouseup", this.onEventUp.bind(this));
    this.on("mousedown", this.onEventDown.bind(this));
    this.on("mouseover", this.onEventOver.bind(this));
    this.on("mouseout", this.onEventOut.bind(this));
    this.on("click", this.onEventClick.bind(this));
  }

  public enable() {
    this.isEnabled = true;
    this.interactive = true;
    this.buttonMode = true;
  }

  public disable() {
    this.isEnabled = false;
    this.interactive = false;
    this.buttonMode = false;
  }

  private onEventUp() {
    this.isDown = false;
    this.onButtonUp();
    this.onButtonOver();
  }

  private onEventDown() {
    this.isDown = true;
    this.onButtonDown();
  }

  private onEventOver() {
    if (!this.isDown) {
      this.onButtonOver();
    }
  }

  private onEventOut() {
    if (!this.isDown) {
      this.onButtonOut();
    }
  }

  private onEventClick() {
    if (this.isEnabled) {
      this.onButtonClick();
    }
  }

  protected onButtonClick() {
    this.disable();
    this.events.emit(EButtonEvent.Click, this);
  }

  protected abstract onButtonDown(): void;
  protected abstract onButtonUp(): void;
  protected abstract onButtonOver(): void;
  protected abstract onButtonOut(): void;
}
