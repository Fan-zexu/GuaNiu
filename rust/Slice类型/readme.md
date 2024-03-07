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

利用`slice`重写`first_word`方法

```rs
fn main() {
    let s = String::from("hello world");

    let word = first_word(&s);

    println!("first word is {}", word)
}

fn first_word(s: &String) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[..i];
        }
    }

    &s[..]
}
```

这样会报错：

```rs
fn main() {
    let s = String::from("hello world");

    let word = first_word(&s); // 这里&s是一个不可变引用

    // 增加了清除功能
    s.clear(); // 这里的s是一个可变引用

    println!("first word is {}", word); // 这里的word是一个不可变引用
}
```

原因：借用规则，当拥有某值的不可变引用时，就不能再获取一个可变引用。

`s.clear()`为了清空String，所以这里它尝试获取一个可变引用。

但是println!中的word是第一个不可变引用。

所以两者与rust规则冲突，则会编译报错


### 字符串字面值就是 slice

字符串字面值被存储在二进制文件中

```rs
let s = "hello world";
```

这里s的类型是 `&str`：它是一个指向二进制程序特定位置的slice，`&str`它是不可变引用，所以字符串字面值是不可变的。

### 字符串字面值作为参数

```rs
fn first_word(s: &String) -> &str {}

// 也可以这么定义

fn first_word(s: &str) -> &str {}
```

总结：

- 如果有一个字符串slice ，可以直接传递它

- 如果有一个String，可以传递整个String的slice

- 直接传递String的引用

```rs
fn main() {
    let my_string = String::from("hello world");

    // 可以传入 String的slice，全部或部分
    let word = first_word(&my_string[..]);
    let word = first_word(&my_string[0..6]);

    // 可以传入 String的引用，这等价于 整个String的slice
    let word = first_word(&my_string);

    let my_string_literal = "hello world";

    // 可以传入字符串字面量的slice
    let word = first_world(&my_string_literal[..]);
    let word = first_world(&my_string_literal[0..6]);

    // 字符串字面值就等价于字符串slice，所以可以不使用slice语法
    let word = first_world(my_string_literal);
}
```
