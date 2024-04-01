# 使用use关键字来引入模块

使用绝对路径或者相对路径引入模块比较不变且重复。可以使用`use`关键字创建短路径

文件:`src/lib.rs`

```rs
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}
```

注意：

`use`只能创建它**所在特定作用域**内的短路径。如果将`eat_at_restaurant`移到其他子模块中，则编译失败。

```rs
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

use crate::front_of_house::hosting;

mod customer {
    pub fn eat_at_restaurant() {
        hosting::add_to_waitlist();
    }
}
```

解决：

1. 可以将`use`移入customer模块中

2. 通过`super::hosting`来调用，从父模块中引用


