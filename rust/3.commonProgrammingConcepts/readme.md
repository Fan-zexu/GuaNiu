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


### 隐藏 shadowing

允许定义一个同名变量作为一个`新变量`。可以存在多个相同名称变量，但编译器只会看到最后一个，之前的都会被”遮蔽“

> 这里新变量是关键，新变量可以定义不同类型。

官方例子：

```rs
fn main() {
    let x = 5;

    let x = x + 1;

    {
        let x = x * 2;
        println!("The value of x in the inner scope is: {x}");
    }

    println!("The value of x is: {x}");
}

// 编译输出

The value of x in the inner scope is: 12
The value of x is: 6
```

解释：

这个程序首先将 x 绑定到值 5 上。

接着通过 let x = 创建了一个新变量 x，获取初始值并加 1，这样 x 的值就变成 6 了。

然后，在使用花括号创建的内部作用域内，第三个 let 语句也隐藏了 x 并创建了一个新的变量，将之前的值乘以 2，x 得到的值是 12。

当该作用域结束时，内部 shadowing 的作用域也结束了，x 又返回到 6。

`隐藏与mut的区别`

1. 使用隐藏时，如果对变量赋值时没有使用`let`关键字，则会编译报错。但是`mut`使用则不会。

2. 当再次使用`let`时，实际上是新创建一个变量，新变量可以重新定义`类型`

一个官方例子：

```rs
let spaces = "    ";
let spaces = spaces.len();
```

注释：

一种场景，先获取用户输入的空格，之后再将空格长度存储。

此时，第一个`spaces`是字符串类型，第二个spaces是数字类型，使用遮蔽后，就可以复用变量名，就不需要再多余创建类似`spaces_str`和`spaces_num`的变量。

但如果这里我们使用`mut`来赋值，则会有类型的编译报错：

```rs
let mut spaces = "    ";
spaces = spaces.len();
```

```rs
$ cargo run
   Compiling variables v0.1.0 (file:///projects/variables)
error[E0308]: mismatched types
 --> src/main.rs:3:14
  |
2 |     let mut spaces = "   ";
  |                      ----- expected due to this value
3 |     spaces = spaces.len();
  |              ^^^^^^^^^^^^ expected `&str`, found `usize`

For more information about this error, try `rustc --explain E0308`.
error: could not compile `variables` due to previous error

```