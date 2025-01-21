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
~/repos/bash-utils/nix/dynamic-nix-shell.sh compiled js
unpacking 'https://github.com/NixOS/nixpkgs/archive/107d5ef05c0b1119749e381451389eded30fb0d5.tar.gz' into the Git cache...
info: using existing install for 'stable-x86_64-unknown-linux-gnu'
info: default toolchain set to 'stable-x86_64-unknown-linux-gnu'

  stable-x86_64-unknown-linux-gnu unchanged - rustc 1.79.0 (129f3b996 2024-06-10)

[nix-shell:~/repos/wasm_snake_game_udemy]$ 
```

Then I can use it, for example, to generate a NPM project (actually required from within `www` directory):

```shell
[nix-shell:~/repos/wasm_snake_game_udemy]$ npm install --save-dev webpack-dev-server
```

or this is how I was able to generate a binary `.wasm` file from a `.wat` textual file for WebAssembly:

```shell
[nix-shell:~/repos/wasm_snake_game_udemy]$ cd www

[nix-shell:~/repos/wasm_snake_game_udemy/www]$ wat2wasm sum.wat
[nix-shell:~/repos/wasm_snake_game_udemy/www]$ ls -halF | grep "sum.*"
-rw-r--r--   1 vasilegorcinschi vasilegorcinschi   41 Jan 21 17:25 sum.wasm
-rw-rw-r--   1 vasilegorcinschi vasilegorcinschi  145 Jan 17 17:06 sum.wat
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
