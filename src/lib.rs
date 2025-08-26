use std::iter::from_fn;

use wasm_bindgen::prelude::*;
use wee_alloc::WeeAlloc;

// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

// bind an external JS function
#[wasm_bindgen(module = "/www/utils/rnd.js")]
extern "C" {
    fn rnd(max: usize) -> usize;
}

#[wasm_bindgen]
#[derive(PartialEq)]
pub enum Direction {
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
    next_cell: Option<SnakeCell>,
    reward_cell: usize,
}

#[wasm_bindgen]
impl World {
    pub fn new(width: usize, snake_idx: usize) -> World {
        let snake = Snake::new(snake_idx, 3);
        let size = width.pow(2);

        World {
            width,
            reward_cell: World::generate_reward_cell(size, &snake.body),
            snake,
            size,
            next_cell: None,
        }
    }

    fn generate_reward_cell(max: usize, snake_body: &[SnakeCell]) -> usize {
        from_fn(|| Some(rnd(max)))
            .find(|&cell| !snake_body.contains(&SnakeCell(cell)))
            .unwrap()
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn reward_cell(&self) -> usize {
        self.reward_cell
    }

    pub fn snake_head_idx(&self) -> usize {
        self.snake.body[0].0
    }

    pub fn change_snake_direction(&mut self, direction: Direction) {
        let next_cell = self.generate_next_snake_cell(&direction);

        if self.snake.body[1].0 == next_cell.0 {
            return;
        }

        self.next_cell = Some(next_cell);
        self.snake.direction = direction;
    }

    pub fn snake_length(&self) -> usize {
        self.snake.body.len()
    }

    // cannot return a reference to JS because of borrowing rules
    // so we will return it as a raw pointer
    // *const - is a raw pointer
    // raw pointers are heavily used in the interoperation of languages
    // borrowing rules don't apply in this case
    pub fn snake_cells(&self) -> *const SnakeCell {
        self.snake.body.as_ptr()
    }

    pub fn step(&mut self) {
        let temp = self.snake.body.clone();

        match self.next_cell {
            Some(cell) => {
                self.snake.body[0] = cell;
                self.next_cell = None;
            }
            None => {
                self.snake.body[0] = self.generate_next_snake_cell(&self.snake.direction);
            }
        }

        let len = self.snake.body.len();

        (1..len).for_each(|i| {
            self.snake.body[i] = SnakeCell(temp[i - 1].0);
        });

        if self.reward_cell == self.snake_head_idx() {
            // Push the new cell to the snake body
            // In the next iteration of `step` the indices will be spread out correctly again
            self.snake.body.push(SnakeCell(self.snake.body[1].0));
        }
    }

    fn generate_next_snake_cell(&self, direction: &Direction) -> SnakeCell {
        let snake_idx = self.snake_head_idx();
        let row = snake_idx / self.width;

        match direction {
            Direction::Right => {
                let threshold = (row + 1) * self.width; // last cell index in this row
                if snake_idx + 1 == threshold {
                    SnakeCell(threshold - self.width)
                } else {
                    SnakeCell(snake_idx + 1)
                }
            }
            Direction::Left => {
                let threshold = row * self.width; // first cell index in this row
                if snake_idx == threshold {
                    SnakeCell(threshold + (self.width - 1))
                } else {
                    SnakeCell(snake_idx - 1)
                }
            }
            Direction::Up => {
                let threshold = snake_idx - (row * self.width);
                if snake_idx == threshold {
                    SnakeCell((self.size - self.width) + threshold)
                } else {
                    SnakeCell(snake_idx - self.width)
                }
            }
            Direction::Down => {
                let threshold = snake_idx + ((self.width - row) * self.width);
                if snake_idx + self.width == threshold {
                    SnakeCell(threshold - ((row + 1) * self.width))
                } else {
                    SnakeCell(snake_idx + self.width)
                }
            }
        }
    }
}

#[derive(Clone, Copy, PartialEq)]
pub struct SnakeCell(usize);

struct Snake {
    body: Vec<SnakeCell>,
    direction: Direction,
}

impl Snake {
    fn new(spawn_index: usize, size: usize) -> Snake {
        let body = (0..size)
            .map(|index| SnakeCell(spawn_index - index))
            .collect::<Vec<SnakeCell>>();
        Snake {
            body,
            direction: Direction::Right,
        }
    }
}
