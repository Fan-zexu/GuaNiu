# 对象判空

结论：

1.`Object.getOwnPropertyNames + Object.getOwnPropertySymbols`

通过`xxxSymbols`解决了`xxxNames`无法识别`symbol`的问题

```js
const a = Symbol()
const obj1 = {
  [a]: 1
}
const obj2 = {b: 2}
const obj3 = {}
Object.defineProperty(obj3, 'a', {
  value: 1,
  enumerable: false
})
const obj4 = {}

function getLength(obj) {
  return Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj)).length
}

console.log(getLength(obj1) === 0)  // false
console.log(getLength(obj2) === 0)  // false
console.log(getLength(obj3) === 0)  // false
console.log(getLength(obj4) === 0)  // true
```

2.`Reflect.ownKeys`

更简单的实现

```js
const a = Symbol()
const obj1 = {
  [a]: 1
}
const obj2 = {b: 2}
const obj3 = {}
Object.defineProperty(obj3, 'a', {
  value: 1,
  enumerable: false
})
const obj4 = {}

console.log(Reflect.ownKeys(obj1).length === 0)  // false
console.log(Reflect.ownKeys(obj2).length === 0)  // false
console.log(Reflect.ownKeys(obj3).length === 0)  // false
console.log(Reflect.ownKeys(obj4).length === 0)  // true
```


> [原文](https://juejin.cn/post/7275220813619298367)