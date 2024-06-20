# 是什么

以下用“rtx”代表ReactToX

一款容器无关框架，一套代码多端复用。支持RN,Webview，小程序，Flutter

## 业界竞品

- mpvue 美团

- wepy 腾讯

- Chameleon 滴滴

- Taro 京东

## 使用

全局安装cli

```
yarn global add @rtx/cli
```

初始化项目

```
rtx init
```

顾`rtx`项目支持`cli`脚手架能力，来初始化工程应用。


# 原理

## 结构预览

### 运行时

- @rtx/rtx 运行时框架

- @rtx/rtx-h5  h5运行时框架

- @rtx/rtx-weapp WX小程序运行时框架

- @rtx/rtx-mrn mrn运行时框架

- @rtx/router 路由

- @rtx/router-mrn mrn路由

- @rtx/components 基础组件库

- @rtx/components-mrn 基础组件库

- @rtx/async-await 请求库

- @rtx/utils 工具包
 
### 编译时

- @rtx/cli 开发工具

- @rtx/transformer-x ? 各端 转换工具

- @rtx/webpack-runner h5 webpack 编译工具

- @rtx/rtx-plugin-babel 编译插件

- @rtx/rtx-plugin-css/less/scss/stylus css编译插件

- @rtx/rtx-plugin-typescript ts编译插件

- @rtx/rtx-plugin-uglifyjs 压缩编译插件

- @rtx/postcss-pxtransform 单位编译插件

- @rtx/babel-plugin-transform-api 编译插件

