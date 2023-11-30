import React, { useEffect, useState, useRef } from "react";
import useTime from "./Calculate/useTime";

interface UseEffectCom2Props {
    id: number;
}

const GetPreProps: React.FC<UseEffectCom2Props> = ({id}) => {    
    useEffect(() => {
        console.log('GetPreProps--id,,,', id);
        return () => {
            console.log('GetPreProps--cleanup--id,,,', id);
        }
    }, [id]);
    return (
        <div>自增id{id}</div>
    )
}

const GetPrePropsCom = React.memo(GetPreProps);

function Container() {
    const timer = useTime();
    const [id, setId] = useState(0);
    return (
        <>
            <UseEffectCom timer={`${timer}`}/>
            <GetPrePropsCom id={id} />
            <button onClick={() => { setId(id + 1) }}>UseEffectCom2自增id</button>
            <br/>
            <OldStateCom />
            <br />
            <p>通过ref来解决上面，获取历史state的问题</p>
            <ExampleRef />
        </>
    )
}


function UseEffectCom({ timer }: any) {
    const [count, setCount] = useState(0);
    
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

function OldStateCom() {
    const [count, setCount] = useState(0);

    function handleAlertClick() {
      setTimeout(() => {
        alert('You clicked on: ' + count);
      }, 3000);
    }
  
    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
          Click me
        </button>
        <button onClick={handleAlertClick}>
          Show alert
        </button>
      </div>
    );
}

// 通过ref来得到最新的值
function ExampleRef() {
    const [count, setCount] = useState(0);
    const ref = useRef<number>();
  
    function handleAlertClick() {
      setTimeout(() => {
        alert('You clicked on: ' + ref.current);
      }, 3000);
    }
  
    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => {
              setCount(count + 1);
              ref.current = count + 1;
          }}>
          Click me
        </button>
        <button onClick={handleAlertClick}>
          Show alert
        </button>
      </div>
    );
  }

export default Container;