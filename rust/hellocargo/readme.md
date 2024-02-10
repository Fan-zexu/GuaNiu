# Hello Cargo

> [官网](https://kaisery.github.io/trpl-zh-cn/ch01-03-hello-cargo.html)

Cargo 是 Rust 的构建系统和包管理器

## 创建项目

通过 `carge new [project_name]`来初始化一个rust工程。

目录：包括 `Cargo.toml`和`src`文件

其中`Cargo.toml`第一行`[package]`表示包信息，包括：项目名，项目版本，rust版本。第二行`[dependencies]`表明包依赖项

## 构建并运行

构建命令：`cargo build`

运行命令：`cargo run`

快速检查代码确保其可以编译，但并不产生可执行文件：`cargo check`。由于不需要生成可执行文件，所以它的速度要比`cargo build`快很多，在开发中可以用来检测代码是否可以通过编译。

## 发布release

命令：`cargo build --release`，用来优化编译项目

它会在`target/release` 而不是 `target/debug` 下生成可执行文件。这种可执行文件可以更快被执行。但是优化过程需要消耗更长时间来编译。

所以`cargo build`一般用于开发，`cargo build --release`用于生产