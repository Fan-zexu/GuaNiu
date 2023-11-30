import { useState } from 'react';
import useTime from './useTime';
import RecordRender from '../Record';

export default function Calculate() {
    const [selectedNum, setSelectedNum] = useState(10);
    const timer = useTime();

    const calculateNum = () => {
        return `${selectedNum * 2}----${timer}`;
    }

    return (
        <div>
            <RecordRender />
            <input value={selectedNum} type="number" onChange={(e) => { setSelectedNum(+e.target.value) }} />
            <p>
                { calculateNum() }
            </p>
        </div>
    )
};