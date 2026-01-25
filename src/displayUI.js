const TILES = {
  AIR: "🟦",
  GROUND: "🟫",
  PLATFORM: "🟩",
  WALL: "🧱",
};

const WORLD_WIDTH = 88;
const WORLD_Height = 25;

const world = [];

const addSky = () => {
  for (let row = 0; row < WORLD_Height; row++) {
    world[row] = [];
    for (let col = 0; col < WORLD_WIDTH; col++) { // use repeat here
      world[row][col] = TILES.AIR;
    }
  }
};
const addGround = () => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < WORLD_WIDTH; col++) {
      world[(WORLD_Height - 1) - (row + 1)][0] = TILES.GROUND;
      world[(WORLD_Height - 1) - row][col] = TILES.GROUND;
    }
  }
};
addSky();
addGround();
const render = () => {
  console.clear();
  let output = "";

  for (let row = 0; row < WORLD_Height; row++) {
    for (let col = 0; col < WORLD_WIDTH; col++) {
      output += world[row][col];
    }
    output += "\n";
  }

  Deno.stdout.write(new TextEncoder().encode(output));
};

render();
