# 使用字符串储存 UTF-8 编码的文本

## 字符串概念

在Rust核心语言中只有一种字符串类型：字符串`slice str`，通常以借用形式出现`&str`

字符串`String`类型由Rust标准库提供。不是核心语言范畴。它是一种可增长、可变、可拥有、UTF-8编码的字符串类型。

## 新建字符串

和`Vec<T>`类似，创建一个空的String

```rs
let mut s = String::new();
```

使用`to_string方法，从字符串字面值创建`String`。`to_string`方法能用于任何实现了`Display trait`的类型。

```rs
let data = "hello world";

let s = data.to_string();

// 也可以直接创建
let s = "hello world".to_string();
```

这也等同于使用`String::from`创建

```rs
let s = String::from("hello world");
```

## 更新字符串

### push_str 和 push

```rs
let mut s = String::from("hello");

s.push_str("world");

println!("s is {s}");

// 这里 push_str 并不会获取 s2的所有权，所以后面还可以继续访问到s2
let s2 = "oh my";

s.push_str(s2);

println!("s2 is {s2}");

println!("s is {s}");

let mut s3 = String::from("lo");

s3.push('l');

println!("s3 is {s3}");
```

- `push_str`既可以传入字符，也可以传入变量
/ad/wmafe/micro/h5/isomor_recharge/js
- `push`只能传入字符

### 使用`+`运算符或 `format!`宏拼接字符串

两个字符串拼接

```rs
let s1 = String::from("hello,");
let s2 = String::from("world");
let s3 = s1 + &s2; // 注意 s1 被移动了，不能继续使用
```

这里 `+`背后调用了 `add`函数，类似这样

```rs
fn add(self, &str) -> String {}
```

1. 其中`self`没有`&`，非引用，所以会转移`s1`的所有权，导致在运算之后，`s1`被回收无法使用。

2. 参数`s2`是`&String`类型，并非`&str`类型，但没有报编译失败，原因是`add`函数中有对于`&String` 到`&str`的类型强转 (deref coercion)


多个字符串拼接，可以用使用 `format`宏

```rs
let s1 = String::from("a");
let s2 = String::from("b");
let s3 = String::from("c");

let s4 = format!("{s1}-{s2}-{s3}");
```


## 索引字符串

```rs
let s1 = String::from("hello");

let h = s1[0];
```

编译会报错

[原因详看官网](https://kaisery.github.io/trpl-zh-cn/ch08-02-strings.html#%E7%B4%A2%E5%BC%95%E5%AD%97%E7%AC%A6%E4%B8%B2)


## 字符串slice

可以获取明确特定字节的`字符串slice`

```rs
let hello = "Здравствуйте";
let s = &hello[0..4];
```

这里一个字母是2个字节