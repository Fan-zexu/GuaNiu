# if 表达式

基本语法如下。其中条件值必须是`bool`类型，否则报错。

rust并不会像JS中一样，将非布尔值转换成布尔类型

```rs
fn main() {
    let number = 3;
    if number < 5 {
        println!("condition is true");
    } else {
        println!("condition is false");
    }
}
```

## else if

```rs
fn main() {
    let number = 6;
    if number % 4 == 0 {
        println!("number is divisible by 4");
    } else if number % 3 == 0 {
        println!("number is divisible by 3");
    } else if number % 2 == 0 {
        println!("number is divisible by 2");
    } else {
        println!("number is not divisible by 4, 3, or 2");
    }
}
```

## let中使用if

由于if是一个表达式，所以它可以被赋值给变量。如下

```rs
fn main() {
    let condition = true;
    let number = if condition { 3 } else { 6 };

    println!("number is {number}");
}
```

注意：

1. 代码块的值是最后一个表达式的值，而数字本身就是一个表达式。

2. if的每个分支的值的类型都必须相同，如果不同则会编译报错。