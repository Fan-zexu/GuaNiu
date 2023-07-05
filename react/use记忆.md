# useMemo useCallback

看个反面例子

```js
function Calculator() {
    const [selectedNum, setSelectedNum] = React.useState(100);

    const calculateNum = () => {
        // 很复杂计算
        // selectedNum ....
        return selectedNum;
    }

    return (
        <div>
            <input value={selectedNum} onChange={(e) => { setSelectedNum(e.target.value) }} />
            <p>
                { calculateNum() }
            </p>
        <div>
    )
}
```
首先这里是一个有复杂计算逻辑的组件，用户输入一个值，经过计算后展示一个新的值。

经过迭代，我们不小心在里面加了一个“牛逼”组件，比如计时器日期。是不是很像平时业务开发中遇到的场景...

```js
function Calculator() {
    const [selectedNum, setSelectedNum] = React.useState(100);

    const calculateNum = () => {
        // 很复杂计算
        // selectedNum ....
        return selectedNum;
    }

    const time = useTime();

    return (
        <div>
            计时器: { time }
            <input value={selectedNum} onChange={(e) => { setSelectedNum(e.target.value) }} />
            <p>
                { calculateNum() }
            </p>
        <div>
    )
};
```
```js
function useTime() {
  const [time, setTime] = React.useState(new Date());
  
  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTime(new Date());
    }, 1000);
  
    return () => {
      window.clearInterval(intervalId);
    }
  }, []);
  
  return time;
}
```
效果显而易见，每一秒钟`Calculator`组件都在渲染，即使用户并没有在input中输入。

我们直接使用*记忆化*来改造：

```js
import { useMemo } from 'react';

// 给原来计算属性增加一层useMemo，第二个参数传入记忆参数
const memoCalculateNum = useMemo(() => {
    return selectedNum * 2;
}, [selectedNum])
```

这里`useMemo`的第二个参数，实际就是记忆失效的策略，只有当`selectedNum`值发生变化，记忆才会失效。

## 由于引用导致的记忆失效

虽然我们可以使用`React.memo`或者`useMemo`来进行记忆优化，但是有很多不小心的用法，会打破我们的记忆...

```js
// App.tsx
function App() {
    const [name, setName] = React.useState('');
    const [boxWidth, setBoxWidth] = React.useState(1);

    const boxes = [
        { flex: boxWidth, background: 'hsl(345deg 100% 50%)' },
        { flex: 3, background: 'hsl(260deg 100% 40%)' },
        { flex: 1, background: 'hsl(50deg 100% 60%)' },
    ];

    return (
        <>
            <Boxes boxes={boxes} />
            <button onClick={
                () => {
                    setBoxWidth(Math.floor(Math.random() * 10) + 1);
                }
            }/>
            <input type="text" value={name} onInput={(e) => { setName(e.target.value) }}/>
        </>
    )
}

// Boxes.tsx
function Boxes() {
    return (
        <div className="boxes-wrapper">
            {boxes.map((boxStyles, index) => (
                <div
                key={index}
                className="box"
                style={boxStyles}
                />
            ))}
        </div>
    )
}
// 这里对组件做了记忆，只有当boxes发生变化时，才会重新渲染
// 此时Boxes是一个纯组件
export default React.memo(Boxes);
```

这段代码的我们期望是，当`name`变化时，`Boxes`组件不会重新渲染，只有当`boxes`变化时，`Boxes`组件才会重新渲染。

但是实际上，当我们输入`name`时，`Boxes`组件也会重新渲染，这是为什么呢？

因为`boxes`是一个引用类型，当`App`组件重新渲染时，`boxes`的引用也会发生变化，即使`boxes`的值没有发生变化。

上面都是我用copilot生成的... 我去，有点牛逼了。

---

这里在补充一点，react的props对比，是采用的浅比较，即只比较引用，不比较值。


这里我们可以使用`useMemo`来解决这个问题：

```js
const boxes = useMemo(() => [
    { flex: boxWidth, background: 'hsl(345deg 100% 50%)' },
    { flex: 3, background: 'hsl(260deg 100% 40%)' },
    { flex: 1, background: 'hsl(50deg 100% 60%)' },
], [boxWidth]);
```

