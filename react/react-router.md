# 前面

`react-router`和`react-router-dom`和`history`三者关系？？？

`history`是`react-router`底层实现核心，主要基于`popState` `pushState` `replaceState`等api实现

`react-router`实现了路由核心功能，包括`Router``Route``Switch`重要核心组件。它是`react-router-dom`的底层依赖，所以项目中直接引入`react-router-dom`即可

`react-router-dom`，在`react-router`基础上实现了跳转组件`Link`，和`history`模式下的`BrowserRouter`组件和`hash`模式下的`HashRouter`组件等。


# 原理分析

## `history api`

主要利用`history api`来实现，主要功能：

- `history.back` 后退

- `history.forward` 前进

- `history.go`，参数是数字，比如 `go(0)`刷新，`go(1)`前进一个，`go(-1)`后退一个

- `history.replaceState`，**替换**原有`history` ，用法`history.replaceState({a: 1}, '', 'https://baidu.com')`

接收3个参数：

1. 第一个是`state`相当于是url携带的参数，但是不会体现在url里

2. 第二个是`title`，基本不支持

3. 第三个是替换的`url`

使用后，不会新增历史记录，而是替换

- `history.pushState`，**新增history**，`history.pushState({a: 1}, '', 'xxxxurl')`

有一个问题，在`pushState`之后，后面的历史记录就会被清空

- `history.scrollRestoration`，用来保留滚动位置的，默认是`auto`，会自动定位到上次滚动的位置。`manual`就不会

## history 事件

1. `popState`，当在导航中执行`forward`、`back`、`go`操作时，就会触发`popState`，

但是 `pushState`、`replaceState`就不会触发`popState`

```js
window.addEventListener('popState', event => { console.log(event) } )
```

2. `hashchange`

它只能监听`#`井号后面的内容变化，功能相比`popState`薄弱，`react-router`也是使用`popState`实现的


# 源码

从`createBrowserRouter`入口方法入手：

调用`createRouter`，内部传入`history`对象，这个`history`不是原生api，而是封装一层后的。主要包括`listen` `push` `replace` `go` 4个方法

![history](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64qUlBX8xMJIzbQ6JHyZ1qQYG2j51cLX9quTj6XKrCuLdibnT4fJuR0JicQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

`listen`主要监听了`popstate`事件，`go` `push` `replace`就是对`history api`的封装

![push](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64qlDyoX6w3WraTibaEcYORJAB4NZiaAbJaTQqib7s6cYaywowYefMLxObcw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

![replace](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64qk0aS6iaicpFtaviaypDklklBcmzwL6RyFCRGogfGJ226r1vecVBcZmRNQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

此外`history` 还封装了 `location`，可以不用从`window`上获取了  `history.location`

## url匹配渲染组件流程

从这里开始，进入`createRouter`：

对`routes`配置和 `location`做一次匹配，

![matchRoutes](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64qObNuK8EGAgoBbxZfylIJfG8dVNF8fZRaXzOc9nnSWQpFv3zlQXxfJw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

通过`matchRoutes`把`routes`中的嵌套路由拍平，然后和`location`匹配

![matchRoutes](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64q5STcKHaooyaxSIv4ibBtb1EmdfTO7mZd7ibBEB2UrW8XYiblCJfTkrDPQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

然后就可以得到匹配路由中要渲染的组件

![element](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64qd9vKRe1XeoIM533l4BhgjBs4WZ7sUz0pyF7AicGVNLpoGbbclZqibIfA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

在组件树渲染时，就知道渲染什么组件了

![render](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64qqvDPDzkKPqz9qY4D37gcpia09PTFdrVWTNuaASWxr2ds4u72MyLA7zg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

这就是路由对应组件的过程

**流程小结**

![init](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64qdUd3tW8TqicI0uTYwM63zdR0ibnF92a5AoteOTicicQ4tecdVbb4b9ichUA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)


## 通过link跳转渲染组件流程

点击link组件

![link](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64qP6kib6E7bODPmUibyIy1k4CvIRt58QgWB8KIjCfH55F7JU1Ab3JhTULg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

`useLinkClickHandler`内部调用`navigate`

![navigate](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64qU8KlKst6mbpS7XPL91T9ibhHpmasu8foe3QXhDV4h0bcC4aeKgXtlhw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

![navigate2](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64qA0ezQ4jF1pazEDiacBAibaiaiaaTib4QcCXpxDaB2vbf05p7qsYycTNejCw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

之后又回到`matchRoutes`流程

![return matchRoutes](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64qGE1XPKkicXLOegodtMiaUjMibbPuyQBKzbds6VyJxVTFHn4p1fvae0UJQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

`match`完之后，会`pushState`或`replaceState`，然后更新`state`：

![updatestate](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64qDC07iaQOF4uib41cHicIgvdtvGd2CLasvfibr8bzBd1ndvc8yXNiaspKYVQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

触发`setState`之后，就会触发组件树的重新渲染

![rerender](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64qII2tAcPFdSc6OEduFYB6JQVqOqHKYS0kUiatJLbfKE2NDKOpRxwhxfg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1&retryload=1)

![routerProvider](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64qkc3nfa8uSVVfD2zMBcRibg725dwMpmaDiaeIULn94sG3xjJquE6w726A/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

**小结**

![link](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64quo7GicaStTicgXt2JLPib2vF1aLZeOcoTztldw4diaOYTVPWwugY047Hfg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

router.navigate 会传入新的 location，然后和 routes 做 match，找到匹配的路由。

之后会 pushState 修改 history，并且触发 react 的 setState 来重新渲染，重新渲染的时候通过 renderMatches 把当前 match 的组件渲染出来。

而渲染到 Outlet 的时候，会从 context 中取出当前需要渲染的组件来渲染：

![outlet](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64qHJOyYSW8r0QUwKricfvEKRwmTqU5KGFkfSzkA6TbuEILQOUz3cI2yjA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

![useOutlet](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64qibaexYS1AlrmK3cqQy73bB6dPYgEPFqXF7h529vSibeMdz07sbFacIaQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

# 这个`outlet`是什么，疑惑？？？

## 前进后退按钮流程

监听`popstate`，再做一次`navigate`

![listen](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64qibbnHMsxUl8j9hMOiau9y1jEDia3D0bicApjD52XulQsd61soSjVQF6ShA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

![hanldePop](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64qndYfQ2GKLszKnXd06DnSo1jb7lhRMPZDBx2ojOBMeZD8IoWmiciaDrPw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

![startNavigate](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64quMK8zyBdInniaf0wo8CreXnkLJmO6EVjlI8JpycU3xAWH2g44xhGZCg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

**流程小结**

![小结](https://mmbiz.qpic.cn/sz_mmbiz_png/YprkEU0TtGhmwWwERIFjthlb0DvhL64qdtYdbvkMQx1v4awl4cuWfOAq0Pccibpsk7q6ia8yVTgSOYBygiceUUwMA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

