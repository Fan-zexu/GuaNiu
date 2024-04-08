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