# MutationObserver

用于监听DOM变化的浏览器原生API，兼容性还不错。

[阮一峰教学](https://javascript.ruanyifeng.com/dom/mutationobserver.html)

使用场景：

之前记录使用react实现一个容器组件，希望这个容器对于子组件的样式和布局影响尽量最小。[见这里](../react/随便写写.md)

其中用到了`React.cloneElement和React.Children.only`配合将容器组件的属性id，转移到子组件的根节点上。

但是在找子组件根节点，如果子组件是一个异步组件，就会导致无法获取dom元素的情况，这时就可以使用`MutationObserver API`监听页面元素变动，在变动结束的回调中就可以获取到子节点的dom元素

demo:

```ts
const debounceCallback = debounce((mutations: any, mutationOb: MutationObserver) => {
    target = querySelector(selector);
    if (target) {
        console.log('成功获取selector:', selector, target);
        observer.observe(target);
        mutationOb.disconnect();
    }
}, 300);

const mutationObserver = new MutationObserver(debounceCallback);

mutationObserver.observe(document.body, {
    childList: true, subtree: true, attributes: false, characterData: false,
});
```

这里使用`debounce`做了一下优化。