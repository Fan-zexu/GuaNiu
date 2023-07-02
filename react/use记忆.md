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