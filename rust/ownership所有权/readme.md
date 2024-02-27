# 什么是所有权

> [官网原文](https://kaisery.github.io/trpl-zh-cn/ch04-01-what-is-ownership.html)

## 栈 stack 和 堆 heap

栈，是`后进先出`的结构。栈中的所有数据都必须占用已知和固定的大小。

在编译时，大小未知或可能变化的数据，要存储在堆上。

当向堆存储数据时，需要先请求一定大小的空间。这里内存分配器会在堆上找到一块一定大小的空间，并把它标记为已使用，同时返回表示该位置地址的指针pointer。这个过程叫做“在堆上分配内存”，简称“分配”。

有个形象的例子：去餐馆就坐吃饭，当进入时，你说明有几个人，餐馆员工会找到一个够大的空桌子并领你们过去。如果有人来迟了，他们也可以通过询问来找到你们坐在哪。

---

入栈比在堆上分配内存要快，原因：

1. 入栈不需要寻找空间并分配内存，其位置总是栈顶。

2. 堆除了分配内存之外，还要做一些记录工作为下次分配做准备。

---

栈上访问数据速度比堆上快。因为堆上必须通过指针来访问。

## 所有权规则

1. Rust中每一个值都有一个所有者(owner)

2. 值在任意时刻有且只有一个所有者

3. 当所有者（变量）离开作用域时，这个值将被丢弃

## 变量作用域 scope

rust的变量作用域和JS差不多，JS中使用`let`不存在作用域提升。所以这里s的有效范围是括号内。

```rs
{                      // s 在这里无效，它尚未声明
    let s = "hello";   // 从此处起，s 是有效的

    // 使用 s
}                      // 此作用域已结束，s 不再有效

```

## String类型

用于可变字符串。这个类型管理被分配到堆上的数据，所以可以处理编译时未知大小的文本。应用如下：

```rs
    let mut s = String::from("hello");

    s.push_str(", world!"); // push_str() 在字符串后追加字面值

    println!("{}", s); // 将打印 `hello, world!`

```

使用另一个字符串类型：`String`。其中`::`双冒号表示运算符，允许将特定的`from`函数置于`String`类型的命名空间下


## 内存与分配 Memory and Allocation

由于字符字面值的不可变性，所以它运行高效。但是对于未知可变的文本，需要**在堆上分配一块在编译时未知大小的内存来存放内容**

有两个点：

1. 必须在运行时向**内存分配器(memory allocator)**请求内存

2. 需一个处理完String时，将内存返回给分配器的方法

第一个点，我们自己实现，通过`String::from`来申请内存

第二个点，由`rust`内部实现，**内存在拥有它的变量离开作用域后就被自动释放**

```rs
{
    let s = String::from("hello"); // 从此处起，s 是有效的

    // 使用 s
}                                  // 此作用域已结束，
                                    // s 不再有效
```
这个例子中，在s离开作用域时，即在结尾的"}"这里，`Rust`会为我们调用一个特殊函数：`drop`函数，之后将内存还给分配器。


### 变量与数据交互的方式（一）：移动

```rs
let x = 5;
let y = x;
```

这个例子是固定大小的数据，其中5被拷贝一份并赋值给y，此时两个5都放在栈中

```rs
let s1 = String::from("hello");
let s2 = s1;
```

这个可变字符串的例子中，和上面例子看起来类似，但是实际拷贝的是`存放字符串数据的指针`，并将这个指针赋值给s2，此时s1,s2的指针`共同指向堆数据`

* 注意：这个`指针`包含3部分，指针、长度和容量

如图所示，看起来和JS对象引用拷贝差不多，有点类似浅拷贝。但在rust中称为`move 移动`。`s1`被移动到`s2`

![String](https://kaisery.github.io/trpl-zh-cn/img/trpl04-02.svg)


```rs
    let s1 = String::from("hello");
    let s2 = s1;

    println!("{}, world!", s1);

```

再次打印s1会报错。原因是在执行完`let s2 = s1`后，`s1`就被无效了，为了防止“二次释放(double free)”

```sh
$ cargo run
   Compiling ownership v0.1.0 (file:///projects/ownership)
error[E0382]: borrow of moved value: `s1`
 --> src/main.rs:5:28
  |
2 |     let s1 = String::from("hello");
  |         -- move occurs because `s1` has type `String`, which does not implement the `Copy` trait
3 |     let s2 = s1;
  |              -- value moved here
4 |
5 |     println!("{}, world!", s1);
  |                            ^^ value borrowed here after move
  |
  = note: this error originates in the macro `$crate::format_args_nl` which comes from the expansion of the macro `println` (in Nightly builds, run with -Z macro-backtrace for more info)

For more information about this error, try `rustc --explain E0382`.
error: could not compile `ownership` due to previous error

```

* 注意：`Rust`永远不会自动创建数据的“深拷贝”，因此任何**自动**的创建对运行时性能影响较小

### 变量与数据交互的方式（2）：克隆

如果需要深拷贝，既复制栈上的数据，又复制堆上的数据，可以使用`clone`方法

这个例子可以正常运行。

```rs
    let s1 = String::from("hello");
    let s2 = s1.clone();

    println!("s1 = {}, s2 = {}", s1, s2);
```

这个例子属于栈上的拷贝，所以也是正常的。

```rs
    let x = 5;
    let y = x;

    println!("x = {}, y = {}", x, y);

```

从这里就引出了两种特殊注释 `Copy trait` 和 `Drop trait` [参考这里](https://kaisery.github.io/trpl-zh-cn/ch04-01-what-is-ownership.html#%E5%8F%AA%E5%9C%A8%E6%A0%88%E4%B8%8A%E7%9A%84%E6%95%B0%E6%8D%AE%E6%8B%B7%E8%B4%9D)

