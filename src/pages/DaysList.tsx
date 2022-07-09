import CardList from "../components/CardList";
import { useEffect, useRef, useState } from "react";
import { AddButton } from "../components/AddButton";
import AddMoodScreen from "../components/AddMoodScreen";
import { getMoods } from "../helpers/moods";

const DaysList: React.FC = () => {
    const [moods, setMoods] = useState(getMoods());
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        if (refresh) setMoods(getMoods());
        setRefresh(false);
    }, [refresh]);

    type AddMoodScreenFunctions = React.ElementRef<typeof AddMoodScreen>;
    const addMoodScreenRef = useRef<AddMoodScreenFunctions>(null);

    return (
        <div id="page">
            <CardList moods={moods} />
            <AddButton addMoodScreenRef={addMoodScreenRef} />
            <AddMoodScreen
                ref={addMoodScreenRef}
                refresh={() => setRefresh(true)}
            />
        </div>
    );
};

export default DaysList;
