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

`&`表示**引用**，它允许你使用值，但不获取所有权

例子中，`&s1`表示创建一个指向`s1`变量的引用，但不拥有它的所有权，所以当`s1`发生”移动“后，不会出现变量失效情况。

同理，函数参数 `&String`表示对 String的引用

```rs
fn calculate_length(s: &String) -> usize { // s 是 String 的引用
    s.len()
} // 这里，s 离开了作用域。但因为它并不拥有引用值的所有权，
  // 所以什么也不会发生
```

## 不可变引用

和定义变量一样，`&`创建的引用默认是不可变的。例子

```rs
fn main() {
    let s1 = String::from("hello");

    change_s(&s1);
}

fn change_s(s: &String) {
    s.push_str(", world");
}
```

直接修改引用，编译会报错:

```sh
$ cargo run
   Compiling ownership v0.1.0 (file:///projects/ownership)
error[E0596]: cannot borrow `*some_string` as mutable, as it is behind a `&` reference
 --> src/main.rs:8:5
  |
7 | fn change(some_string: &String) {
  |                        ------- help: consider changing this to be a mutable reference: `&mut String`
8 |     some_string.push_str(", world");
  |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ `some_string` is a `&` reference, so the data it refers to cannot be borrowed as mutable

For more information about this error, try `rustc --explain E0596`.
error: could not compile `ownership` due to previous error
s
```

## 可变引用 mutable reference

和可变变量类似，可以用 `&mut`来创建可变引用，同时s1也需要加mut

```rs
fn main() {
    let mut s1 = String::from("hello");

    change_s(&mut s1);
}

fn change_s(s: &mut String) {
    s.push_str(", world");
}
```

注意：函数参数也需要添加`&mut`来变成可变引用。


### 可变引用的一个限制

