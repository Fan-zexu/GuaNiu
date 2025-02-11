# Cursor 版本

## 1. 项目概述

MachPro 是美团外卖核心流量区的全页面动态化解决方案。主要支持 H5 和小程序两端的开发。

## 2. 项目结构

### 2.1 主要目录结构

```
waimai_fe_mach
├── examples     # 示例代码
├── packages     # 核心源码
└── scripts      # 工具脚本
```

### 2.2 核心包分析

#### 基础包
- **mach-pro-core**: 运行时核心 SDK
- **mach-pro-components**: 基础组件库
- **mach-pro-store**: 状态管理工具

#### 编译构建相关
- **babel-plugin-mach-pro**: JSX 转换核心模块
- **mach-pro-react-build**: 打包构建工具

#### 小程序相关
- **mach-pro-wechat-native-module**: 小程序运行时模块
- **miniprogram-element**: 小程序渲染器
- **miniprogram-render**: 小程序渲染器

## 3. 构建系统

### 3.1 构建工具

项目使用 Rollup 作为主要构建工具，每个包都有独立的 rollup 配置：


```js 1:24:packages/mach-pro-core/rollup.config.js
import resolve from "@rollup/plugin-node-resolve";
import path from "path";
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';


const extensions = ['.js', '.jsx', '.ts', '.tsx']
export default [{
    input: 'src/index.ts',
    output: {
        name: pkg.injectGlobalName,
        file: 'index.js',
        format: 'iife'
    },
    plugins: [
        resolve({
            rootDir: path.join(process.cwd(), "../.."),
            moduleDirectories: ["node_modules", "packages"],
            extensions
        }),
        typescript({ tsconfig: './tsconfig.json' }),
    ],
    acornInjectPlugins: [require('acorn-jsx')()]
}];
```


主要构建特点：
- 使用 TypeScript 
- 支持 JSX 语法
- 支持多种输出格式(ES/CJS/IIFE)

### 3.2 构建命令

```
dev        - 开发模式
build      - 构建
dev:wechat - 小程序开发
build:wechat - 小程序构建
```

## 4. 业务配置

项目支持业务级配置，通过 mach.config.js 进行配置：


```js 1:25:examples/FoodList/mach.config.js
/*
  页面级配置
  biz：业务线，以事业部为单位
  page：页面名称
*/
module.exports = {
    "biz": "waimai",
    "page": "index",
};

/*
  模块级配置
  biz：业务线，以事业部为单位
  subBiz：子业务线，用户、营销、广告等
  product：产品线
  style：样式名称
*/
/*
module.exports = {
    "biz": "",
    "subBiz": "",
    "product": "",
    "style": ""
};
*/
```


配置项包括：
- biz: 业务线
- page: 页面名称
- subBiz: 子业务线
- product: 产品线
- style: 样式名称

## 5. 技术特点

### 5.1 跨端支持
- 支持 H5
- 支持小程序
- 支持 MSC(美团组件)

### 5.2 组件化方案
- 标准组件库
- 自定义组件支持
- 样式隔离

### 5.3 工程化
- TypeScript 支持
- Monorepo 管理
- 统一构建系统
- 自动化发布

## 6. 开发流程

1. 安装依赖
```bash
yarn install
yarn run bootstrap
```

2. 初始化项目
```bash
yarn run init
```

3. 开发调试
```bash
yarn run dev        # H5开发
yarn run dev:wechat # 小程序开发
```

4. 构建发布
```bash
yarn run build      # 构建
yarn run release    # 发布
```
