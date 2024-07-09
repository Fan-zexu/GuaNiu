#  从CLI命令开始

## rtx

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

