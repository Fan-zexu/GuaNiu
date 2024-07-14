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

## rtx build

直接进入重点

```js
updateProjectForPlugin().then(() => {
  program
    .option('--type [typeName]', 'Build type, weapp/h5/rn')
    .option('--watch', 'Watch mode')
    .option('--env [SERVER_ENV]', 'Server Env, dev/test/stage/prod')
    .option('--port [port]', 'Specified port')
    .option('--node-env [NODE_ENV]', 'Node Env type')
    .option('--entryName [entryName]', 'MRN EntryName')
    .option('--v2', 'Use MRN 2.0')
    .option('--public-path [publicPath]', 'publicPath for H5')
    .option('--subpage', 'Mini Program Page')
    .option('--lazy', 'Mini Program Lazy Load')
    .option('--server', 'R2X-Tango dev server')
    .parse(process.argv)

// 中间各种环境变量、watch等辅助逻辑

build(appPath, {
    type,
    watch,
    entryName,
    port: typeof port === 'string' ? port : undefined,
    useV2: !!v2,
    publicPath,
    subpage: !!subpage,
    lazy: !!lazy,
    server
})
```

1.`updateProjectForPlugin` 更新项目为插件化项目

2.`build`开始执行构建

### updateProjectForPlugin

```js
export async function updateProjectForPlugin() {
    /**
     * configPath 是项目根目录下的 rtx.config.js
     */
    if (fs.existsSync(configPath)) return;

    /**
     * spinner 是 「ora」这个npm包提供的进度条功能
     */
    const spinner = ora({ text: '开始升级项目' }).start();

    // 插件集合
    const plugins = []

    try {
        // 获取项目配置信息，包括 weapp | h5 | rn 相关的配置，以及框架提供的各种能力配置
        const projectConfig = getProjectConfig();

        // 注入3个端主要插件
        plugins.push(['@rtx/plugin-container-h5', h5Config])
        plugins.push(['@rtx/plugin-container-mrn', _.get(projectConfig, 'mrn', {})])
        plugins.push(['@rtx/plugin-container-tango', {}])

        // 注入框架提供的其他能力，比如小工具、埋点
        plugins.push(['rtx:env-tools']);
        plugins.push(['rtx:lx'])

    } catch() {

    }
}
```