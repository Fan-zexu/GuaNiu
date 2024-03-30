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

## 创建共有结构体

创建共有结构体，但其中包含共有和私有属性，例子：

```rs
mod back_of_house {
   pub struct Breakfast {
    pub toast: String,
    seasonal_fruit: String,
   }

   impl Breakfast {
    pub fn summer(toast: &str) -> Breakfast {
        Breakfast {
            toast: String::from(toast),
            seasonal_fruit: String::from("peaches"),
        }
    }
   }
}

pub fn eat_at_restaurant {
    // 订购一个黑麦吐司
    let mut meal = back_of_house::Breakfast::summer("Rye");
    // 改变主意，将黑麦修改为小麦面包
    meal.toast = String::from("Wheat");

    // 如果取消下一行的注释代码不能编译；
    // 不允许查看或修改早餐附带的季节水果
    // meal.seasonal_fruit = String::from("blueberries");
}
```

疑问：这里如果不使用`impl Breakfast`，只定义summer方法，也可以正常执行。那会有问题吗？




