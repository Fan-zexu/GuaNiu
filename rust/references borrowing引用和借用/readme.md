# 引用和借用

> [官网](https://kaisery.github.io/trpl-zh-cn/ch04-02-references-and-borrowing.html#%E5%BC%95%E7%94%A8%E4%B8%8E%E5%80%9F%E7%94%A8)

这个是所有权中元组使用的例子。

由于`s1(String)`被移动到`calculate_length`函数中，导致`s1(String)`失效，如果想要后续`println!`中继续使用，需要将它再返回出来。

```rs
fn main() {
    let s1 = String::from("hello");

    let (s2, len) = calculate_length(s1);

    println!("length of {} is {}", s2, len);
}

fn calculate_length(s: String) -> (String, usize) {
    let length = s.len();

    (s, length) // 不加分号表示返回值
}
```

这里可以使用“引用”能力，引用类似于一个指针，但与指针有所不同。通过引用地址，可以访问到储存于该地址的属于其他变量的数据。

TODO 引用和指针的区别

引用可以用 `&` 表示，重写上面的例子：

```rs
fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(&s1);

    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len() // 这里不加 ; 表示 return s.len();
}
```