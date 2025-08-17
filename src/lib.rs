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

        let (current_row, current_col) = self.index_to_cell(snake_idx);

        let (row, column) = match self.snake.direction {
            Direction::Right => (current_row, (current_col + 1) % self.width),
            Direction::Left => (current_row, (current_col - 1) % self.width),
            Direction::Up => ((current_row - 1) % self.width, current_col),
            Direction::Down => ((current_row + 1) % self.width, current_col),
        };

        self.set_snake_head(self.cell_to_index(row, column))
    }

    fn set_snake_head(&mut self, idx: usize) {
        self.snake.body[0].0 = idx
    }

    fn index_to_cell(&self, index: usize) -> (usize, usize) {
        (index / self.width, index % self.width)
    }

    fn cell_to_index(&self, row: usize, column: usize) -> usize {
        (row * self.width) + column
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
