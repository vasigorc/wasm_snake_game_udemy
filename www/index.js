import init, { World } from "wasm_snake_game_udemy";

init().then((_) => {
  const world = World.new();
  console.log(world.width());
});
