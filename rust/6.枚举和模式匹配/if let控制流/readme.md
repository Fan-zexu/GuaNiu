# if let

想打印出`Some`中的值，但是不需要关心`None`

```rs
fn main () {
    let config_max = Some(3u8);
    match config_max {
        Some(max) => {
            println!("max is {}", max)
        },
        _ => (),
    }
}
```

- `3u8`是一个字面量，表示一个8位无符号整数，其值是3。`u8`表示0-255的整数，用这种类型来表示数字3

- `_ => ()`，是为了满足`match`穷举的特性

更简介的方式：

```rs
let config_max = Some(3u8);

if let Some(max) = config_max {
    println!("max is {}", max);
}
```

这里通过`=`等号，分隔一个表达式（`match config_max`部分），一个模式（对应第一个分支，Some(max)）。

如果没有匹配到，`if let`不会执行


# 总结

可以理解`if let`是`match`的一个语法糖，如果需要只匹配一种模式，而可以忽略其他时，可以用它来简化写法。