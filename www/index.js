const fs = require("fs");

async function init() {
  const wasmBuffer = fs.readFileSync("sum.wasm");
  const byteArray = new Int8Array(wasmBuffer);
  // const byteArray = new Int8Array([
  //   0, 97, 115, 109, 1, 0, 0, 0, 1, 7, 1, 96, 2, 127, 127, 1, 127, 3, 2, 1, 0, 7, 7, 1, 3, 115, 117,
  //   109, 0, 0, 10, 9, 1, 7, 0, 32, 0, 32, 1, 106, 11,
  // ]);
  const wasm = await WebAssembly.instantiate(byteArray.buffer);
  const sumFunction = wasm.instance.export.sum;
  const result = sumFunction(100, 1000);
  console.log(result);
}

init();
