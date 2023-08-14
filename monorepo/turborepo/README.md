# monorepo

Monorepo是一种项目管理方式，在它之前，管理方式是MultiRepo，即每个项目对应一个仓库。这会导致一些弊端，比如代码管理分散、相同功能在每个仓库重复维护等问题。

Monorepo 必备3大能力：

- 依赖管理能力
- 任务编排能力
- 版本发布能力


常见Monorepo工具有：

| 工具      | 依赖管理能力 | 任务编排能力 | 版本发布能力 |
| ----------- | ----------- | ----------- | ----------- |
| Pnpm Workspace | ✅  |  ✅ | ❌ |
| Rush   | ✅  | ✅ | ✅ |
| Lage   | ❌ | ✅ | ❌ |
| Lerna   | ❌ | ✅ | ✅ |
| Turborepo | ❌ | ✅ | ❌ |

- [Pnpn](https://pnpm.io/) Pnpm除了具备高性能的依赖管理能力之外，还可以通过 `--filter`参数支持一定任务编排，所以也将其列入。
- [Rush](https://rushjs.io/) 由微软开源的可扩展 Monorepo 管理方案，内置 PNPM 以及类 Changesets 发包方案，其插件机制是一大亮点，使得利用 Rush 内置能力实现自定义功能变得极为方便
- [Lage](https://microsoft.github.io/lage/) 同样是微软开源，可以算是`Turbo`前身，同样是Go语言实现，但相较于`Turbo`人气差了一个级别。
- [Lerna](https://lerna.js.org/) 比较成熟，中规中矩menorepo方案，目前已经停止维护。

依赖管理过于底层，版本控制较为简单且已成熟，将这两项能力再做突破是比较困难的，实践中基本都是结合 `Pnpm` 以及 `Changesets` 补全整体能力，甚至就干脆专精于一点，即任务编排，也就是 Turborepo 的发力点。


# Turborepo

## 是什么

Turborepo 是一个适用于 JavaScript 和 Typescript monorepo 的高性能构建工具，它不是一个侵入式的工具，你可以在项目中渐进的引入和使用它，它通过足够的封装度，使用一些简单的配置来达到高性能的项目构建。
和esbuild一样，Turborepo也是基于go实现的工具，在语言层面上就具有一定的性能优势。

这里大家可以了解下它的兄弟产品**Turbopack**，号称比`vite`还快10倍的构建工具🐂🍺

`Turborepo`和`Turbopack`两款产品，底层依赖`Turbo`

## 优势

### 多任务并行处理

在我们对多个子包执行构建时，`Turbo`会并行执行多个任务，这样可以大大提高构建速度。

对比传统的`lerna`或者`yarn`，它们内部都提供了类似`workspace run`这样的命令。每个子项目的`script`脚本，都以**拓扑**方式被运行。

什么是**拓扑**

> 拓扑 是一种排序 拓扑排序是依赖优先的术语， 如果 A 依赖于 B，B 依赖于 C，则拓扑顺序为 C、B、A。
> 比如一个较大的工程往往被划分成许多子工程，有些子工程必须在其它有关子工程完成之后才能开始，也就是说，一个子工程的开始是以它的所有前序子工程的结束为先决条件的

下面对比图，来看`Turbo`和`lerna`处理任务的方式

子包关系：

![任务关系](./images/your-monorepo-excalidraw.webp)

`lerna`执行任务：

![lerna执行任务](./images/yarn-workspaces-excalidraw.webp)

`Turbo`执行任务：

![turbo执行](./images/turborepo-excalidraw.webp)

很明显，`Turbo`可以并行执行多个任务，而`lerna`只能串行执行。性能不言而喻

### 增量构建

`Turbo`中依赖缓存机制(会记录构建内容，并跳过已经计算过的内容)，实现增量构建，提升构建效率。

### 云缓存

`Turbo`通过其远程缓存功能可以帮助多人远程构建云缓存实现了更快的构建。

### 任务管道

可以用配置文件定义任务间的关系，然后让`Turbo`优化构建内容和时间

### 约定配置

通过约定降低复杂性，只需几行`JSON`即可配置整个项目依赖，执行脚本的顺序

### 浏览器中的配置文件

生成构建配置文件，可以在浏览器中查看任务的花费时长。

## Turbo核心概念

### 管道

#### DependsOn依赖

#### 常规依赖

#### 拓扑依赖