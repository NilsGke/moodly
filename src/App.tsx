import { Storage } from "@capacitor/storage";
import CardList from "./components/CardList";
import { useEffect, useRef, useState } from "react";
import { day } from "./components/DayCard";
import { AddButton } from "./components/AddButton";
import AddMoodScreen from "./components/AddMoodScreen";
import "./styles/App.scss";

const App: React.FC = () => {
    const emptyDaysList: Array<day> = [];
    const [moods, setMoods] = useState(emptyDaysList);
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        Storage.get({ key: "moods" }).then((newMoods) =>
            setMoods(
                JSON.parse(
                    newMoods.value ||
                        '[{"id":"tsest","date":1656511298887,"mood":4,"text":"hello dies ist der Text"},{"id":"dtest","date":1656511298887,"mood":4,"text":"hello dies ist der Text"}, {"id":"ftest","date":1656511298887,"mood":4,"text":"hello dies ist der Text"},{"id":"gest","date":1656511298887,"mood":4,"text":"hello dies ist der Text"},{"id":"tehst","date":1656511298887,"mood":4,"text":"hello dies ist der Text"}, {"id":"tjest","date":1656511298887,"mood":4,"text":"hello dies ist der Text"}]'
                )
            )
        );
    }, [refresh]);

    useEffect(() => {
        Storage.set({ key: "moods", value: JSON.stringify(moods) });
    }, [moods]);

    type AddMoodScreenFunctions = React.ElementRef<typeof AddMoodScreen>;
    const addMoodScreenRef = useRef<AddMoodScreenFunctions>(null);

    return (
        <div id="page">
            <button
                onClick={() =>
                    Storage.clear().then(async () =>
                        console.log(await Storage.get({ key: "moods" }))
                    )
                }
            >
                clear
            </button>
            <CardList days={moods} />
            <AddButton addMoodScreenRef={addMoodScreenRef} />
            <AddMoodScreen ref={addMoodScreenRef} />
        </div>
    );
};

export default App;
