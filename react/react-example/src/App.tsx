import './App.css';
import Calculate from './components/Calculate';

function App() {
  return (
    <div className="App">
      <h1>demo1</h1>
      <p>一个计算组件中，耦合了一个时间计时器</p>
      <Calculate/>
    </div>
  );
}

export default App;
