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