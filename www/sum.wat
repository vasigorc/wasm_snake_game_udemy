(module 
  (import "console" "log" (func $log))
  (import "console" "error" (func $error))
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
