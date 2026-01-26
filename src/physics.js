import { PLAYER as player, renderUI, world } from "./displayUI.js";

export const jump = ({ jumpPhase, stepCount }) => {
  setInterval(() => {
    if (jumpPhase === "up") {
      player.y -= 1;
      if (++stepCount === 5) {
        jumpPhase = "down";
        stepCount = 0;
      }
    } else if (jumpPhase === "down") {
      player.y += 1;
      if (++stepCount === 5) {
        jumpPhase = "";
        stepCount = 0;
      }
    }

    renderUI(world);
  }, 200);
};
