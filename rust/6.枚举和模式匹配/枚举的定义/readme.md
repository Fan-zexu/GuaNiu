# 定义枚举

用`enum`来定义

```rs
enum IpAddrKind {
    v4,
    v6
}
```

## 枚举值

```rs
    let four = IpAddrKind::v4;
    let six = IpAddrKind::v6;
```

### 结合`struct`使用

```rs
struct IpAddr {
    kind: IpAddrKind,
    address: String,
}

let home = IpAddr {
    kind: IpAddrKind::v4,
    address: String::from("127.0.0.1"),
}
```

### 更简洁的方式

将数据直接放进枚举成员中，不借助结构体。

```rs
enum IpAddr {
    v4(String),
    v6(String)
}

let home = IpAddr::v4(String::from("127.0.0.1"));

let loopback = IpAddr::v6(String::from("::1"));
```

如果希望枚举成员可以处理不同类型和数量的数据时，也可以支持:

```rs
enum IpAddr {
    v4(u8, u8, u8, u8),
    v6(String)
}

let home = IpAddr::v4(127, 0, 0, 1);

let loopback = IpAddr::v6(String::from("::1"));
```

### 支持更多负责类型数据

示例1：

```rs
struct Ipv4Addr {
    // --snip--
}

struct Ipv6Addr {
    // --snip--
}

enum IpAddr {
    V4(Ipv4Addr),
    V6(Ipv6Addr),
}

```

示例2：

```rs
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}
```

### 使用impl为枚举定义方法

```rs
impl Message {
    fn call(&self) {
        // 定义方法体
    }
}

let m = Message::Write(String::from("hello"));

m.call();
```

### Option枚举

干啥的：用于区分空值null和非空值

在Rust中并没有空值，但缺有处理这种情况的枚举 `Option<T>`，它定义在[标准库中](https://doc.rust-lang.org/std/option/enum.Option.html)

```rs
enum Option<T> {
    None,
    Some<T>,
}
```
注意：

1. 它是一个不需要显示引入到作用域里，它被定义到prelude中（类似于全局定义）。

2. 可以直接使用`None`和`Some`，不需要类似这样调用`Option::xxx`


`<T>`是泛型，和TS中的使用类似

```rs
let some_number = Some(5);

let some_str = Some('a');

let other_number: Option<i32> = None;
```

3. `Option<T>和T`是不同类型，如下代码会编译失败：

```rs
let x: i8 = 5;
let y: Option<i8> = Some(5);

let sum = x + y;
```

这里Rust是为了防止一些看似有值但实际是空值的情况出现。

[这里](https://doc.rust-lang.org/std/option/enum.Option.html)可以看到关于`Option<T>`拥有的应对各种情况的方法。