// 经过优化的计算组件
import { useState, useMemo } from 'react';
import useTime from './useTime';
import RecordRender from '../Record';

export default function Calculate() {
    const [selectedNum, setSelectedNum] = useState(10);
    
    const timer = useTime();

    const memoCalculate = useMemo(() => {
        console.log('记忆后---复杂计算');
        return `${selectedNum * 2}----${timer}`;
    }, [selectedNum])


    return (
        <div>
            <RecordRender/>
            <input value={selectedNum} type="number" onChange={(e) => { setSelectedNum(+e.target.value) }} />
            <p>
                { memoCalculate }
            </p>
        </div>
    )
};