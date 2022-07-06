import { Storage } from "@capacitor/storage";
import CardList from "../components/CardList";
import { useEffect, useRef, useState } from "react";
import { AddButton } from "../components/AddButton";
import AddMoodScreen from "../components/AddMoodScreen";
import { getMoods, moodType } from "../helpers/moods";

const DaysList: React.FC = () => {
    const emptyDaysList: Array<moodType> = [];
    const [moods, setMoods] = useState(emptyDaysList);
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        if (refresh)
            getMoods()
                .then((moods) => setMoods(moods))
                .then(() => setRefresh(false));
    }, [refresh]);

    useEffect(() => {
        Storage.set({ key: "moods", value: JSON.stringify(moods) });
    }, [moods]);

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
            <button
                onClick={() =>
                    Storage.clear().then(async () =>
                        console.log(await Storage.get({ key: "moods" }))
                    )
                }
            >
                clear
            </button>
        </div>
    );
};

export default DaysList;
