async function init() {
  // accessing JS memory from Wasm
  const memory = new WebAssembly.Memory({ initial: 1 });
  const importObject = {
    js: {
      mem: memory,
    },
    console: {
      log: () => {
        console.log("Just logging something!");
      },
      error: () => {
        console.error("I am just error");
      },
    },
  };

  // browser native function
  const response = await fetch("sum.wasm");
  const buffer = await response.arrayBuffer();
  const wasm = await WebAssembly.instantiate(buffer, importObject);

  const uint8Array = new Uint8Array(memory.buffer, 0, 2); // only get the first two bytes - the word "Hi"
  const hiText = new TextDecoder().decode(uint8Array);
  console.log(hiText);
}

init();
