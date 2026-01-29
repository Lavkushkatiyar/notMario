export const TILES = {
  AIR: "  ",
  GROUND: "🟫",
  PLATFORM: "🟩",
  WALL: "🧱",
};

export const worldDimensions = {
  WIDTH: 88,
  HEIGHT: 25,
  ground_Tile: 9,
};

export const PLAYER = {
  x: 0,
  y: worldDimensions.HEIGHT - worldDimensions.ground_Tile - 1,
  icon: "🍄",
};
export const pixels = [];

const inBetween = (min, max, value) => {
  return value >= min && value < max;
};

const addSky = () => {
  for (let row = 0; row < worldDimensions.HEIGHT; row++) {
    pixels[row] = Array.from(
      { length: worldDimensions.WIDTH },
      () => TILES.AIR,
    );
  }
};

const addPlatform = (startCol, row, length) => {
  for (let col = startCol; col < startCol + length; col++) {
    if (
      inBetween(0, worldDimensions.WIDTH, col) &&
      inBetween(0, worldDimensions.HEIGHT, row)
    ) {
      pixels[row][col] = TILES.PLATFORM;
    }
  }
};

export const solidTiles = new Set([TILES.GROUND, TILES.PLATFORM, TILES.WALL]);

const addGround = () => {
  for (let row = 0; row < worldDimensions.ground_Tile; row++) {
    for (let col = 0; col < worldDimensions.WIDTH; col++) {
      pixels[(worldDimensions.HEIGHT - 1) - row][col] = TILES.GROUND;
    }
  }
};

const addWalls = () => {
  for (let row = 0; row < worldDimensions.HEIGHT; row++) {
    pixels[row][0] = TILES.WALL;
    pixels[row][worldDimensions.WIDTH - 1] = TILES.WALL;
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

export const renderUI = async () => {
  buildWorld();
  console.clear();
  let output = "";

  for (let row = 0; row < worldDimensions.HEIGHT; row++) {
    for (let col = 0; col < worldDimensions.WIDTH; col++) {
      if (row === PLAYER.y && col === PLAYER.x) {
        output += PLAYER.icon;
      } else {
        output += pixels[row][col];
      }
    }
    output += "\n";
  }

  await Deno.stdout.write(new TextEncoder().encode(output));
};
