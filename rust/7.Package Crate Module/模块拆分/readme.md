# 模块拆分多个文件

拆分前：

```rs
mod front_of_house {
    pub mod hosting {
        fn add_to_list() {}
    }
}

pub use crate::front_of_house::hosting;

pub fn eat() {
    hosting::add_to_list();
}
```

拆分后：

1. 先拆分 `front_of_house`

`src/lib.rs`

```rs
mod front_of_house;

pub use crate::front_of_house::hosting;

pub fn eat() {
    hosting::add_to_list();
}
```

`mod front_of_house`保留模块声明，编译器找到了`crate`根中叫`front_of_house`的模块声明，于是就去搜索这个文件

`src/front_of_house.rs`

```rs
pub mod hosting {
    pub fn add_to_list() {}
}
```


2. 再拆分子模块`hosting`

文件名：`src/front_of_house`

```rs
pub mod hosting;
```

文件名：`src/front_of_house/hosting.rs`

```rs
pub fn add_to_list() {}
```


# 总结

`mod`关键字声明了模块，而Rust会再与模块同名的文件中查找模块的代码