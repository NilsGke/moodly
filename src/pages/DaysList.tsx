import { Storage } from "@capacitor/storage";
import CardList from "../components/CardList";
import { useEffect, useRef, useState } from "react";
import { moodType } from "../components/DayCard";
import { AddButton } from "../components/AddButton";
import AddMoodScreen from "../components/AddMoodScreen";

const DaysList: React.FC = () => {
    const emptyDaysList: Array<moodType> = [];
    const [moods, setMoods] = useState(emptyDaysList);
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        if (refresh)
            Storage.get({ key: "moods" })
                .then((newMoods) =>
                    setMoods(
                        JSON.parse(newMoods.value || `[]`).map(
                            (mood: moodType) => ({
                                ...mood,
                                date: new Date(mood.date),
                            })
                        )
                    )
                )
                .then(() => setRefresh(false));
    }, [refresh]);

    useEffect(() => {
        Storage.set({ key: "moods", value: JSON.stringify(moods) });
    }, [moods]);

    const addMood = (mood: moodType): Promise<void> => {
        return new Promise((res) => {
            let newId = 0;
            while (moods.map((m) => m.id).includes(newId)) newId++;
            mood.id = newId;
            const newMoods = [...moods, mood];
            Storage.set({ key: "moods", value: JSON.stringify(newMoods) })
                .then(() => setRefresh(true))
                .then(res);
        });
    };

    type AddMoodScreenFunctions = React.ElementRef<typeof AddMoodScreen>;
    const addMoodScreenRef = useRef<AddMoodScreenFunctions>(null);

    return (
        <div id="page">
            <CardList moods={moods} />
            <AddButton addMoodScreenRef={addMoodScreenRef} />
            <AddMoodScreen
                ref={addMoodScreenRef}
                addMood={(mood: moodType) => addMood(mood)}
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
