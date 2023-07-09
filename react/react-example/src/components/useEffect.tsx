import { useEffect, useState } from "react";
import useTime from "./Calculate/useTime";

function Container() {
    const timer = useTime();
    return (
        <UseEffectCom timer={`${timer}`}/>
    )
}


function UseEffectCom({ timer }: any) {
    let [count, setCount] = useState(0);
    
    function fetchData() {
        console.log('fetchData', timer);
        setCount(timer)
    }

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <>
            <div>useEffect--{count}</div>
        </>
    )
}

export default Container;