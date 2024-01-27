# 读书笔记

尽管《高性能javascript》这本书比较旧，但是里面提到的一些技巧还是让我收益。

## DOM相关

当今前端主要用UI框架来工作，大多数情况下不会接触底层DOM，但是如果想要自由框架，或者学习底层实现，是需要了解DOM操作的。

1. `NodeList`和`HTML集合`

在批量处理`DOM节点`时，操作`NodeList`性能优于`HTML集合`

比如使用 `querySelectAll`这样的原生`CSS API`，获取到的是`NodeList`。而使用 `getElementByTagName`获取到的是 `HTML集合`