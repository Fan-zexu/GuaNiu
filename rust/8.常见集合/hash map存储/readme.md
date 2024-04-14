# 使用 Hash Map 存储

和JS的Map类型

## 新建

使用`new`创建，使用`insert插入

```rs
use std::collections::HashMap;

let mut map = HashMap::new();

map.insert(String::from("blue"), 10);

map.insert(String::from("red"), 20);
```

## 访问

```rs
let name = String::from("blue");

let score = map.get(&name).copied().unwrap_or(0);
```

1. 通过`get`会返回 `Option<&V>`，如果没有对应值，在返回`None`

2. 通过`copied`方法返回`Option<i32>`，而不是 `Option<&i32>`，// 没理解？

3. 通过`unwrap_or`方法，如果没有找到value值，将其设置为0


也可以使用类似`Vector`方式，来遍历

```rs
for (key, value) in &map {
    println!("{key}: {value}")
}
```