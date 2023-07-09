import './App.css';
import Calculate from './components/Calculate';
import CalculateNew from './components/Calculate/CalculateNew';
import UseEffectCom from './components/useEffect';

function App() {
  return (
    <div className="App">
      <h1>demo1</h1>
      <h2>一个计算组件中，耦合了一个时间计时器</h2>
      <Calculate/>
      <h2>经过记忆化后，输出字符串中的时间没有变化</h2>
      <CalculateNew/>
      <h1>demo2-useEffect</h1>
      <h2>把函数作为effect依赖</h2>
      <UseEffectCom />
    </div>
  );
}

export default App;
