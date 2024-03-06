# Slice 类型

## 引子

> [官网](https://kaisery.github.io/trpl-zh-cn/ch04-03-slices.html)

`slice`允许你引用集合中一段连续的元素序列，而不用引用整个集合。它是一个引用，所以它没有所有权

官方示例，一个空格分隔的字符串，获取其中第一个单词

```rs
fn first_word(s: &String) -> usize {
    // as_bytes 将s转成 字节数组
    let bytes = s.as_bytes();

    // iter() 创建一个迭代器，可以遍历
    // enumerate() 包装iter的结果，返回一个元组 -> (元素索引, 元素引用)
    for (i, &item) in bytes.iter().enumerate() {

        // rust中 b用来创建字节字面量， b' '表示空格字符的字节值
        if item == b' ' {
            return i;
        }
    }

    s.len()
}

```

> b' '，表示空格字符的字节值：
在计算机中，每个字符都对应一个ASCII码，这个ASCII码在内存中以字节的形式存储。空格字符的ASCII码是32，以字节形式表示就是b' '。所以"空格字符的字节值"就是指空格字符对应的ASCII码的字节表示。


## 字符串 slice

(string slice) String中一部分值的引用

```rs
let s = String::from("hello world");

let hello = &s[0..5];
let hello = &s[..5]  // 索引从0开始，可以不写0，这样也可以

let world = &s[6..11];
let world = &s[6..] // 如果索引包含String最后一个字节，则可以舍弃尾部数字
```

再可以舍弃两端的数字，来获取整个字符串

```rs
let s = String::from("hello");

let len = s.len();

let slice = &s[0..len];

let slice = &s[..]
```