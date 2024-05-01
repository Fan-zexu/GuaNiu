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