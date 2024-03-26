# 定义模块来控制作用域与私有性

## 模块规则

> [官方文档](https://kaisery.github.io/trpl-zh-cn/ch07-02-defining-modules-to-control-scope-and-privacy.html#%E6%A8%A1%E5%9D%97%E5%B0%8F%E6%8A%84)

### 声明模块

在`crate`根文件中，声明一个`garden`的模块 `mod garden`。编译器寻找模块路径：

- 内联，在大括号中

- 在文件 `src/garden.rs`

- 在文件 `src/graden/mod.rs`

### 声明子模块

在其他文件中，定义子模块。如在`src/garden.rs`中定义了 `mod vegetables`。编译器会在**以父模块命名的目录**中寻找子模块：

- 内联，在大括号中

- 在文件 `src/garden/vegetables.rs`

- 在文件 `src/garden/vegetables/mod.rs`

和父模块查找规则类似

### 模块中的代码路径

没看懂官网提到的“隐私规则”是什么

如果在一个`crate`下定义一个模块，你们就可以在crate内的任意地方，通过代码路径引用该模块。

比如在`garden`下的个`Apple`类型，可以在`crate::graden::vegetables::Apple`被找到

### 共有 vs 私有

一个子模块，默认对其父模块私有。

可以是用`pub`让一个私有模块变成共有，用 `pub mod`代替 `mod`

### use关键字

在一个作用域内，`use`关键字创建一个成员的快捷方式，用来减少长路径的重复。

比如：

```rs
use crate::garden::vegetables::Apple;

fn main() {
    let food = Apple {};
}
```

