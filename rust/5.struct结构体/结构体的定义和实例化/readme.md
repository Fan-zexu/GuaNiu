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