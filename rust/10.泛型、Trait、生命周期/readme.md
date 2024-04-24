# 泛型、Trait、生命周期

[官网](https://kaisery.github.io/trpl-zh-cn/ch10-00-generics.html)

## 提取函数减少重复

取最大值:

```rs
fn main() {
    let num_list = vec![3, 2, 4, 5, 1, 7];

    let mut largest = &num_list[0];

    for num in &num_list {
        if num > largest {
            largest = num;
        }
    }

    println!("largest is {largest}");
}
```

提取一个取最大值的通用函数

```rs
fn main() {
    let num_list = vec![3, 2, 4, 5, 1, 7];

    let mut largest = &num_list[0];

    for num in &num_list {
        if num > largest {
            largest = num;
        }
    }

    println!("largest is {largest}");

    let num_list = vec![11, 2, 60, 40, 8];

    let result = largestFn(&num_list);

    println!("largest is {result}");
}

fn largestFn(list: &[i32]) -> &i32 {
    let mut largest = &list[0];

    for item in list {
        if item > largest {
            largest = item;
        }
    }

    largest
}
```