# 使用 Hash Map 存储

和JS的Map类型

## 新建

使用`new`创建，使用`insert插入

```rs
use std::collections::HashMap;

let mut map = HashMap::new();

map.insert(String::from("blue"), 10);

map.insert(String::from("red"), 20);
```