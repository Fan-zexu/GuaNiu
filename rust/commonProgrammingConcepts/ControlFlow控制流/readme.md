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

# 使用循环

rust有3中循环：`loop、while、for`

## loop

```rs
fn main() {
    loop {
        println!("again!");
    }
}
```

## 循环返回值

[demo传送门](./loops/src/main.rs)

```rs
fn main() {
    let mut count = 0;
    
    let result = loop {
        count += 1;

        if count == 10 {
            break count * 2;
        }
    };

    println!("result is {result}");
}
```

关键点：可以使用`break表达式`停止循环

## 循环标签：在多个循环间消除歧义

[demo传送门](./loops/src/main.rs)

```rs
fn main() {
    let mut count = 0;
    'counting_up: loop {
        println!("count = {count}");
        let mut remaining = 10;

        loop {
            println!("remaining = {remaining}");
            if remaining == 9 {
                break;
            }
            if count == 2 {
                break 'counting_up;
            }
            remaining -= 1;
        }

        count += 1;
    }
    println!("End count = {count}");
}
```

重点：`counting_up`是外层loop的循环标签，内层循环可以通过 `break 'counting_up'`来结束外层循环。