# 关于内存泄漏

## console.log

最近发现开发页面时一段时间之后，电脑风扇就会起飞，及时没有开很多tab、应用，也是如此。然后我突然发现这篇文章，`console.log`也会引起性能问题。下面我就来尝试下~

[console.log](https://juejin.cn/post/7185128318235541563)

后续来了...

[不开devtools 就不会产生泄漏](https://juejin.cn/post/7185501830040944698?from=search-suggest)

所以在本地开发阶段，存在大量`consolelog`不仅会增加存储，而且在打开`devtools`时，它不会GC掉`consolelog`中输出的数据，所以会导致内存溢出，电脑风扇起飞