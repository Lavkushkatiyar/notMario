import { renderUI } from "./src/displayUI.js";
import { startInputListener } from "./src/playerMovement.js";
const main = async () => {
  renderUI();
  await startInputListener();
};
main();
