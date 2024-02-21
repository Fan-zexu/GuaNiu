# 基本概念

## 时间复杂度

一个函数，用大`O`表示，`O(1)、O(n)、O(n^2)、O(logn)...`，用来描述算法运行时间

`O(1)`：代码运行1次，`const map = { k: v }; const v = map[k]; `

`O(n)`：代码运行n次，比如一次for循环

`O(n^2)`：代码运行n*n次，比如两层循环嵌套

`O(logn)`：求以2为底n的对数（即2的多少次方等于n），即代表运行多少次。举例：

```js
let i = 1
while (i < n) {
    console.log(i)
    i *= 2
}
```

下面代码每次i都会乘以2，所以运行次数就是以2为底n的对数

## 空间复杂度

也用大`O`表示。用来描述代码运行中临时占用的内存空间大小

`O(1)`：一个变量 `let i = 0; i += 1`

`O(n)`：用到n个变量，比如循环定义变量：

```js
var arr = [];
for(i=0; i<n; i++) {
    arr.push(i)
}
```

`O(n^2)`：矩阵概念，二维数据

```js
let matrix = [];
for(let i=0; i<n; i++) {
    matrix[i] = [];
    for(let j=0; j<n; j++) {
        matrix[i].push(i+j)
    }
}
```

# 数据结构

## 栈

**先进后出/后进先出**

`JS`没有栈`API`，可以通过数组`Array`模拟

```js
const stack = []

stack.push(1) // 入栈
stack.push(2) // 入栈

const item1 = stack.pop() // 出栈
```

### DEMO

#### 十进制转二进制

```js
// 遍历数字 如果大于0 就可以继续转换2进制
  while (N > 0) {
    // 将数字的余数入栈
    stack.push(N % 2);

    // 除以2
    N = N >> 1;
  }
```

核心点：

1）如果十进制数是`大N`，那么转换二进制位就是`a[0]*2^0 + a[1]*2^1 + ... + a[n]*2^n`，那么二进制就是 `a[0]~a[n]`

2）那么对`大N`进行一次**除以2取余**（即`N % 2`），就可以得到`a[0]`。之后二进制变成 `a[1]*2^0 + a[2]*2^1 + ... + a[n]*2^n-1`，以此类推继续对`大N`取余，就可以得到 `a[1]`。注：这里这样推导：如果两边准备同时除以2，那么左边 `X + 2 * (a[1]*2^0 + a[2]*2^1 + ... + a[n]*2^n-1)` 等于右边 `2 * (N/2) + 余数 `，一目了然，第一项X就是`a[0] = 余数` ~

3）当`N`第一次取余之后，得到二进制最后一位`a[0]`，之后再次取余前，需要将二进制向右移动一位，这里可以使用**位运算符 >> 1**，`N >> 1`。举例：

```
N == 10，二进制 == 1010

第一次取余后，得到a[0] == 0，

第二次取余时，要等到a[1]，也就是1，所以这里用 N >> 1 即 1010 => 101。第二次取余结果就是 a[1] == 1
```

细节实现：

[传送门](./example/stack.js)

#### 判断字符串的有效括号

给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。
每个右括号都有一个对应的相同类型的左括号。

注释：

1）遇到左括号，入栈`stack.push(s)`

2）遇到右括号时，取出栈顶`var top = stack.pop()`，如果top和当前右括号不匹配，则返回false

## 队列

**先进先出**

模拟：

```js
const queue = [];

queue.push(1); // 进队 [1]
queue.push(2); // 进队 [1, 2]

queue.shift() // 出队 [1] / [2]
```

