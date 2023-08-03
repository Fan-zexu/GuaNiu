# monorepo

Monorepo是一种项目管理方式，在它之前，管理方式是MultiRepo，即每个项目对应一个仓库。这会导致一些弊端，比如代码管理分散、相同功能在每个仓库重复维护等问题。

常见Monorepo工具有：

| 工具      | 简述 |
| ----------- | ----------- |
| Bit      | 用于组件驱动开发的工具链  |
| Turborepo   | 用于 JavaScript 和 TypeScript 代码库的高性能构建系统        |
| Nx   | 用于开发和维护大型前端应用程序的工具集        |
| Lerna   | 用于管理包含多个软件包的JavaScript项目的工具        |
| Rush   |    支持跨项目构建；多进程编译     |

# Turborepo

## 是什么

Turborepo 是一个适用于 JavaScript 和 Typescript monorepo 的高性能构建工具，它不是一个侵入式的工具，你可以在项目中渐进的引入和使用它，它通过足够的封装度，使用一些简单的配置来达到高性能的项目构建。
和esbuild一样，Turborepo也是基于go实现的工具，在语言层面上就具有一定的性能优势。


这里大家可以了解下它的兄弟产品**Turbopack**，号称比`vite`还快10倍的构建工具🐂🍺

## 优势

### 多任务并行处理
