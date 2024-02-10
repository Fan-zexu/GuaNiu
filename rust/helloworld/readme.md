# Hello world

```rs
fn main () {
    println!("hello world");
}
```

日志输出：`println!`表示调用了`micro宏`，如果是调用函数，则没有“!”，所以如果函数后出现“!”，则表明是**宏调用**

关于编译：`main`是固定的入口函数。代码通过`rustc ./main.rs`编译生成一个可执行的二进制文件`main`

