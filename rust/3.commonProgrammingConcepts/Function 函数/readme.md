# 函数

命名风格：`snake case`，以小写和下划线分隔组成

```rs
fn main() {
    println!("hello world");

    another_function();
}

fn another_function() {
    println!("another function");
}
```

`another_function`函数可以定义在`main`之前或之后，没有前后限制，只要是在一个作用域内就可以。

## 参数 parameters

和TS用法基本一致，其中`println!`这个宏指令中可以以`{变量}`形式输出参数变量。

```rs
fn main() {
    another_function(1, 'hhh');
}

fn another_function(value: i32, label: char) {
    println!("another function parameters is {value}, {label}");
}
```

## 声明(语句)和表达式 Statements & Expressions

**语句Statements**是执行一些操作但不返回值的指令。 

**表达式Expressions**计算并产生一个值。让我们看一些例子

```rs
fn main() {
    let y = {
        let x = 3;
        x + 1
    }
    println!("value is {y}");
}
```

这里`{}`块也是一个表达式

```rs
{
    let x = 3;
    x + 1
}
```

* **重点**：`x + 1`这里结尾没有`分号;`，所以是一个表达式。如果有分号 `x + 1;` 那就变成一个语句了。

所以{}块内返回值是4，然后将4绑定给外面的变量y

## 具有返回值的函数

```rs
fn five() -> i32 {
    5
}

fn main() {
    let x = five();
    println!("x value is {x}")
}
```

注意：

1. `five`函数里没有调用函数，宏，或者let语句，只有5，这里并没有分号结尾。

2. 用 `->`来声明返回值类型。TS中，`five():number`

3. 在rust中除了结尾隐式返回表达式之外，还可以中途通过`return`值的形式返回，和JS一致

`Error`：下面这个代码，由于结尾使用分号，会有报错

```rs
fn main() {
    let x = plus_one(5);

    println!("The value of x is: {x}");
}

fn plus_one(x: i32) -> i32 {
    x + 1;
}
```

```sh
$ cargo run
   Compiling functions v0.1.0 (file:///projects/functions)
error[E0308]: mismatched types
 --> src/main.rs:7:24
  |
7 | fn plus_one(x: i32) -> i32 {
  |    --------            ^^^ expected `i32`, found `()`
  |    |
  |    implicitly returns `()` as its body has no tail or `return` expression
8 |     x + 1;
  |          - help: remove this semicolon

For more information about this error, try `rustc --explain E0308`.
error: could not compile `functions` due to previous error

```