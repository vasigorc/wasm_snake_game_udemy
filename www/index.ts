import init, { World } from "wasm_snake_game_udemy";

init().then((_) => {
  const CELL_SIZE = 10;
  const WORLD_WIDTH = 8;
  const snakeSpawnIdx = Date.now() % Math.pow(WORLD_WIDTH, 2); // random number within the boundaries of our world

  const world = World.new(WORLD_WIDTH, snakeSpawnIdx);
  const worldWidth = world.width();

  const canvas = <HTMLCanvasElement>document.getElementById("snake-canvas");
  const ctx = canvas.getContext("2d");

  canvas.height = worldWidth * CELL_SIZE;
  canvas.width = worldWidth * CELL_SIZE;

  function drawWorld() {
    ctx.beginPath();

    for (let x = 0; x < worldWidth + 1; x++) {
      ctx.moveTo(CELL_SIZE * x, 0);
      ctx.lineTo(CELL_SIZE * x, worldWidth * CELL_SIZE);
    }

    for (let y = 0; y < worldWidth + 1; y++) {
      ctx.moveTo(0, CELL_SIZE * y);
      ctx.lineTo(worldWidth * CELL_SIZE, CELL_SIZE * y);
    }

    ctx.stroke();
  }

  function drawSnake() {
    const snakeIdx = world.snake_head_idx();
    // two rows below are required to figure out x, y coordinates given 1D storage structure of the world
    const col = snakeIdx % worldWidth;
    const row = Math.floor(snakeIdx / worldWidth);

    ctx.beginPath();
    // the last two params are just the size of the wrapping rectangle
    ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    ctx.stroke();
  }

  function paint() {
    drawWorld();
    drawSnake();
  }

  function update() {
    const fps = 3; // fps - frames per second
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      world.update();
      paint();
      // the method takes a callback to invoke before the next repaint
      // this is prefered instead of `setInterval(() => ..., interval);`
      // to make the updates more syncrhonized in the browser
      requestAnimationFrame(update);
    }, 1000 / fps);
  }

  paint();
  update();
});
