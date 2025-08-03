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

## WAT - WASM files

To generate a `.wasm` file from a `.wat` file use `wat2wasm` file:

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
