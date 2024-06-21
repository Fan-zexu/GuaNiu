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

### 其他

- @rtx/eslint-config-rtx

- @rtx/eslint-plugin-rtx

## 组件和API的设计和适配

rtx的目的就是一套代码多端运行，但是多端上的差异，需要设计一套统一的标准规范来抹平。

### 多端差异

#### 组件（标签）差异

- h5标签采用XML写法，类似标签有 `<div>` `<span>`等

- 小程序采用WXML（WeiXin Markup Language）标签语言，同时也有完整的基础组件，但和h5差异较大

- ReactNative 采用JSX，有自己的一套基础组件，和h5 小程序也截然不同

#### API差异

- 接口差异：在不同端中都提供了相同或近似的功能，但实现方式以及调用参数可能存在极大差异。比如数据缓存`Storage`，小程序中`wx.setStorage/wx.setStorageAsync`，h5中`localStorage.setItem`，RN中`AsyncStorage,setItem`

- 容器差异：各个端提供的API都是各自的容器定制的，比如小程序的用户接口类API、广告类API，完全是针对小程序所处的微信环境打造的

- 能力差异：并不是所有功能点在各个端上都可以适配实现，就比如h5中就无法像在小程序或RN中使用文件读取能力，这一类差异性在适配过程中都属于不可抗拒，不可抹平的差异