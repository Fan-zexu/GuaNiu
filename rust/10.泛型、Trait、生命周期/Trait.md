# Trait定义共同行为

`trait` 类似于 `interface 接口` ？

# 定义trait

一个类型的行为由其可供调用的方法构成。

如果可以对多个不同类型调用相同方法，这些类型就可以共享相同的行为。

trait定义，是一种将方法签名组合起来的方法，目的是定义一个实现某些目的所必须得行为的集合。 这一句没懂 。。。。

官网demo，多个类型中都包含“摘要”方法

```rs
pub trait Summary {
    fn summarize(&self) -> String;
}
```

1. 通过`pub`来让这个`crate`可以被其他`crate`调用这个`trait`

2. 通过大括号中 `fn summarize(&self) -> String`来声明这个`trait`的类型所需要的行为的方法签名

3. 方法签名后面用“;”结尾，不需要提供具体实现。每一个实现这个`trait`的类型都需要提供自定义行为的方法体。

4. `trait`中可以包含多个方法签名，用“;”隔开

# 为类型实现trait

定义了`trait`之后，我们去实现这个类型

以`Summary trait`为例，

文件: `src/lib.rs`

```rs
pub struct Article {
    pub title: String;
    pub location: String;
    pub author: String;
    pub content: String;
}

impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.title, self.author, self.location);
    }
}

pub struct Tweet {
    pub username: String;
    pub content: String;
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}
```

官方对于这个trait的使用

```rs
use aggregator::{Summary, Tweet};

fn main() {
    let tweet = Tweet {
        username: String::from("horse_ebooks"),
        content: String::from(
            "of course, as you probably already know, people",
        ),
    };

    println!("1 new tweet: {}", tweet.summarize());
}
```

这里还解释了使用`trait`限制，参考：[官网](https://kaisery.github.io/trpl-zh-cn/ch10-02-traits.html#%E4%B8%BA%E7%B1%BB%E5%9E%8B%E5%AE%9E%E7%8E%B0-trait)

个人理解：

`use aggregator::{Summary, Tweet};`这里证明`Summary, Tweet`处于`aggregator crate`的本地作用域中，所以可以为`aggregator crate`中的`Tweet`类型实现`Display trait`；也可以为`aggregator crate`中的`Vec<T>`实现`Summary Trait`。

但不能给`aggregator crate`中的`Vec<T>`实现`Display trait`，因为2者都属于标准库中的实现，都不在`aggregator crate`的作用域中

# 默认实现

> 为`trait`某些或全部方法提供默认行为，而不是在每个类型的每个实现中都定义自己的行为是很有用的。

例子，`Summary trait`中的`summarize`方法指定一个字符串，而不是仅定义方法签名

```rs
pub trait Summary {
    fn summarize(&self) -> String {
        String::from("read more ...")
    }
}
```

如果想让`Tweet`实例使用这个默认行为，可以这样，实现一个空`impl`

```rs
impl Summary for Tweet {}
```

## 特殊实现...

在默认实现中可以调用`trait`上的其他方法，即使这些方法么有被实现。例子：

```rs
pub trait Summary {
    fn summarize_other(&self) -> String;

    fn summarize(&self) -> String {
        format!("read more from {} ... ", &self.summarize_other)
    }
}
```

想使用这个版本的 `Summary trait`，只需要实现`summarize_other`即可

```rs
impl Summary for Tweet {
    fn summarize_other(&self) -> String {
        format!("@{}", &self.username)
    }
}
```

具体调用：

```rs
    let tweet = Tweet {
        username: String::from("horse_ebooks"),
        content: String::from(
            "of course, as you probably already know, people",
        ),
    };

    println!("1 new tweet: {}", tweet.summarize()); // 1 new tweet: (read more from @horse_ebooks...)。

```

> 注意：无法从相同方法的重载实现中调用默认方法。 ???

## trait作为参数

`Article和Tweet`上都是实现了`Summary trait`，之后我们定义一个函数`notify`来调用其参数`item`上的`summarize`方法，这个`item`也是一个实现了`Summary trait`的类型。可以用 `impl Trait`的语法

```rs
pub fn notify(item: &impl Summary) {
    println!("Breaking news ! {}", item.summarize());
}
```

`item`参数使用了`impl Trait`而不是具体类型，表示该参数之后任何实现了某种`Trait`的类型。

这`notify`中，可以调用任何来自`Summary trait`的方法，比如`summarize`。

我们可以传递`Article和Tweet`的实例来调用`notify`。

但是用其他如`String、i32`的类型来调用`notify`都会编译失败，因为它并没有实现`Summary`

## trait bound语法

`impl trait`是`trait bound`这种较长形式的语法糖

```rs
pub fn notify<T: Summary>(item: &T) {
    println!("Breaking news! {}", item.summarize());
}
```

复杂场景，比如获取两个实现了`Summary`的参数，使用`impl trait`语法：

```rs
pub fn notify(item1: &impl Summary, item2: &impl Summary) {}
```

但是如果希望是相同类型，只能使用`trait bound`语法：

```rs
pub fn notify<T: Summary>(item1: &T, item2: &T) {}
```