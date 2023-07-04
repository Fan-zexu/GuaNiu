import './App.css';
import Calculate from './components/Calculate';
import CalculateNew from './components/Calculate/CalculateNew';

function App() {
  return (
    <div className="App">
      <h1>demo1</h1>
      <h2>一个计算组件中，耦合了一个时间计时器</h2>
      <Calculate/>
      <h2>经过记忆化后，输出字符串中的时间没有变化</h2>
      <CalculateNew/>
    </div>
  );
}

export default App;
