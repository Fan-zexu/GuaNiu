# 引用模块路径

两种路径：

- 绝对路径，以`crate根`开头的全路径

- 相对路径，从当前模块开始，以`self` `super`或定义在当前模块中的标识符开头

两种路径都后跟一个或多个双冒号`(::)`分隔的标识符

`src/lib.rs`

```rs
mod front_of_house {
    mod hosting {
        fn add_waitlist() {}
    }
}

pub fn eat_at_restaurant() {
    // 绝对路径
    crate::front_of_house::hosting::add_waitlist();
    // 相对路径
    front_of_house::hosting::add_waitlist();
}
```