1. [最近请求次数](https://leetcode.cn/problems/H8086Q/)

写一个 RecentCounter 类来计算特定时间范围内最近的请求。

请你实现 RecentCounter 类：

RecentCounter() 初始化计数器，请求数为 0 。
int ping(int t) 在时间 t 添加一个新请求，其中 t 表示以毫秒为单位的某个时间，并返回过去 3000 毫秒内发生的所有请求数（包括新请求）。确切地说，返回在 [t-3000, t] 内发生的请求数。
保证 每次对 ping 的调用都使用比之前更大的 t 值。

示例 1：

输入：
["RecentCounter", "ping", "ping", "ping", "ping"]
[[], [1], [100], [3001], [3002]]
输出：
[null, 1, 2, 3, 3]

解释：
RecentCounter recentCounter = new RecentCounter();
recentCounter.ping(1);     // requests = [1]，范围是 [-2999,1]，返回 1
recentCounter.ping(100);   // requests = [1, 100]，范围是 [-2900,100]，返回 2
recentCounter.ping(3001);  // requests = [1, 100, 3001]，范围是 [1,3001]，返回 3
recentCounter.ping(3002);  // requests = [1, 100, 3001, 3002]，范围是 [2,3002]，返回 3

核心：

就是循环比较看队头的时间T，和左区间t-3000。

如果T < t-3000，则说明T不在区间内，需要剔除 `queue.shift()`

## 链表

> [维基百科定义](https://zh.wikipedia.org/wiki/%E9%93%BE%E8%A1%A8)

多个**无序**节点，依靠指针`next`进行连接，底层节点为null。

链表是一种线性表，不会按照顺序存储。插入节点速度快`O(1)复杂度`，但是查找节点或访问特定节点效率低有`O(n)复杂度`

```js
const a = {
  val: 'a'
};
const b = {
  val: 'b'
};
const c = {
  val: 'c'
};

a.next = b;
b.next = c;


const linkedList = {
  val: 'a',
  next: {
    val: 'b',
    next: {
      val: 'c',
      next: null
    }
  }
}

// 遍历链表
let p = a;

while(p) {
  console.log(p.val)
  p = p.next;
}

// 插入节点
const d = {
  val: 'd'
};

b.next = d;
d.next = c;

// 删除节点 b
a.next = d;
```

1. 实现instanceof

举例：

```js
// 表示 Array 在 [] 的原型链上
[] instanceof Array // true
```

2. 删除头部节点

时间和空间复杂度都是`O(1)`

```js
const deleteLinkedListNode = (node) {
  node.val = node.next.val;
  node.next = node.next.next;
}
```

3. 删除有序链表中的重复元素

[传送门](./example/linkedList.js)

4. 反转链表

// 1 -> 2 -> 3 -> 4 -> 5 -> null
// 5 -> 4 -> 3 -> 2 -> 1 -> null

// 时间复杂度 O(n) n为链表的长度
// 空间复杂度 O(1)

```js
while (p1) {
  // 创建一个临时变量
  const tmp = p1.next;

  // 将当前节点的下一个节点指向新链表
  p1.next = p2;

  // 将新链表指向当前节点
  p2 = p1;

  // 将当前节点指向临时变量
  p1 = tmp;
}
```

**思路：**

1. 新链表p2，从后向前生成 1 -> null , 2 -> 1 -> null ...

2. 原链表p1，从前向后循环：

举例第一次循环：

1) p1初始:  1->2->3->4->5->null ；p2初始：null。

2) 所以如何得到 p2: 1 -> null ？ 在p1的基础上，`p1.next = p2` 得到 `p1.next = null`，即 `p1 = 1 -> null`

3) 此时p1就是第一次循环需要生成的p2，所以 `p2 = p1`

4）之后需要向后移动一次p1指针，那么之前的习惯都是通过`p1 = p1.next`来实现，但是此时就无法这么操作了，此时`p1 = 1 -> null`。所以可以在循环开始时先记录一下下次指针移动的位置，即 `var nextP = p1.next` ，然后在循环结束前 `p1 = nextP`

一次循环到此结束，后面就可以继续按照这个逻辑循环执行，直到 `p1 = null`，结束。最后返回新链表p2

## 集合

无序且唯一的数据结构

`ES6的Set类型`

### 去重

```js
const arr = [1,2,1,2,3,4,5]

const arr1 = [...new Set(arr)]

const unique = (arr) => {
  const res = [];
  for(i++; i<arr.length; i=0) {
    if (!res.includes(arr[i])) {
      res.push(arr[i]) 
    }
  }
  return res;
}
```

### 数组取交集

[传送门](./example/set.js)


## 字典 map

和集合类似，是一个存储唯一值的结构，JS中就是Map类型

### 两数之和

> [leetcode](https://leetcode.cn/problems/two-sum/description/)

[传送门](./example/mao.js)

思路：

使用一次循环，通过 `target - currentNum` 得到另一个值，从Map中找，存在则返回索引，不存在则将当前值和索引缓存进Map

### 两个数组的交集

> [leetcode](https://leetcode.cn/problems/intersection-of-two-arrays/description/)

使用`Set`集合也可以求解，这里使用Map解决，思路就是先遍历`num1`然后存进`Map`，之后再遍历`num2`去`Map`对应查找。

---

这个数组交集2的题目，可以用hashMap来解决

> [leetcode](https://leetcode.cn/problems/intersection-of-two-arrays-ii/description/)

思路：

1. **由于有次数限制，所以需要使用Map结构将每个数字出现的次数进行记录**。遍历`nums1`，让每一项记录到map中，数字重复出现就 +1

2. 遍历`nums2`，如果该项在`Map`可以找到，并且记录次数 >0，则`push`进结果，然后将次数-1

3. 考虑Map的空间复杂度，可以对比`nums1和nums2`长度，使用长度小的来循环记录`Map`


### 字符的有效括号

```js
// 用字典优化

// 时间复杂度 O(n) n为s的字符长度
// 空间复杂度 O(n)

const isValid = (str) => {
  if (str.length % 2 !== 0) return false;
  const map = new Map();
  map.set("(", ")");
  map.set("[", "]");
  map.set("{", "}");
  const stack = [];
  for(let i=0; i<str.length; i++) {
    const s = str[i];
    // 是左括号，则入栈
    if (map.has(s)) {
      stack.push(s);
    } else {
      // 取栈顶左括号
      const t = stack[stack.length - 1];
      if (map.get(t) === s) {
        stack.pop();
      } else {
        return false;
      }
    }
  }
  return stack.length === 0;
}
```
