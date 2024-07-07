# 实现一个CLI需要哪些知识点

## 自定义命令

比如在`npm script`中想这么定义：

```json
{
    "scripts": {
        "build": "rtx build"
    }
}
```

这里的rtx 就是自定义命令，需要我们在package.json中的`bin`属性下来定义命令入口

```json
{
    "bin": {
        "rtx": "bin/rtx"
    }
}
```

通常会把可执行命令文件放在`bin`目录下，代表可执行的命令文件。

其次，在`bin/rtx`文件顶部，必须有`#!/usr/bin/env node`声明，代表需要用Node来执行该脚本。

```js
#!/usr/bin/env node

console.log('rtx...');
```