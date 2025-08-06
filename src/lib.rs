use wasm_bindgen::prelude::*;

// we need to mark `pub` functions that we want to export to JavaScript
#[wasm_bindgen]
pub fn greet(name: &str) {
    println!("Hi there {name}");
}
