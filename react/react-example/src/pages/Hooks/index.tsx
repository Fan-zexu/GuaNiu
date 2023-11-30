import Calculate from './components/Calculate';
import CalculateNew from './components/Calculate/CalculateNew';
import UseEffectCom from './components/useEffect';
import ClassEffectCom from './components/ClassEffect';
import RaceWrap from './components/RaceWrap';

function Hooks() {
  return (
    <div className="hooks">
      <h1>demo1</h1>
      <h2>一个计算组件中，耦合了一个时间计时器</h2>
      <Calculate/>
      <h2>经过记忆化后，输出字符串中的时间没有变化</h2>
      <CalculateNew/>
      <h1>demo2-useEffect</h1>
      <h2>把函数作为effect依赖</h2>
      <UseEffectCom />
      <h2>看看class组件表现</h2>
      <ClassEffectCom />
      <h2>竞态</h2>
      <RaceWrap />
    </div>
  );
}

export default Hooks;
