# 包和Crate

## Crate

是`Rust`编译时最小的代码单位

具有两种形式：二进制项和库。二进制项可以被编译为可执行程序，比如一个命令行程序或者一个服务器。它必须包含一个`main`函数。

库没有`main`函数，也不会被编译为可执行程序。可以了解为JS中的`library`

`crate root`是一个源文件，是Rust编译器的起始点，是`crate`的根模块

## package包

提供一些列功能或者多个`crate`

一个包会包含一个`cargo.toml`文件，用来描述如何构建这些`crate`

我们用的`Cargo`工具，就是一个二进制项的包

包中最多包含一个库`crate`，或者多个二进制`crate`


`Cargo`约定：

1. `src/main.rs`就是一个与包同名的二进制`crate`的`crate`根

2. `src/lib.rs`就是一个与包同名的库`crate`的`crate`根