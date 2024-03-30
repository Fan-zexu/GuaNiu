# 引用模块路径

两种路径：

- 绝对路径，以`crate根`开头的全路径

- 相对路径，从当前模块开始，以`self` `super`或定义在当前模块中的标识符开头

两种路径都后跟一个或多个双冒号`(::)`分隔的标识符


## 使用pub关键字暴露路径

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

## super开始的相对路径

使用`super`开头的相对路径，从父级目录开始构建路径，有点类似于 `..`文件系统路径用法。

```rs
// 文件：src/lib.rs

fn deliver_order() {}

mod back_of_house {
    fn fix_order() {
        cook_order();
        super::deliver_order();
    }

    fn cook_order() {}
}
```