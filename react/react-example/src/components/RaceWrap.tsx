import { useEffect, useState } from "react";

const RaceCom = ({id}: {id: number}) => {
    const [article, setArticle] = useState(null);

    useEffect(() => {
        let didCancel = false;
        console.log('didCancel---', id, didCancel);
        
        async function fetchData() {
            const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
            const data = await res.json();
            if (id%2 === 0) {
                setTimeout(() => {
                    console.log('fetch----,,,', id, didCancel);
                    if (!didCancel) setArticle(data.id);
                }, 1000)
            } else {
                console.log('fetch----,,,', id, didCancel);
                if (!didCancel) setArticle(data.id);
            }
        }

        fetchData();
        return () => {
            didCancel = true;
            console.log('cleanup----,,,', id, didCancel);
        };
    }, [id]);

    return (
        <div>article::::{article}</div>
    )
}

function RaceWrap() {
    const [id, setId] = useState(1);
    return (
        <div>
            <button onClick={() => { setId(id + 1) }}>累加{id}</button>
            <RaceCom id={id} />
        </div>
    )
}

export default RaceWrap;