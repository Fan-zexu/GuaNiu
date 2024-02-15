# 函数

命名风格：`snake case`，以小写和下划线分隔组成

```rs
fn main() {
    println!("hello world");

    another_function();
}

fn another_function() {
    println!("another function");
}
```

`another_function`函数可以定义在`main`之前或之后，没有前后限制，只要是在一个作用域内就可以。

## 参数 parameters

和TS用法基本一致，其中`println!`这个宏指令中可以以`{变量}`形式输出参数变量。

```rs
fn main() {
    another_function(1, 'hhh');
}

fn another_function(value: i32, label: char) {
    println!("another function parameters is {value}, {label}");
}
```

## 声明(语句)和表达式 Statements & Expressions

**语句Statements**是执行一些操作但不返回值的指令。 

**表达式Expressions**计算并产生一个值。让我们看一些例子

```rs
fn main() {
    let y = {
        let x = 3;
        x + 1
    }
    println!("value is {y}");
}
```

这里`{}`块也是一个表达式

```rs
{
    let x = 3;
    x + 1
}
```

* **重点**：`x + 1`这里结尾没有`分号;`，所以是一个表达式。如果有分号 `x + 1;` 那就变成一个语句了。

所以{}块内返回值是4，然后将4绑定给外面的变量y

