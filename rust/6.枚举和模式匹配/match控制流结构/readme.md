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

## 匹配Option<T>

```rs
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

fn main() {
    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);

    println!("six is {:?}", six);

    println!("none is {:?}", none);
}
```

## 匹配是穷尽的

比如，如果`match`的分支中只有`Some<T>`，并没有`None`，编译器会报错，提示匹配缺失。

## 通配符模式

```rs
let dice_roll = 9;
match dice_roll {
    3 => addFn(),
    5 => removeFn(),
    other => nothing(other),
}
```

`other`就属于通配符，表示3和5之外的所有。

注意：

1. 如果在other后面再定义分支，编译会警告，提示后面定义的分支不会被匹配到

## _占位符模式

```rs
let dice_roll = 9;
match dice_roll {
    3 => addFn(),
    5 => removeFn(),
    _ => again(),
}
```

当我们不想使用通配符模式，还可以使用_占位符，表示可以匹配任意值，但是不绑定该值。

比如当我们匹配到3和5之外的值时，做一次重置，它不需要用到dic_roll的值。

如果匹配到3和5之外时，不做任何操作，那么可以用空元组

```rs
mach dice_roll {
    3 => addFn(),
    5 => remove(),
    _ => (),
}
```