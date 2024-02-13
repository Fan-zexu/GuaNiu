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