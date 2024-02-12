# 常见编程概念

## 变量和可变性

使用`let`创建变量，**默认是不可变的**，但是可以通过`mut`字段来改成可变，如 `let mut x`

如果对默认值进行修改，则会报错：无法二次赋值。

```rs
fn main() {
    let x = 5;
    x = 6;
}
```

```sh
$ cargo run
   Compiling variables v0.1.0 (file:///projects/variables)
error[E0384]: cannot assign twice to immutable variable `x`
 --> src/main.rs:4:5
  |
2 |     let x = 5;
  |         -
  |         |
  |         first assignment to `x`
  |         help: consider making this binding mutable: `mut x`
3 |     println!("The value of x is: {x}");
4 |     x = 6;
  |     ^^^^^ cannot assign twice to immutable variable

For more information about this error, try `rustc --explain E0384`.
error: could not compile `variables` due to previous error

```

有点类似JS中 `const和let`的感觉。

### 常量

类似于不可变变量，但是区别：

- 前面不能使用`mut`

- 只能使用`const`，不能使用`let`

- 必须注明类型

- 常量只能被设置为常量表达式，而不可以是其他任何只能在运行时计算出的值。举例：`const THREE_HOURS_IN_SECENDS: u32 = 60 * 60 * 3;`

在JS中，可以这么写 `const fn = () => { // ... }` ，fn的值只有在运行时才能得到。