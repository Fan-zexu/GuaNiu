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