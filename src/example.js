// game.js
// Deno terminal Mario-style: simple world + player + collision + jumps (straight + hop)

const TILES = {
  AIR: "🟦",
  GROUND: "🟫",
  PLATFORM: "🟩",
  WALL: "🧱",
};

const WORLD_WIDTH = 88;
const WORLD_Height = 25;
const no_Of_Ground = 9;

const WORLD = [];
const WIDTH = WORLD_WIDTH;
const HEIGHT = WORLD_Height;

// --- build world (loops + Array.from) ---
const addSky = () => {
  for (let r = 0; r < HEIGHT; r++) {
    WORLD[r] = Array.from({ length: WIDTH }, () => TILES.AIR);
  }
};

const addGround = () => {
  for (let r = HEIGHT - no_Of_Ground; r < HEIGHT; r++) {
    for (let c = 0; c < WIDTH; c++) {
      WORLD[r][c] = TILES.GROUND;
    }
  }
};

const addWalls = () => {
  for (let r = 0; r < HEIGHT; r++) {
    WORLD[r][0] = TILES.WALL;
    WORLD[r][WIDTH - 1] = TILES.WALL;
  }
};

// sample platform helper (use later as needed)
const addPlatform = (startCol, row, length) => {
  for (let c = startCol; c < startCol + length; c++) {
    if (c >= 0 && c < WIDTH && row >= 0 && row < HEIGHT) {
      WORLD[row][c] = TILES.PLATFORM;
    }
  }
};

// --- player (physics-friendly) ---
const player = {
  // grid start (matches what you provided)
  x: 0,
  y: HEIGHT - no_Of_Ground - 1,
  icon: "🍄",

  // physics state (floats)
  fx: 0, // float x
  fy: 0, // float y
  vx: 0, // horizontal speed (tiles / tick)
  vy: 0, // vertical speed (tiles / tick)
  width: 1,
  height: 1,
};

// constants for physics
const GRAVITY = 0.28; // tiles per tick^2
const MAX_FALL = 4.0; // terminal velocity
const JUMP_SPEED = 2.4; // initial upward speed (tiles per tick)
const HOP_BOOST = 0.95; // horizontal boost applied during hop
const HOP_SPEED = 0.9; // base horizontal speed applied when hopping
const HORIZONTAL_ACCEL = 0.9; // how strongly pressing left/right affects vx
const FRICTION = 0.75; // dampen vx when no directional input

// input timing memory for directional hop
let lastDir = 0; // -1 left, 0 none, 1 right
let lastDirTs = 0; // Date.now() when last direction pressed
const DIR_WINDOW_MS = 250; // if direction was pressed within this window, use for hop

// initialize world & player floats
addSky();
addGround();
addWalls();

// example smaller platforms to hop onto (optional, helps test)
addPlatform(8, HEIGHT - no_Of_Ground - 4, 8);
addPlatform(22, HEIGHT - no_Of_Ground - 7, 10);
addPlatform(40, HEIGHT - no_Of_Ground - 5, 6);

// set initial float positions
player.fx = player.x;
player.fy = player.y;

// --- utilities: tile solidity ---
const SOLID_TILES = new Set([TILES.GROUND, TILES.PLATFORM, TILES.WALL]);

function inBounds(col, row) {
  return col >= 0 && col < WIDTH && row >= 0 && row < HEIGHT;
}

function tileAt(col, row) {
  if (!inBounds(col, row)) return TILES.WALL; // treat out-of-bounds as wall
  return WORLD[row][col];
}

function isSolidAt(col, row) {
  const t = tileAt(col, row);
  return SOLID_TILES.has(t);
}

// check whether the player (at float coords fx,fy) would collide if placed at (fx,fy)
function collidesAt(fx, fy) {
  // player occupies 1x1 tile, check tile at rounded coordinates
  const col = Math.round(fx);
  const row = Math.round(fy);
  return isSolidAt(col, row);
}

// check whether player is standing on ground (tile directly below is solid)
function isOnGround() {
  const footRow = Math.round(player.fy) + 1;
  const col = Math.round(player.fx);
  return isSolidAt(col, footRow);
}

// --- movement & collision resolution ---
// attempt horizontal movement with tile collision
function tryMoveHorizontal(dx) {
  if (dx === 0) return;
  const newFx = player.fx + dx;
  // test projected horizontal position at current vertical position
  const testCol = Math.round(newFx);
  const testRow = Math.round(player.fy);

  if (!isSolidAt(testCol, testRow)) {
    player.fx = newFx;
  } else {
    // bump into wall: stop horizontal motion
    player.vx = 0;
    // snap just outside the obstacle
    if (dx > 0) {
      player.fx = testCol - 1;
    } else {
      player.fx = testCol + 1;
    }
  }
}

