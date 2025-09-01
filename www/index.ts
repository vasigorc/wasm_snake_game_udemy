import init, { World, Direction } from "wasm_snake_game_udemy";
import { rnd } from "./utils/rnd";

init().then((wasm) => {
  const CELL_SIZE = 10;
  const WORLD_WIDTH = 8;
  const snakeSpawnIdx = rnd(Math.pow(WORLD_WIDTH, 2)); // random number within the boundaries of our world

  const world = World.new(WORLD_WIDTH, snakeSpawnIdx);
  const worldWidth = world.width();

  const gameStatusElement = document.getElementById("game-status");
  const gameControlBtn = document.getElementById("game-control-btn");
  const canvas = <HTMLCanvasElement>document.getElementById("snake-canvas");
  const ctx = canvas.getContext("2d");

  canvas.height = worldWidth * CELL_SIZE;
  canvas.width = worldWidth * CELL_SIZE;

  gameControlBtn.addEventListener("click", (_) => {
    const gameStatus = world.get_game_status();

    // None maps to JS' `undefined`
    if (gameStatus == undefined) {
      gameControlBtn.textContent = "Playing...";
      world.start_game();
      play();
    } else {
      // when clicking on Play the second time, browser window will reload
      location.reload();
    }
  });

  document.addEventListener("keydown", (event) => {
    switch (event.code) {
      case "ArrowUp":
        world.change_snake_direction(Direction.Up);
        break;
      case "ArrowRight":
        world.change_snake_direction(Direction.Right);
        break;
      case "ArrowDown":
        world.change_snake_direction(Direction.Down);
        break;
      case "ArrowLeft":
        world.change_snake_direction(Direction.Left);
        break;
    }
  });

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

  function drawReward() {
    const idx = world.reward_cell();
    const col = idx % worldWidth;
    const row = Math.floor(idx / worldWidth);

    ctx.beginPath();
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    ctx.stroke();
  }

  function drawSnake() {
    // get the pointer to the SnakeCell
    const snakeCells = new Uint32Array(
      wasm.memory.buffer, // buffer
      world.snake_cells(), // byte offset / starting point
      world.snake_length(), // length
    );

    snakeCells.forEach((cellIdx, iterationIdx) => {
      // two rows below are required to figure out x, y coordinates given 1D storage structure of the world
      const col = cellIdx % worldWidth;
      const row = Math.floor(cellIdx / worldWidth);

      ctx.fillStyle = iterationIdx == 0 ? "#7878db" : "#000000";

      ctx.beginPath();
      // the last two params are just the size of the wrapping rectangle
      ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);

      ctx.stroke();
    });
  }

  function drawGameStatus() {
    gameStatusElement.textContent = world.get_game_status_test();
  }

  function paint() {
    drawWorld();
    drawSnake();
    drawReward();
    drawGameStatus();
  }

  function play() {
    const fps = 10; // fps - frames per second
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      world.step();
      paint();
      // the method takes a callback to invoke before the next repaint
      // this is prefered instead of `setInterval(() => ..., interval);`
      // to make the updates more syncrhonized in the browser
      requestAnimationFrame(play);
    }, 1000 / fps);
  }

  paint();
});
