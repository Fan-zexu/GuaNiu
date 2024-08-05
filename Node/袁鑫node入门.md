# nodejs

在我们执行`node a.js`之后，Node会启动一个进程，1个Js执行线程，但还有其他多个线程是底层node启动的，包括`fs``network`等

![node启动的单线程](./imgs/node-single-thread.jpg)

在服务器应用中避免使用 `sync`结尾的同步api，比如 `readFileSync`等，因为会阻塞线程，影响性能

核心模块：

- http

- fs

- stream 句柄，句柄可以理解为nodejs把底层功能封装了一个模块，提供给上层开发者调用。

```js
(req, res) => {
    http.get('url', (data) => {
        let body = '';
    
        data
            .on('data', (chunk) => {
                body += chunk;
            })
            .on('end', () => {
                const jsonObj = JSON.parse(body);
                res.write(JSON.stringify({
                    data: [jsonObj]
                }))
                res.end();
            })
    })
}

```

```sh
node server.js
```
这里的node 本质就是一个编译好的二进制文件。同样可以写成这样

```sh
/usr/local/bin/node server.js
```

Node源码 C实现的：

![node-source code](./imgs/node-source-code.jpg);

这里展示了核心功能 事件循环。

`uv_run`核心方法是`libuv`这个库实现的

关于`Node`源码，`src`是C语言实现的，`lib`是`JS`代码，通过C调用`V8`JS引擎来进行JS解析。

## 实现一个`NodeJS`扩展

1. 通过C++实现一个模块

2. 通过`node-gyp`来对C++模块进行编译，编译成2进制文件

3. JS可以直接通过`require`来引入这个二进制模块

## 如何将这个Node扩展作为npm包发布

1. 在本地将C++模块编译成二进制

2. package.json的main入口定义一个入口js文件（比如index.js），在index.js中require这个二进制文件，之后再`module.exports`它

3. npm publish

```js
// index.js

const read = require('./build/release/read.node');

module.exports = read;
```

比如`node-sass`就是通过C实现的，然后套了一个JS壳，导出成npm包发布

另一个问题，如何实现一个Node的C++扩展模块，一般是通过`nan`或者`n-api`(推荐)


## SSR

`SSR`实质上是将jsx通过调用`renderToString`方法，转成`html`字符串，返回给前端