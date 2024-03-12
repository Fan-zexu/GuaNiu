# 结构体定义和实例化

结构体类型和TS定义比较类似，区别：

变量类型是写在 `= 号`后面

类型中用 `， 分隔`而不是分号

```rs
struct User {
    name: String,
    active: bool,
    age: u8,
}

fn main() {
    let mut user1 = User {
        active: true,
        name: String::from("somename123"),
        age: 12,
    };

    user1.name = String::from("name444");

    println!("name is {}, age is {}, active is {}", user1.name, user1.age, user1.active);
}
```

注意：Rust要求结构体整体都是可变的，不能仅将某个字段标记为可变。

## 字段初始化简写

可以在函数最后写一个表达式，来隐式返回一个构造体的实例

```rs
// 没有简化形式，参数和使用重复
fn build_user(name: String, active: bool) -> User {
    User {
        name: name,
        active: active,
        age: 12
    }
}

// 字段初始化简写
fn build_user2(name: String, active: bool) -> User {
    User {
        name,
        active,
        age: 12
    }
}
```

简写的函数和JS中es6对象简写形式类似。


## 结构体更新语法 struct update syntax

复用部分结构体的值来创建一个新的结构体。

可以使用`..`来做复用。类似JS的`...`解构运算符。

注意：`..`属于`base struct`需要放在结构体**最后**

```rs
// 原始啰嗦版
let user2 = User {
    active: user1.active,
    age: user1.age,
    name: String::from("newname"),
};

// 简化版本
let user3 = User {
    name: String::from("..newname"),
    ..user1
};
```

注意“移动move”的问题：

```rs
let user4 = User {
    ..user1
}
```

`..`就像 `=`赋值操作，会存在移动数据。在这例子中，name的String值就被从`user1`移动到`user4`中，所以`user1.name`就无效了。此时编译会报错


## 元组结构体

通过元组结构体创建类型

```rs
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0,0,0);
}
```

注意：`black和origin`值的类型不同，因为他们是不同元组的实例。即便结构体中的值类型都相同。


## 没有任何字段的类单元结构体

没看懂具体用法，摆个例子

```rs
struct AlwaysEqual;

fn main() {
    let subject = AlwaysEqual;
}
```

# String和&str区别

在 Rust 中，`String` 和 `&str` 都用于表示字符串，但它们的使用场景和特性有所不同。

1. `String` 类型：`String` 是一个可变的、拥有所有权的、堆上分配的字符串类型。你可以对 `String` 进行修改，例如添加字符、改变字符等。`String` 类型的大小在编译时是不确定的，只有在运行时才能确定。

```rust
let mut s = String::from("hello");
s.push_str(", world!");  // s 的内容变为了 "hello, world!"
```

2. `&str` 类型：`&str` 是一个字符串切片类型，通常用作函数的参数，让函数接受任何类型的字符串。它是对现有字符串的引用，不拥有所有权，因此不能对其进行修改。`&str` 类型的大小在编译时是确定的。

```rust
fn takes_slice(slice: &str) {
    println!("Got: {}", slice);
}

fn main() {
    let s = String::from("Hello, world!");

    takes_slice(&s);
}
```

总结：`String` 是一个可变的、拥有所有权的字符串类型，而 `&str` 是一个不可变的、不拥有所有权的字符串引用。