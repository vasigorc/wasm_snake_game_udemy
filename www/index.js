async function init() {
  const byteArray = new Int8Array([
    // Magic number (0x00 0x61 0x73 0x6D)
    0x00,
    0x61,
    0x73,
    0x6d,
    // Version (0x01 0x00 0x00 0x00)
    0x01,
    0x00,
    0x00,
    0x00,

    // Type section (1)
    0x01,
    0x07,
    // Number of types
    0x01,
    // Function type
    0x60,
    // Number of parameters
    0x02,
    // Parameter types (i32, i32)
    0x7f,
    0x7f,
    // Number of results
    0x01,
    // Result type (i32)
    0x7f,

    // Function section (3)
    0x03,
    0x02,
    // Number of functions
    0x01,
    // Function 0 signature index
    0x00,

    // Export section (7)
    0x07,
    0x07,
    // Number of exports
    0x01,
    // Export name length
    0x03,
    // Export name "sum"
    0x73,
    0x75,
    0x6d,
    // Export kind (function)
    0x00,
    // Export function index
    0x00,

    // Code section (10)
    0x0a,
    0x09,
    // Number of functions
    0x01,
    // Function body size
    0x07,
    // Number of locals
    0x00,
    // Instructions
    0x20,
    0x00, // local.get 0
    0x20,
    0x01, // local.get 1
    0x6a, // i32.add
    0x0b, // end
  ]);
  const wasm = await WebAssembly.instantiate(byteArray.buffer);
  const sumFunction = wasm.instance.exports.sum;
  const result = sumFunction(100, 1000);
  console.log(result);
}

init();
