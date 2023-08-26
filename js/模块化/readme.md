# 前面

这东西属于很基础的东西，每天都会用到，但是其中一些细节却很容易忽略，所以这里就记录一下。

这篇文章我觉得很不错，看了好几遍了，每次都有所收获。[上链接](https://mp.weixin.qq.com/s/dq-RHXhn9ZjlLqdV9mabpQ)

文章是关于 CommonJS与ESModule之间的区别，比如提到：

- CommonJS模块是值的拷贝，而ESModule是值的引用

- 什么是运行时加载，什么是编译时输出

- 关于循环引用的问题

不仅有理论，还有具体代码演示，非常棒。

# CommonJS

**重点：**

`CommonJS`和`ECMAScript`不是一回事，所以类似 `module`和`require`并不是JS的关键字，而仅仅是对象或者函数而已。

打印 `module`和`require`：

```js
console.log(module);
console.log(require);

// out:
Module {
  id: '.',
  path: '/Users/xxx/Desktop/esm_commonjs/commonJS',
  exports: {},
  filename: '/Users/xxx/Desktop/esm_commonjs/commonJS/c.js',
  loaded: false,
  children: [],
  paths: [
    '/Users/xxx/Desktop/esm_commonjs/commonJS/node_modules',
    '/Users/xxx/Desktop/esm_commonjs/node_modules',
    '/Users/xxx/Desktop/node_modules',
    '/Users/xxx/node_modules',
    '/Users/node_modules',
    '/node_modules'
  ]
}

[Function: require] {
  resolve: [Function: resolve] { paths: [Function: paths] },
  main: Module {
    id: '.',
    path: '/Users/xxx/Desktop/esm_commonjs/commonJS',
    exports: {},
    filename: '/Users/xxx/Desktop/esm_commonjs/commonJS/c.js',
    loaded: false,
    children: [],
    paths: [
      '/Users/xxx/Desktop/esm_commonjs/commonJS/node_modules',
      '/Users/xxx/Desktop/esm_commonjs/node_modules',
      '/Users/xxx/Desktop/node_modules',
      '/Users/xxx/node_modules',
      '/Users/node_modules',
      '/node_modules'
    ]
  },
  extensions: [Object: null prototype] {
    '.js': [Function (anonymous)],
    '.json': [Function (anonymous)],
    '.node': [Function (anonymous)]
  },
  cache: [Object: null prototype] {
    '/Users/xxx/Desktop/esm_commonjs/commonJS/c.js': Module {
      id: '.',
      path: '/Users/xxx/Desktop/esm_commonjs/commonJS',
      exports: {},
      filename: '/Users/xxx/Desktop/esm_commonjs/commonJS/c.js',
      loaded: false,
      children: [],
      paths: [Array]
    }
  }
}
```

`require`是一个函数，`module`是一个对象。

## module

`module`对象是当前模块的信息的一个对象，它有以下属性：

- `id`：模块的识别符，通常是带有绝对路径的模块文件名。

- `filename`：模块的文件名，带有绝对路径。

- `loaded`：返回一个布尔值，表示模块是否已经完成加载。

- `parent`：返回一个对象，表示调用该模块的模块。父级模块

- `children`：返回一个数组，表示该模块要用到的其他模块。依赖的子模块数组

- `exports`：表示模块对外输出的值。在未赋值前，是一个空对象。

- `paths`：模块的搜索路径。

## require

`require`函数用于加载模块。它也有一些属性：

- `require.resolve()`：返回模块的路径。

- `require.main`：指向主模块。在node中可以通过 `require.main === module`，来判断是否以当前模块作为入口。

- `require.cache`：指向缓存的模块。当一个模块被加载一次之后，后续`require`就不会再加载一次，而是直接从缓存中读取。

- `require.extensions`：根据文件的后缀名，调用不同的执行函数。比如，`.js`文件调用`js`执行函数，`.json`文件调用`json`执行函数，`.node`文件调用`node`执行函数。


## CommonJS的例子

1. 简单类型的输出

```js
// a.js
let val = 1;

const setVal = (newVal) => {
    val = newVal;
}

module.exports = {
    val,
    setVal
}

// b.js
const { val, setVal } = require('./a.js');

console.log(val); // 1

setVal(2);

console.log(val); // 1
```

最后执行b文件，结果为如上

2. 引用类型的输出

```js
// a.js
let obj = {
  val: 1
};

const setVal = (newVal) => {
  obj.val = newVal
}

module.exports = {
  obj,
  setVal
}

// b.js
const { obj, setVal } = require('./a.js')

console.log(obj); // { val: 1 }

setVal(101);

console.log(obj); // { val: 101 }
```

就简单分析这两个例子，可以简化成 `c.js`，[入口](./demo/c.js)

所以其实`CommonJS`并没有什么神秘的地方，就是最原始的JS用法。

**重点：**

值的拷贝，发生在给`module.exports`赋值的那一刻：

```js
var a = 1;

var obj = {
  val: 1,
}

module.exports = {
  val: a,
  valObj: obj
}
```
可以看到如果`a`是一个**简单类型**，再如何改变，`val`的值也不会改变； 如果是一个**引用类型**，那就会存在引用问题~

## CommonJS 具体实现

### 1. 一个模块类`MyModule`

```js
function MyModule() {
  this.id = ''; // 模块路径
  this.exports = {}; // 模块输出
  this.loaded = false; // 是否加载完成
  // this.filename = ''; // 模块文件名
  // this.children = []; // 子模块
  // this.paths = []; // 模块路径
}
```

### 2. `require`函数

`require`是`Mymodule`的一个实例方法，所以在`MyModule`的原型上定义：

```js
MyModule.prototype.require = function(id) {
  return MyModule._load(id);
}
```

`require`函数包装了`_load`方法

```js
MyModule._load = function (path) {
  // 1. 根据传入路径，解析模块文件名
  const filename = MyModule._resolveFilename(path);

  // 2. 如果缓存中存在，直接返回
  const cachedModule = MyModule._cache[filename];
  if (cachedModule) {
    return cachedModule.exports;
  }

  // 3. 如果没有缓存，创建一个模块实例
  const module = new MyModule();

  // 4. 缓存模块
  MyModule._cache[filename] = module;

  // 5. 加载模块，这里其实还有模块加载失败后清理缓存的操作，这里可以省略
  module.load(filename);

  // 6. 返回模块的输出
  return module.exports;
}
```

