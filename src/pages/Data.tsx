import { useEffect, useState } from "react";
import { loadMoodsFromStorage } from "../helpers/moods";
import "../styles/data.scss";

const Data: React.FC = () => {
    const [data, setData] = useState<string | null>(null);

    useEffect(() => {
        loadMoodsFromStorage().then((moods) =>
            setData(JSON.stringify(moods, null, "    "))
        );
    }, []);

    if (data === null) return <div className="loading">loading...</div>;
    return (
        <div id="page" className="page data">
            <button
                className="copy"
                onClick={() => navigator.clipboard.writeText(data)}
            >
                copy
            </button>
            <code lang="json">
                <pre>{data}</pre>
            </code>
        </div>
    );
};

export default Data;