// attempt vertical movement with tile collision
function tryMoveVertical(dy) {
  if (dy === 0) return;
  const newFy = player.fy + dy;
  const testCol = Math.round(player.fx);
  const testRow = Math.round(newFy);

  if (!isSolidAt(testCol, testRow)) {
    player.fy = newFy;
  } else {
    // hitting the floor or ceiling
    if (dy > 0) {
      // falling -> landed on ground: snap to tile just above
      player.fy = testRow - 1;
    } else {
      // hitting head on a tile: snap below it
      player.fy = testRow + 1;
    }
    player.vy = 0;
  }
}

// physics update per tick
function physicsTick() {
  // apply gravity
  player.vy += GRAVITY;
  if (player.vy > MAX_FALL) player.vy = MAX_FALL;

  // horizontal friction (dampen when no continuous input)
  player.vx *= FRICTION;

  // integrate velocities (we will move separately horizontal then vertical to avoid corner clipping)
  tryMoveHorizontal(player.vx);
  tryMoveVertical(player.vy);

  // clamp player to bounds to avoid leaving world
  if (player.fx < 1) player.fx = 1;
  if (player.fx > WIDTH - 2) player.fx = WIDTH - 2;

  if (player.fy < 0) player.fy = 0;
  if (player.fy > HEIGHT - 1) player.fy = HEIGHT - 1;

  // update logical integer positions (useful elsewhere)
  player.x = Math.round(player.fx);
  player.y = Math.round(player.fy);
}

// --- jump / hop API ---
function tryJump() {
  if (isOnGround()) {
    // determine directional hop based on recency of lastDir
    const now = Date.now();
    const dir = (now - lastDirTs <= DIR_WINDOW_MS) ? lastDir : 0;

    // straight jump
    player.vy = -JUMP_SPEED;

    // if dir is set, apply horizontal boost for hop
    if (dir !== 0) {
      player.vx = dir * HOP_SPEED + dir * HOP_BOOST;
    }

    // small immediate vertical move so collision resolution behaves consistently
    player.fy += 0; // no-op but keeps physics flow clear
  }
}

// small step lateral movement (on key press; used for crisp control)
function stepLeft() {
  // record last direction for hop
  lastDir = -1;
  lastDirTs = Date.now();

  // immediate influence
  player.vx = Math.max(player.vx - HORIZONTAL_ACCEL, -2.2);
}

function stepRight() {
  lastDir = 1;
  lastDirTs = Date.now();

  player.vx = Math.min(player.vx + HORIZONTAL_ACCEL, 2.2);
}

// --- rendering (simple world + player overlay) ---
function renderUI() {
  console.clear();
  let out = "";

  for (let r = 0; r < HEIGHT; r++) {
    for (let c = 0; c < WIDTH; c++) {
      // draw player where rounded float position matches
      if (r === Math.round(player.fy) && c === Math.round(player.fx)) {
        out += player.icon;
      } else {
        out += WORLD[r][c];
      }
    }
    out += "\n";
  }

  // write to stdout (Deno)
  Deno.stdout.writeSync(new TextEncoder().encode(out));
}

// --- input handling (raw stdin, reuses your mapping) ---
const KEY_SEQUENCE_TO_DIRECTION = {
  "\x1b[A": "UP",
  "w\x00\x00": "UP",

  "\x1b[B": "DOWN",
  "s\x00\x00": "DOWN",

  "\x1b[C": "RIGHT",
  "d\x00\x00": "RIGHT",

  "\x1b[D": "LEFT",
  "a\x00\x00": "LEFT",
};

async function readKeySequence() {
  // read 3 bytes like your original
  const buffer = new Uint8Array(3);
  await Deno.stdin.read(buffer);
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
}

async function startInputListener() {
  Deno.stdin.setRaw(true, { cbreak: true });
  while (true) {
    const seq = await readKeySequence();
    const dir = KEY_SEQUENCE_TO_DIRECTION[seq];

    if (!dir) continue;

    switch (dir) {
      case "UP":
        tryJump(); // jump (straight or directional depending on lastDir)
        break;
      case "LEFT":
        stepLeft(); // register direction and apply small lateral push
        break;
      case "RIGHT":
        stepRight();
        break;
      case "DOWN":
        // optionally implement drop or crouch later
        break;
    }
    // re-render immediately after input so feedback feels snappy
    renderUI();
  }
}

// --- game loop ---
const TICK_MS = 50; // 20 ticks / second -> feel free to adjust

function startGameLoop() {
  renderUI();
  setInterval(() => {
    physicsTick();
    renderUI();
  }, TICK_MS);
}

// --- start everything ---
startGameLoop();
startInputListener();
