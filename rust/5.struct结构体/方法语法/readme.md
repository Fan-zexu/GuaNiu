# 方法语法

定义在结构体中，第一个参数总是`self`，代表调用该方法的结构体实例

```rs

#[derive(Debug)]

struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "impl fn area return {:?}",
        rect.area()
    )

}
```
注意几个点：

1. 这里，`impl Rectangle`中的内容会与`struct Rectangle`相关联。

？是否可以理解为`impl Rectangle`定义的内容，实际就是对`struct Rectangle`的扩展

2. 使用`&self`来代替`rectangle: &Rectangle`，`&self`实际是`self: &Self`的缩写... 不太理解，放一段官方描述

>在 area 的签名中，使用 &self 来替代 rectangle: &Rectangle，&self 实际上是 self: &Self 的缩写。在一个 impl 块中，Self 类型是 impl 块的类型的别名。方法的第一个参数必须有一个名为 self 的Self 类型的参数，所以 Rust 让你在第一个参数位置上只用 self 这个名字来简化。注意，我们仍然需要在 self 前面使用 & 来表示这个方法借用了 Self 实例，就像我们在 rectangle: &Rectangle 中做的那样。方法可以选择获得 self 的所有权，或者像我们这里一样不可变地借用 self，或者可变地借用 self，就跟其他参数一样。


---

方法名可以与结构体字段相同，例子：

```rs
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn width(&self) -> bool {
        self.width > 0
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50
    };

    // 有圆括号，调用的是方法
    if rect1.width() {
        println!("width is {}", rect1.width); // 没有括号，就代表使用字段
    }
}
```

注意：`struct`和`impl`成对出现？

## 多参数方法

第一个参数`&self`是调用方法的实例本身，第二个参数是另一个实例 `&Rectangle`。

再在`impl`中实现`can_hold`方法，同时返回一个布尔值

```rs
truct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn width(&self) -> bool {
        self.width > 0
    }

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50
    };

    let rect2 = Rectangle {
        width: 10,
        height: 40
    };

    let rect3 = Rectangle {
        width: 40,
        height: 60
    };
    
    println!("Can rect1 hold rect2? {}", rect1.can_hold(&rect2));
    println!("Can rect1 hold rect3? {}", rect1.can_hold(&rect3));
}
```

## 关联函数

所有定义在`impl`中的函数，都被叫做“关联函数”(associated functions)，因为它们与`impl`后面命名的类型相关。

可以定义一个不以`self`为参数的函数（所以不是方法）。类似这样的函数是 String类型上定义的 `String::from`函数。

```rs
impl Rectangle {
    fn square(size: u32) -> Self {
        Self {
            width: size,
            height: size,
        }
    }
}

fn main() {
    let sq = Rectangle::square(3);
    
    dbg!(&sq);
}
```