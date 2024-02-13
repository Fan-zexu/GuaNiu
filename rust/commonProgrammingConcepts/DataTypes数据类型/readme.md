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