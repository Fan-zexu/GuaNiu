#  从CLI命令开始

## 实现一个CLI需要哪些知识点

### 自定义命令

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


## CLI 命令——rtx

枚举出`rtx cli`支持哪些功能

```js
#! /usr/bin/env node

const program = require('commander')
const D = require('@rtx/dotter')
const { getPkgVersion, printPkgVersion } = require('../dist/util')

printPkgVersion().then(() => {
  program
    .version(getPkgVersion())
    .usage('<command> [options]')
    .command('init [projectName]', 'Init a project with default templete')
    .command('build', 'Build a project with options')
    .command('update', 'Update packages of rtx')
    .command('convert', 'Convert weapp/rn to rtx')
    .command('info', 'Diagnostics R2X env info')
    .command('doctor', 'Diagnose rtx project')
    .command('add', 'Add runtime component/api')
    .command('release', 'release runtime component/api')
    .command('runtime', 'add/release/update runtime')
    .command('module', 'init/dev/build module')
    .command('page', 'add')
    .command('depcheck', 'depcheck')
    .command('ui', 'init/dev/add/publish/update ui')
    .parse(process.argv)

  D.dotCLI({ cmdType: program.args[0], argv: process.argv, cwd: process.cwd() })
})

```

可以学到什么：

- 用代码描述命令行界面的工具包：[commander](https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md)
