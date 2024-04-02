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


# 创建惯用的use

1. 将`HashMap`引入的**习惯**写法

```rs
use std::collections::HashMap;

fn main() {
    let mut map = HashMap::new();

    map.insert(1, 2);
}
```

2. 将两个父模块不同，但是类型名相同，引入作用域

```rs
use std::fmt;
use std::io;

fn fn1() -> fmt::Result {

}

fn fn2() -> io::Result<()> {
    
}
```

# 使用as关键字定义新名称

和ESM中 import as 定义别名差不多

```rs
use std::fmt::Result;
use std::io::Result as IoResult;

fn function1() -> Result {
    // --snip--
}

fn function2() -> IoResult<()> {
    // --snip--
}
```

# pub use 重导出名称

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

修改前，在外部代码使用：

```rs
restaurant::front_of_house::hosting::add_to_list();
```

修改后：

```rs
restaurant::hosting::add_to_list();
```

# 嵌套路径消除大量use

当从相同包活模块引入项时，可以简化use的引用

1. 

优化前：

```rs
use std::cmp::Ordering;
use std::io;
```

优化后：

```rs
use std::{cmp::Ordering, io};
```

2. 

优化前：

```rs
use std::io;
use std::io::write;
```

优化后：

```rs
use std::io::{self, write}
```

# 通过glob运算符将所有共有定义引入作用域

将一个路径下所有公有项引入作用域，在指定路径后跟 `*`，glob运算符

```rs
use std::collections::*
```

glob运算符一般使用在测试模块场景。