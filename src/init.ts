import { application } from "./game/App";
import { Game } from "./game/Game";
import { Layers } from "./game/config/Layers";

(async () => {
  await application.init({
    layers: Layers,
    assetsConfigUrl: "./config/assetsToLoad.json",
  });

  const game = new Game();
  game.start();
})();
