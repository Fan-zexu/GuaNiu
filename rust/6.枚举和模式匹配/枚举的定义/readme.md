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
    v4: (u8, u8, u8, u8),
    v6: String
}

let home = IpAddr::v4(127, 0, 0, 1);

let loopback = IpAddr::v6(String::from("::1"));
```

