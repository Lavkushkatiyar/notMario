import {
  pixels,
  PLAYER as player,
  renderUI,
  solidTiles,
  TILES,
  worldDimensions,
} from "./displayUI.js";

export const inBounds = (col, row) => {
  return col >= 0 && col < worldDimensions.WIDTH && row >= 0 &&
    row < worldDimensions.HEIGHT;
};

const tileAt = (col, row) => {
  if (inBounds(col, row)) {
    return pixels[row][col];
  }

  return TILES.WALL;
};

export const isSolidAt = (col, row) => {
  const tile = tileAt(col, row);
  return solidTiles.has(tile);
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

    renderUI(worldDimensions);
  }, 200);
};
export const fallTillSolidTile = () => {
  const interval = setInterval(() => {
    if (!isSolidAt(player.x, player.y + 1)) {
      player.y += 1;
    } else clearInterval(interval);

    renderUI(worldDimensions);
  }, 200);
};
