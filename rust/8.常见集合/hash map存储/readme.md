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

## hash map和所有权

```rs
use std::collections::HashMap;

let name = String::from("color");
let value = String::from("blue");

let mut map = HashMap::new();

map.insert(name, value);

// 这里使用`name`和`value`，都是无效的。
```

调用`insert`后，变量就被移动到HashMap中，所以无法再次失效。

除非用`&`，传入引用