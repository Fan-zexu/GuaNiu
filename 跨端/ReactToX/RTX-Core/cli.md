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
}
```

1.`updateProjectForPlugin` 更新项目为插件化项目

2.`build`开始执行构建

### updateProjectForPlugin

```js

const cwd = process.cwd()
const configPath = path.join(cwd, 'r2x.config.js')

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


        // 生成rtx.config.js
        // JSON.stringify 第三个可选参数 space 用于控制缩进和空格，这里设置缩进为4个空格，更易度
        fs.writeFileSync(configPath, `module.exports = ${JSON.stringify({ plugins }, null, 4)}`)

        // 更新package.json dependence 信息
        // ...
        fs.writeFileSync(path.join('package.json'), JSON.stringify(projectPkg, null, 2))
        

        // 进度成功结束
        spinner.succeed();

        // 安装依赖
        await install(cwd);

    } catch() {

    }
}
```

### install 安装依赖方法

```js
const { exec } = child_process;


const install = (p: string) => {
    const spinner = ora(chalk.yellow('开始安装依赖~')).start();
    // 更新当前工作目录为 process.cwd()
    process.chdir(p);

    // 提供yarn命令
    const command = 'yarn install --registry=http://r.npm.com';

    return new Promise((resolve, reject) => {
        // 通过子进程执行命令
        exec(command, (err, stdout, stderr) => {
            spinner.stop();
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}
```

### build方法

```js
export default async function build(appPath, buildConfig) {
    const {
        type // 构建类型
    } = buildConfig;

    switch(type) {
        case BUILD_TYPES.H5:
            buildForH5(appPath, { watch, port })
            break;

        case BUILD_TYPES.RN:
            buildForRN(appPath, { watch, port })
            break;

        case BUILD_TYPES.WEAPP:
            buildForWeapp(appPath, { watch, port })
            break;
    }
}
```

#### buildForH5

```js
// cli-build
export async function build(appPath, buildConfig) {
    // 编译功能 在Compiler中实现
    const compiler = new Compiler(appPath);
    await compiler.clean();
    await compiler.buildTemp();
    await compiler.buildDist(buildConfig);

    if (buildConfig.watch) {
        compiler.watchFiles();
    }
}

// helper.js
import * as rimraf from 'rimraf'  // UNIX命令：rm -rf ，支持跨平台

export const pRimraf = promisify(rimraf);

// compiler-h5.js
class Compiler {
    constructor() {
        this.tempDir = Config.TEMP_DIR;  // '.temp';
        this.tempPath = path.join(appPath, this.tempDir)
    }

    async clean() {
        const tempPath = this.tempPath
        const outputPath = this.outputPath

        try {
            // 清理.temp output 文件夹
            await pRimraf(tempPath)
            await pRimraf(outputPath)
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * 经过AST将源码进行转换输出到temp临时目录中
     */
    buildTemp() {
        const tempPath = this.tempPath;
        const outputPath = this.outputPath;
        const appPath = this.appPath;

        // 是fs-extra库提供的方法，是fs的扩展
        // ensureDirSync 方法作用是保证目录存在，如果不存在则创建，是一个同步方法，无回调
        fs.ensureDirSync(tempPath);

        return new Promise((resolve, reject) => {
            klaw(sourcePath)
                .on('data', file => {
                    const relativePath = path.join(appPath, file.path);
                    if (!file.stats.isDirectory()) {
                        console.log('发现文件', relativePath);
                        this.processFiles(file.path);
                    }
                })
                .on('end', () => {
                    resolve();
                })
        })
    }
}
```

`klaw`是一个基于node fs实现的npm包，用于以流形式处理目录或文件，用法通过监听`data`事件，得到`file`对象，包含`path`和`stats`信息。

通过`end`事件，遍历完成。error：遍历过程中发生错误时触发。

接下来进入 `processFiles`方法

```js
function processFiles(filePath) {
    const sourceRoot = this.sourceRoot
    const tempDir = this.tempDir

    const file = fs.readFileSync(filePath)
    const dirname = path.dirname(filePath) // 目录名
    const extname = path.extname(filePath) // 文件后缀
    const distDirname = dirname.replace(sourceRoot, tempDir) // 从src下改到 .temp下
    const isScriptFile = REG_SCRIPTS.test(extname) // tsx | jsx
    const distPath = this.getDist(filePath, isScriptFile)


    try {
        // 是脚本文件
        if (isScriptFile) {

        } else {
            // 其他 直接复制
            fs.ensureDirSync(distDirname);
            fs.copySync(filePath, distPath)
        }
    } catch() {

    }
}
```