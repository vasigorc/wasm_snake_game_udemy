import init, { World } from "wasm_snake_game_udemy";

init().then((_) => {
  const world = World.new();
  const canvas = document.getElementById("snake-canvas");
  const ctx = canvas.getContext("2d");
  debugger;
});
