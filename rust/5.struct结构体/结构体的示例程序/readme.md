# 实现一个长方形面积计算

## 原始版本

```rs
fn main() {
    let w1 = 30;
    let h1 = 50;

    println!(
        "area is {}",
        area(w1, h1)
    )
}

fn area(w: u32, h: u32) -> u32 {
    w * h
}
```

## 利用元组优化

由于入参长宽是有关联的，所以可以用元组来增强可读性。

```rs
fn main() {
    let rect1 = (30, 50);

    println!(
        "area is {}",
        area(rect1)
    )
}

fn area(data: (u32, u32)) -> u32 {
    data.0 * data.1
}

```

## 结构体重构

元组参数的问题在于，它不提供元素名称，所以不明确哪个是长、哪个是宽

```rs
#[derive(Debug)]

struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "area is {}",
        area(&rect)
    );

    // dbg宏，结果输出在 stderr，标准错误控制台
    dbg!(&rect);

    // println宏，结果输出在 stdout，标准输出控制台
    println!("rect is {:?}", rect);
}

fn area(rectangle: &Rectangle) -> u32 {
    rectangle.width * rectangle.height
}
```

注意：

1. 函数签名和调用都使用了`&`，所以这里`rectangle`的类型是一个结构体`Rectangle`实例的**不可变借用**

由于我们希望只是借用结构体，而不是获取它的所有权，这样main函数就可以保持`rect`的所有权并继续使用它。如果去掉`&`，

则`rect会失效，println!("rect is {:?}", rect);`会编译报错。

2. 对于输出信息的方式，除了使用`println!`之外，还可以使用`dbg!`宏，同时还需要使用`#[derive[Debug]]`，来显式选择使用打印功能。

