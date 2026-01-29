import { renderUI } from "./src/displayUI.js";
import { startGame } from "./src/playerMovement.js";

const main = async () => {
  renderUI();

  await startGame();
};
main();
