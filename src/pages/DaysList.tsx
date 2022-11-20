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
    const [timerDone, setTimerDone] = useState<boolean>(false);
    const [addMoodScreenOpen, setAddMoodScreenOpen] = useState<boolean>(false);

    useEffect(() => {
        if (refresh) setMoods(getMoods());
        setRefresh(false);
    }, [refresh]);

    // this is a backupTimer to fadein the items if the app is coming back from a day view but there is no more mood in that dayview so it cant do the transition
    useEffect(() => {
        setTimeout(() => {
            setTimerDone(true);
        }, 500);
    }, []);

    type AddMoodScreenProps = React.ElementRef<typeof AddMoodScreen>;
    const addMoodScreenRef = useRef<AddMoodScreenProps>(null);

    const { isTransitioning, activePathname } = useSharedElementContext();
    const opacity =
        timerDone ||
        pathname === "/days" ||
        (!isTransitioning && activePathname === pathname)
            ? 1
            : 0; // only transition if location is not "/days" to make going from /stats to /days possible (kinda janky solution but works)

    return (
        <div id="page" className="daysList">
            <CardList transitionOpacity={opacity} moods={moods} />
            <AddButton
                click={() =>
                    addMoodScreenOpen
                        ? addMoodScreenRef.current?.save()
                        : setAddMoodScreenOpen(true)
                }
                isConfirmButton={addMoodScreenOpen}
            />
            <AddMoodScreen
                open={addMoodScreenOpen}
                ref={addMoodScreenRef}
                refresh={() => setRefresh(true)}
                close={() => setAddMoodScreenOpen(false)}
            />
        </div>
    );
};

export default DaysList;
