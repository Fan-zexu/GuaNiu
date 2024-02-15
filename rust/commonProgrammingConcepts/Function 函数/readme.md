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

# 参数 parameters

和TS用法基本一致，其中`println!`这个宏指令中可以以`{变量}`形式输出参数变量。

```rs
fn main() {
    another_function(1, 'hhh');
}

fn another_function(value: i32, label: char) {
    println!("another function parameters is {value}, {label}");
}
```
