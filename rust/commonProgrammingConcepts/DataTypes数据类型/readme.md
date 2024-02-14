# 标量类型 scalar

它代表一个单独的值，包括4种类型：`整型、浮点型、布尔类型、字符串类型`

## 整型

整数是没有小数部分的数字。`isize`表示有符号，可以是负数。`usize`表示无符号，大于等于0

整型表

| 长度 | 有符号 | 无符号 |
| - | - | - |
|  8bit    |   i8    |   u8    |
|  16bit    |   i16    |   u16    |
|  32bit    |   i32    |   u32    |
|  64bit    |   i64    |   u64    |
|  128bit    |   i128    |   u128    |
|  arch    |   isize    |   usize    |


> 关于[整型溢出](https://kaisery.github.io/trpl-zh-cn/ch03-02-data-types.html#%E6%95%B4%E5%9E%8B%E6%BA%A2%E5%87%BA)的问题，可以看这里

## 浮点型

原生有2个类型，`f32`和`f64`，默认是`f64`。所有浮点型都带有符号。

示例:

```rs
fn main() {
    let x = 2.0; // f64
    let y: f32 = 3.0; // f32
}
```

浮点数采用 IEEE-754 标准表示。f32 是单精度浮点数，f64 是双精度浮点数。

### 数值运算

支持加减乘除取余，其中整数除法会向零舍入到最接近的整数。

```rs
fn main() {
    // addition
    let sum = 5 + 10;

    // subtraction
    let difference = 95.5 - 4.3;

    // multiplication
    let product = 4 * 30;

    // division
    let quotient = 56.7 / 32.2;
    let truncated = -5 / 3; // 结果为 -1

    // remainder
    let remainder = 43 % 5;
}
```

## 布尔型

`bool`

## 字符串型

`char`

```rs
fn main() {
    let c = 'z';
    let z: char = 'ℤ'; // with explicit type annotation
    let heart_eyed_cat = '😻';
}
```

注意，我们用单引号声明 char 字面量，而与之相反的是，使用双引号声明字符串字面量


# 复合类型 Compound types

原生有两种类型：元组(tuple)、数组(array)

## 元组类型

用圆括号 ()和逗号,分隔 表示一个元组，如下

```rs
fn main() {
    let tup: (i32, f64, u8) = (500, 6.4, 1);
}
```

和TS的元组用法类似 

```ts
type tup = number | string | object;
```

**元组的解构用法**

```rs
fn main() {
    let tup = (500, 6.4, 1);
    (x, y, z) = tup;
    println!("y: {y}");
}
```

**通过.加索引使用**
```rs
fn main() {
    let x: (i32, f64, u8) = (500, 6.4, 1);
    let five_hundred = x.0;
    let six_port_four = x.1;
    let one = x.2;
}
```

不带任何值的元组有个特殊的名称，叫做 `单元（unit）` 元组。这种值以及对应的类型都写作 `()`，表示空值或空的返回类型。如果表达式不返回任何其他值，则会隐式返回单元值。

## 数组类型



