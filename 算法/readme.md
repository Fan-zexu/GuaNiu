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

1. 十进制转二进制

## 队列

**先进先出**

模拟：

```js
const queue = [];

queue.push(1); // 进队 [1]
queue.push(2); // 进队 [1, 2]

queue.shift() // 出队 [1] / [2]
```