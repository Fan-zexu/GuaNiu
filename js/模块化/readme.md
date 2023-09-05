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
#### _resolveFilename

根据传入的`require`参数，来解析实际的模块路径。源码实现复杂，因为要支持多种类型参数：内置模块、相对路径、绝对路径、文件夹、三方模块等。

这里仅简单演示相对路类型。

```js
MyModule._resolveFilename = function(id) {
  return path.resolve(id);
}
```

#### MyModule.prototype.load

`.load`是模块的实例方法，是真正用来加载模块的方法，也是不同类型文件加载的一个入口，不同类型文件会对应`MyModule._extensions`里面的一个方法

```js
MyModule.prototype.load = function (filename) {
  // 获取文件后缀名
  const extname = path.extname(filename);
  // 调用后缀名对应的处理函数来处理
  MyModule._extensions[extname](this, filename);

  this.loaded = true;
}
```

#### MyModule._extensions['X']

`node`加载器处理`.js`之外，还支持`.json``.node`模块

本demo仅演示`.js`文件处理

```js
MyModule._extensions['.js'] = function(module, filename) {
  // 1. 读取filename文件内容
  const content = fs.readFileSync(filename, 'utf8');
  // 2. 将读取内容交给 _compile方法处理
  module._compile(content, filename);
}
```

这里的`._compile`是一个实例方法

#### ._compile

`_compile`是node加载模块的核心方法，功能就是将文件代码拿出来，执行一遍，执行过程如下：

**1.** 在代码执行前，先给模块外包一层，为了可以注入`require` `module` `exports` `__filename` `__dirname`变量，这也就是为什么我们在代码中可以使用这几个看似是全局的变量。

比如，我们有个简单的`hello world`文件，

```js
module.exports = 'hello world';
```

那么这里的 `module`变量，就是通过外层注入进来，给我们使用的，类似这样:

```js
function (module) {  // 同理，其他几个变量也是如此注入
  module.exports = 'hello world';
}
```

在Node中提供了这样的`wrap`方法，来将模块代码进行包装：

```js
NativeModule.wrap = function(script) {
  return NativeModule.wrapper[0] + script + NativeModule.wrapper[1];
};

NativeModule.wrapper = [
  '(function (exports, require, module, __filename, __dirname) { ',
  '\n});'
];
```

**2.** 将包装好的代码放入node沙箱执行，并返回？ 沙箱执行使用了node的`vm`模块

实现在`_.compile`中

```js
MyModule.wrapper = [
  '(function (myExports, myRequire, myModule, __filename, __dirname) { ',
  '\n});'
];

MyModule.wrap = function (script) {
  return MyModule.wrapper[0] + script + MyModule.wrapper[1];
};

MyModule.prototype._compile = function(content, filename) {
  var self = this;
  // 包装一层模块代码
  const wrapper = MyModule.wrap(content);
  // vm是nodejs虚拟机沙盒模块，runInThisContext方法可以接受一个字符串并将它转换为一个函数
  // 返回值就是转化后的函数，compiledWrapper就是一个函数
  const compiledWrapper = vm.runInThisContext(wrapper, {
    filename
  });
  const dirname = path.dirname(filename);

  const args = [self.exports, self.require, self, filename, dirname];
  return compiledWrapper.apply(self.exports, args);
}
```

#### 最后生成一个实例并导出

```js
const myModuleIns = new MyModule();

const MyRequire = (id) => {
  return myModuleIns.require(id);
};

module.exports = {
  MyRequire,
  MyModule,
}
```

## 循环引用问题

循环引用问题，就是A模块引用B模块，B模块又引用A模块，这样就形成了循环引用。

下面这个例子：

```js
// app.js入口
require('./a.js');

// a.js
const { b } = require('./b.js');

let a = 'a'

const setA = (val) => { a = val };

module.exports = {
  a,
  setA,
}

// b.js

const { a, setA } = require('./a.js');

setA('aa')

module.exports = {
  b: 2,
}

// 执行app.js
// 报错：TypeError: Cannot read property 'a' of undefined

```

问题：为什么CommonJS循环引用没有产生类似“死锁”问题：

答案：在`Module._load`函数做了处理：

```js
// 4. 缓存模块
  MyModule._cache[filename] = module;

  // 5. 加载模块，这里其实还有模块加载失败后清理缓存的操作，这里可以省略
  module.load(filename);
```

做了以下事情：

1. 检查缓存，如果有，直接返回
2. 如果没有，创建一个模块实例
3. 将Module的实例放到缓存中
4. 通过这个实例来加载文件
5. 返回这个实例的exports

解决问题的核心在于：**放到缓存中** 与 **加载文件**的顺序，如上代码块

详细分析循环引用细节：

1. 当`app.js`加载`a.js`时，此时`Module`会检查缓存中是否有`a.js`，发现没有，于是new `a.js`模块，并将这个模块放到缓存中，然后去加载`a.js`文件本身。

2. `a.js`文件第一行是加载`b.js`，此时`Module`会检查缓存中是否有`b.js`，发现没有，于是new `b.js`模块，并将这个模块放到缓存中，然后去加载`b.js`文件本身。

3. 加载`b.js`本身时，Module发现第一行是加载`a.js`，它会检查缓存中是否有`a.js`，发现有，于是`require`函数直接返回缓存中的`a.js`。

4. 但是这时候，`a.js`本身并没有执行完毕，还没有走到`module.exports`那一步，所以`a.js`的`exports`还是一个空对象，所以`b.js`中执行 `setA` ，会报`setA is not a function` 的异常。

但如果像这样顺序换一下？

```js
// 5. 加载模块，这里其实还有模块加载失败后清理缓存的操作，这里可以省略
module.load(filename);
// 4. 缓存模块
MyModule._cache[filename] = module;
```

这样就会死锁，导致JS栈溢出 `RangeError: Maximum call stack size exceeded`


# ESM