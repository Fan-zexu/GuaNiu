import React from 'react';

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

  export default useTime;