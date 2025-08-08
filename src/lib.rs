use wasm_bindgen::prelude::*;

// we need to mark `pub` functions that we want to export to JavaScript
#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(name);
}

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

