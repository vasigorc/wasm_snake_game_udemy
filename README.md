# Web Assembly with Rust: Snake Game

This is my walk-through of [this Udemy course](https://www.udemy.com/course/rust-webassembly-with-js-ts-the-practical-guide/?couponCode=ST18MT12125CROW)
that features creation of a [Snake Game](<https://en.wikipedia.org/wiki/Snake_(video_game_genre)>) using the following technology stack:

- WebAssembly
- Rust
- TypeScript
- NodeJS

## Prerequisites

A few dependencies are required to work with all of the above technologies. While it is possible to install / import them,
I've preferred using Nix shell: specifically my dynamic Nix shell environment configuration from [here](https://github.com/vasigorc/bash-utils/tree/main/nix).

TL;DR this is how I have all of the required technology with a single command:

```shell
nix-shell ~/repos/bash-utils/nix/combined.nix
```

Then I can use it, for example, to generate a NPM project (actually required from within `www` directory):

```shell
[nix-shell:~/repos/wasm_snake_game_udemy]$ npm install --save-dev webpack-dev-server
```

## Running the development server

```shell
[nix-shell:~/repos/wasm_snake_game_udemy/www]$ npm run dev

> www@1.0.0 dev
> webpack-dev-server

<i> [webpack-dev-server] Project is running at:
<i> [webpack-dev-server] Loopback: http://localhost:8080/, http://[::1]:8080/
<i> [webpack-dev-server] On Your Network (IPv4): http://172.18.0.1:8080/
<i> [webpack-dev-server] Content not from webpack is served from '/home/vasilegorcinschi/repos/wasm_snake_game_udemy/www/public' directory
asset index.js 166 KiB [emitted] (name: main)
runtime modules 27.4 KiB 12 modules
...
```

## Building the app

This will pack everything together under `www/public` folder:

```bash
npm run build

> www@1.0.0 build
> webpack build

asset index.js 2.54 KiB [emitted] (name: main)
asset index.html 394 bytes [emitted] [from: index.html] [copied]
./index.js 1.32 KiB [built] [code generated]
webpack 5.97.1 compiled successfully in 48 ms
```

### WAT - WASM files

At the stage of introduction to WebAsembly, to generate a `.wasm` file from a `.wat` file we used `wat2wasm` file:

```shell
wat2wasm hellolog.wat
```

In order to analyze the binary `.wasm` file, use `wasm-objdump` tool, e.g.:

```shell
wasm-objdump -x sum.wasm

sum.wasm: file format wasm 0x1

Section Details:

Type[2]:
 - type[0] () -> nil
 - type[1] (i32, i32) -> i32
Import[2]:
 - func[0] sig=0 <console.log> <- console.log
 - func[1] sig=0 <console.error> <- console.error
Function[1]:
 - func[2] sig=1 <sum>
Export[1]:
 - func[2] <sum> -> "sum"
Code[1]:
 - func[2] size=11 <sum>
```

Both `wat2wasm` and `wasm-objdump` are available through Nix, but can alternatively installed separately.

There is also the inverse command that allows you to see the WebAssembly code for a generated `.wasm` file. This could
be useful when taking a peek into [wasm-bindgen](https://docs.rs/wasm-bindgen/latest/wasm_bindgen/) generated files:

```bash
wasm2wat pkg/wasm_snake_game_udemy_bg.wasm | tail -9
  (export "memory" (memory 0))
  (export "greet" (func 22))
  (export "__wbindgen_export_0" (table 1))
  (export "__wbindgen_malloc" (func 31))
  (export "__wbindgen_realloc" (func 33))
  (export "__wbindgen_start" (func 0))
  (elem (;0;) (i32.const 1) func 44 39 34 48 44 8 54 23 55 24 25 13 58 36 26 14 57 19 11 56 47 46 50 27 49 59 35 20 15 18 62 41 51 43 52)
  (data (;0;) (i32.const 1048576) "Hi there \0a\00\00\00\00\10\00\09\00\00\00\09\00\10\00\01\00\00\00Lazy instance has previously been poisoned\00\00\1c...")
  (data (;1;) (i32.const 1052036) "\02"))
```

### wasm-pack

`wasm-pack` (installed via `cargo install wasm-pack --force`) is a tool that was used to compile
🦀 code into JavaScript target:

```bash
wasm-pack build --target web
[INFO]: 🎯  Checking for the Wasm target...
[INFO]: 🌀  Compiling to Wasm...
    ...
   Compiling wasm_snake_game_udemy v0.1.0 (/home/vasilegorcinschi/repos/wasm_snake_game_udemy)
    Finished `release` profile [optimized] target(s) in 2.51s
[INFO]: ⬇️  Installing wasm-bindgen...
[INFO]: Optimizing wasm binaries with `wasm-opt`...
[INFO]: Optional fields missing from Cargo.toml: 'description', 'repository', and 'license'. These are not necessary, but recommended
[INFO]: ✨   Done in 7.63s
[INFO]: 📦   Your wasm pkg is ready to publish at /home/vasilegorcinschi/repos/wasm_snake_game_udemy/pkg.
```

The Wasm package would contain the following files as the result of the previous command:

```bash
ls -lah pkg
total 60K
drwxr-xr-x 2 vasilegorcinschi vasilegorcinschi 4.0K Aug  5 23:13 .
drwxrwxr-x 7 vasilegorcinschi vasilegorcinschi 4.0K Aug  5 23:17 ..
-rw-r--r-- 1 vasilegorcinschi vasilegorcinschi    1 Aug  5 23:13 .gitignore
-rw-r--r-- 1 vasilegorcinschi vasilegorcinschi  321 Aug  5 23:13 package.json
-rw-rw-r-- 1 vasilegorcinschi vasilegorcinschi 2.6K Aug  5 23:13 README.md
-rw-r--r-- 1 vasilegorcinschi vasilegorcinschi  23K Aug  5 23:13 wasm_snake_game_udemy_bg.wasm
-rw-r--r-- 1 vasilegorcinschi vasilegorcinschi  386 Aug  5 23:13 wasm_snake_game_udemy_bg.wasm.d.ts
-rw-r--r-- 1 vasilegorcinschi vasilegorcinschi 1.4K Aug  5 23:13 wasm_snake_game_udemy.d.ts
-rw-r--r-- 1 vasilegorcinschi vasilegorcinschi 5.5K Aug  5 23:13 wasm_snake_game_udemy.js
```

- All of the code is automatically marked to be ignored in the generated `.gitignore` file.

### TypeScript confirguration

TypeScript confirguration for a `webpack` project was inspired from the official [webpack guide](https://webpack.js.org/guides/typescript/).
