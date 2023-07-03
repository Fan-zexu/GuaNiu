import { useState } from 'react';
import useTime from './useTime';

export default function Calculate() {
    const [selectedNum, setSelectedNum] = useState(10);

    const calculateNum = () => {
        console.log('经过了复杂计算');
        return selectedNum * 2;
    }

    const timer = useTime();

    return (
        <div>
            <input value={selectedNum} type="number" onChange={(e) => { setSelectedNum(+e.target.value) }} />
            <p>
                { calculateNum() }
            </p>
            <p>
                计时器：{ timer.toString() }
            </p>
        </div>
    )
};