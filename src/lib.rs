use wasm_bindgen::prelude::*;
use wee_alloc::WeeAlloc;

// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

#[derive(PartialEq)]
enum Direction {
    Up,
    Down,
    Right,
    Left,
}

#[wasm_bindgen]
pub struct World {
    width: usize,
    size: usize,
    snake: Snake,
}

#[wasm_bindgen]
impl World {
    pub fn new(width: usize, snake_idx: usize) -> World {
        World {
            width,
            snake: Snake::new(snake_idx),
            size: width.pow(2),
        }
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn snake_head_idx(&self) -> usize {
        self.snake.body[0].0
    }

    pub fn update(&mut self) {
        let snake_idx = self.snake_head_idx();
        let current_row = snake_idx / self.width;
        let current_col = snake_idx % self.width;

        if self.snake.direction == Direction::Right {
            let next_col = (current_col + 1) % self.width;
            self.snake.body[0].0 = (current_row * self.width) + next_col;
        }

        if self.snake.direction == Direction::Left {
            let next_col = (current_col - 1) % self.width;
            self.snake.body[0].0 = (current_row * self.width) + next_col;
        }

        if self.snake.direction == Direction::Up {
            let next_row = (current_row - 1) % self.width;
            self.snake.body[0].0 = (next_row * self.width) + current_col;
        }

        if self.snake.direction == Direction::Down {
            let next_row = (current_row + 1) % self.width;
            self.snake.body[0].0 = (next_row * self.width) + current_col;
        }
    }
}

struct SnakeCell(usize);

struct Snake {
    body: Vec<SnakeCell>,
    direction: Direction,
}

impl Snake {
    fn new(spawn_index: usize) -> Snake {
        Snake {
            body: vec![SnakeCell(spawn_index)],
            direction: Direction::Down,
        }
    }
}
