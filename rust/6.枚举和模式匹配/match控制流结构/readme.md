# match控制流运算符

类似于JS的`swtich case`

```rs
enum Coin {
    Penny, // 一美分
    Nickel, // 五美分
    Dime, // 十分
    Quarter, // 二十五分
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => {
            println!("Lucky penny!");
            1
        }
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}

fn main() {
    println!("cents is {}", value_in_cents(Coin::Penny));
}
```

注意：

1. `match`后面是一个表达式，可以是**任何类型**。有点类似`if`，但`if`后面必须是`bool`类型。

2. `match`的分支，由模式和一个分支代码。通过 `=>`来分隔

3. 分支代码可以用`{}`大括号，也可以不写。后面的逗号也可以省略。


## 绑定值模式

```rs
#[derive[Debug]]

enum UsState {
    Alabama,
    Alaska,
}

enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            println!("State quarter from {:?}!", state);
            25
        }
    }
}

// 调用
value_in_cents(Coin::Quarter(UsState::Alaska));
```