import { useEffect, useState } from "react";

const RaceCom = ({id}: {id: number}) => {
    const [article, setArticle] = useState(null);

    useEffect(() => {
        let didCancel = false;

        async function fetchData() {
            const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
            const article = await res.json();
            if (!didCancel) setArticle(article);
        }

        fetchData();
        return () => {
            didCancel = true;
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
            <button onClick={() => { setId(id + 1) }}>点我+1</button>
            <RaceCom id={id} />
        </div>
    )
}

export default RaceWrap;