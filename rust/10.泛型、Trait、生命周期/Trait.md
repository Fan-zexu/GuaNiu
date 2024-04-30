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