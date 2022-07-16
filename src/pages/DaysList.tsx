import CardList from "../components/CardList";
import { useEffect, useRef, useState } from "react";
import { AddButton } from "../components/AddButton";
import AddMoodScreen from "../components/AddMoodScreen";
import { getMoods } from "../helpers/moods";
import { RouteComponentProps } from "react-router";
import { useSharedElementContext } from "react-shared-element-transition";

const DaysList = ({
    match,
    location: { pathname },
}: RouteComponentProps<{ date?: string }>) => {
    const [moods, setMoods] = useState(getMoods());
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        if (refresh) setMoods(getMoods());
        setRefresh(false);
    }, [refresh]);

    type AddMoodScreenFunctions = React.ElementRef<typeof AddMoodScreen>;
    const addMoodScreenRef = useRef<AddMoodScreenFunctions>(null);

    const { isTransitioning, activePathname } = useSharedElementContext();
    const opacity =
        pathname === "/days" ||
        (!isTransitioning && activePathname === pathname)
            ? 1
            : 0; // only transition if location is not "/days" to make going from /stats to /days possible (kinda janky solution but works)

    return (
        <div id="page" className="daysList">
            <CardList transitionOpacity={opacity} moods={moods} />
            <AddButton addMoodScreenRef={addMoodScreenRef} />
            <AddMoodScreen
                ref={addMoodScreenRef}
                refresh={() => setRefresh(true)}
            />
        </div>
    );
};

export default DaysList;
