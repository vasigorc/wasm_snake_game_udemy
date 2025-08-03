(module 
  (import "console" "log" (func $log))
  (import "console" "error" (func $error))
  ;; 1 means 1 page of memory (64kB)
  (memory (import "js" "mem") 1)
  ;; In the first spot of the memory we will load "Hi" string
  (data (i32.const 0) "Hi")


  (func $sum (param $a i32) (param $b i32) (result i32)
    ;; call is a native WebAssembly instruction
    call $log
    call $error
    local.get $a
    local.get $b
    i32.add
  )
  (export "sum" (func $sum))
)
