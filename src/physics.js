import {
  PLAYER as player,
  renderUI,
  solidTiles,
  TILES,
  world,
  worlds,
} from "./displayUI.js";

const inBounds = (col, row) => {
  return col >= 0 && col < world.WIDTH && row >= 0 && row < world.HEIGHT;
};

const tileAt = (col, row) => {
  if (!inBounds(col, row)) return TILES.WALL;
  return worlds[row][col];
};

export const isSolidAt = (col, row) => {
  const t = tileAt(col, row);
  return solidTiles.has(t);
};

export const jump = ({ jumpPhase, stepCount }) => {
  const interval = setInterval(() => {
    if (jumpPhase === "up") {
      if (!isSolidAt(player.x - 1, player.y - 2)) {
        player.y -= 1;
      }
      if (++stepCount === 5) {
        jumpPhase = "down";
        stepCount = 0;
      }
    } else if (jumpPhase === "down") {
      if (!isSolidAt(player.x + 1, player.y + 1)) {
        player.y += 1;
      } else {
        clearInterval(interval);
      }
    }

    renderUI(world);
  }, 200);
};
export const goDown = () => {
  const interval = setInterval(() => {
    if (!isSolidAt(player.x, player.y + 1)) {
      player.y += 1;
    } else clearInterval(interval);

    renderUI(world);
  }, 200);
};
