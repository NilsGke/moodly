import { useEffect, useState } from "react";
import { loadMoodsFromStorage } from "../helpers/moods";

const Data: React.FC = () => {
    const [data, setData] = useState<string | null>(null);

    useEffect(() => {
        loadMoodsFromStorage().then((moods) => setData(JSON.stringify(moods)));
    }, []);

    if (data === null) return <div className="loading">loading...</div>;
    return <div className="data">{data}</div>;
};

export default Data;
