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

结合`struct`使用

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