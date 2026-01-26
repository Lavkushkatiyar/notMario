import { PLAYER as player, renderUI } from "./displayUI.js";
import { world } from "./displayUI.js";
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

const applyMovementToPlayer = (direction) => {
  switch (direction) {
    case "DOWN":
      player.y += 1;
      break;

    case "UP":
      player.y -= 1;
      break;

    case "LEFT":
      player.x -= 1;
      break;

    case "RIGHT":
      player.x += 1;
      break;
  }
};

const readKeySequence = async () => {
  Deno.stdin.setRaw(true, { cbreak: true });

  const decoder = new TextDecoder();
  const buffer = new Uint8Array(3);

  await Deno.stdin.read(buffer);

  return decoder.decode(buffer);
};

export const startInputListener = async () => {
  while (true) {
    const keySequence = await readKeySequence();

    const direction = KEY_SEQUENCE_TO_DIRECTION[keySequence];

    if (direction) {
      applyMovementToPlayer(direction);
      renderUI();
    }
  }
};
