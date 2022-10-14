import { TitleScreen } from "./features/TitleScreen";
import { CreditPanel } from "./components/CreditPanel";
import { BonusScreen, EBonusScreenEvent } from "./features/BonusScreen";
import { EBaseFeatureEvent } from "./features/BaseFeature";
import { Background } from "./components/Background";
import { getWinCallback } from "../server/WeightSelector";
import { IWinWeight, WIN_WEIGHTS } from "../server/WeigtsConfig";
import { WinAnimation } from "./features/WinAnimation";

export class Game {
  private titleScreen: TitleScreen;
  private creditPanel: CreditPanel;
  private bonusScreen: BonusScreen;
  private winAnimation: WinAnimation;

  constructor() {
    this.titleScreen = new TitleScreen();
    this.winAnimation = new WinAnimation();
    new Background();
    this.creditPanel = new CreditPanel();
    this.bonusScreen = new BonusScreen(getWinCallback(WIN_WEIGHTS));
    this.setupFlow();
  }

  private setupFlow() {
    this.titleScreen.events.on(EBaseFeatureEvent.Stop, () => {
      this.bonusScreen.show();
    });

    this.bonusScreen.events.on(
      EBonusScreenEvent.WheelStop,
      async (win: IWinWeight) => {
        await Promise.all([
          await this.creditPanel.update(win.credit),
          await this.winAnimation.start(win.credit),
        ]);
        await this.bonusScreen.stop();
        this.start();
      }
    );
  }

  public start() {
    this.titleScreen.show();
  }
}
