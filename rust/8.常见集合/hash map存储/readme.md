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


## 更新hash map

### 覆盖一个值

```rs
    use std::collections::HashMap;

    let mut scores = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Blue"), 25);

    println!("{:?}", scores);  // {"Blue": 25}

```

### 在没有键值是插入键值对

```rs
use std::collections::HashMap;

let mut map = HashMap::new();

map.insert(String::from("blue"), 10);

map.entry(String::from("red")).or_insert(50);
map.entry(String::from("blue")).or_insert(50);
```

### 更新一个旧值

字符串计数

```rs
use std::collections::HashMap;

fn main() {
    let text = "hello world wonderful world";

    let mut map = HashMap::new();

    let t2 = text.split_whitespace();

    for word in text.split_whitespace() {
        let count = map.entry(word).or_insert(0);

        *count += 1;
    }

    println!("{:?}", map);
}
```

`split_whitespace`方法返回以空隔分隔`text`子`slice`的迭代器。

`or_insert`返回这个键值的一个可变引用


## 哈希函数

[官网描述](https://kaisery.github.io/trpl-zh-cn/ch08-03-hash-maps.html#%E5%93%88%E5%B8%8C%E5%87%BD%E6%95%B0)

不太理解...