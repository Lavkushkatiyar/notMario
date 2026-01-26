const TILES = {
  AIR: "🟦",
  GROUND: "🟫",
  PLATFORM: "🟩",
  WALL: "🧱",
};
export const world = {
  WIDTH: 88,
  HEIGHT: 25,
  ground_Tile: 9,
};

export const PLAYER = {
  x: 0,
  y: world.HEIGHT - world.ground_Tile - 1,
  icon: "🍄",
};
const worlds = [];

const addSky = () => {
  for (let row = 0; row < world.HEIGHT; row++) {
    worlds[row] = Array.from({ length: world.WIDTH }, () => TILES.AIR);
  }
};
const addPlatform = (startCol, row, length) => {
  for (let col = startCol; col < startCol + length; col++) {
    if (col >= 0 && col < world.WIDTH && row >= 0 && row < world.HEIGHT) {
      worlds[row][col] = TILES.PLATFORM;
    }
  }
};

const addGround = () => {
  for (let row = 0; row < world.ground_Tile; row++) {
    for (let col = 0; col < world.WIDTH; col++) {
      worlds[(world.HEIGHT - 1) - row][col] = TILES.GROUND;
    }
  }
};
const addWalls = () => {
  for (let row = 0; row < world.HEIGHT; row++) {
    worlds[row][0] = TILES.WALL;
    worlds[row][world.WIDTH - 1] = TILES.WALL;
  }
};
const buildWorld = () => {
  addSky();
  addGround();
  addWalls();
  addPlatform(10, 12, 8);
  addPlatform(35, 10, 6);
  addPlatform(60, 8, 10);
};

export const renderUI = () => {
  buildWorld();
  console.clear();
  let output = "";

  for (let row = 0; row < world.HEIGHT; row++) {
    for (let col = 0; col < world.WIDTH; col++) {
      if (row === PLAYER.y && col === PLAYER.x) {
        output += PLAYER.icon;
      } else {
        output += worlds[row][col];
      }
    }
    output += "\n";
  }

  Deno.stdout.write(new TextEncoder().encode(output));
};
