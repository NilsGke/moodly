import { useCallback, useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import "../styles/DayScreen.scss";
import MoodChart from "../components/MoodChart";
import {
    addMood,
    getMoods,
    modifyMood,
    moodType,
    saveMoodsToStorage,
} from "../helpers/moods";
import dayjs from "dayjs";
import MoodListItem from "../components/MoodListItem";
import {
    goBackInTime,
    backToTheFuture,
    clearTimeline,
    getFutureLength,
    getHistoryLength,
    addNewState,
} from "../helpers/history";
import DailyPieChart from "../components/DailyPieChart";
// icons
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import RedoRoundedIcon from "@mui/icons-material/RedoRounded";
import AddMoodScreen from "../components/AddMoodScreen";
import {
    SharedElement,
    useSharedElementContext,
} from "react-shared-element-transition";

const DayScreen = ({
    match,
    location: { pathname },
}: RouteComponentProps<{ date?: string }>) => {
    // eslint-disable-next-line
    const [currentDay, setCurrentDay] = useState(
        dayjs(match.params.date, "DD.MM.YYYY")
    );

    const initialMoods = getMoods()
        .filter((mood: moodType) => dayjs(mood.date).isSame(currentDay, "day"))
        .sort(
            (a, b) =>
                dayjs(a.time).hour() * 60 +
                dayjs(a.time).minute() -
                (dayjs(b.time).hour() * 60 + dayjs(b.time).minute())
        );

    const [moods, setMoods] = useState<Array<moodType>>(initialMoods);
    const [refresh, setRefresh] = useState(false);
    const [activeMood, setActiveMood] = useState<moodType["id"]>(-1);
    const [modifiedMood, setModifiedMood] = useState<moodType | null>(null);
    const [editMoodOnNextRender, setEditMoodOnNextRender] = useState<
        number | null
    >(null);

    const [addMoodScreenOpen, setAddMoodScreenOpen] = useState<boolean>(false);

    useEffect(() => {
        let newMoods = getMoods()
            .filter((mood: moodType) =>
                dayjs(mood.date).isSame(currentDay, "day")
            )
            .sort(
                (a, b) =>
                    dayjs(a.time).hour() * 60 +
                    dayjs(a.time).minute() -
                    (dayjs(b.time).hour() * 60 + dayjs(b.time).minute())
            );
        setMoods(newMoods);
        setRefresh(false);
    }, [refresh, currentDay]);

    // clear history on first render
    useEffect(clearTimeline, []);

    // add current state to timeLine (on first render)
    useEffect(() => {
        addNewState(getMoods());
    }, []);

    useEffect(() => {
        if (modifiedMood !== null) {
            const newMoods = moods.slice().map((m) => {
                if (m.id !== modifiedMood.id) return m;
                else {
                    return modifiedMood;
                }
            });
            setMoods(newMoods);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modifiedMood]);

    type AddMoodScreenFunctions = React.ElementRef<typeof AddMoodScreen>;
    const addMoodScreenRef = useRef<AddMoodScreenFunctions>(null);

    const editMood = useCallback(() => {
        if (modifiedMood !== null) {
            const moodToModify = moods.find((m) => m.id === activeMood);
            if (moodToModify != null) {
                addMoodScreenRef.current?.setValues(moodToModify);
                setAddMoodScreenOpen(true);
            }
        }
    }, [activeMood, modifiedMood, moods]);

    useEffect(() => {
        if (editMoodOnNextRender === null) return;
        setEditMoodOnNextRender(null);
        editMood();
    }, [editMoodOnNextRender, editMood]);

    const { isTransitioning, activePathname } = useSharedElementContext();
    const opacity = isTransitioning || activePathname !== pathname ? 0 : 1;

    const saveEditedMood = (mood: moodType) => modifyMood(mood);

    return (
        <>
            <div id="page" className="dayView">
                <div id="headerContainer">
                    <div
                        className="cardBackgroundContainer"
                        style={{ opacity }}
                    >
                        <SharedElement
                            id={
                                "background" + dayjs(currentDay).format("DD.MM")
                            }
                            pathname={pathname}
                        >
                            <div className="cardBackground"></div>
                        </SharedElement>
                    </div>
                    <div id="header" style={{ opacity }}>
                        <SharedElement
                            id={"title" + dayjs(currentDay).format("DD.MM")}
                            pathname={pathname}
                        >
                            <h2 id="date">
                                {currentDay.format("dd")}{" "}
                                {currentDay.format("DD.MM")}
                            </h2>
                        </SharedElement>
                        <div id="detailedDayChart" style={{ opacity }}>
                            <SharedElement
                                id={"chart" + dayjs(currentDay).format("DD.MM")}
                                pathname={pathname}
                            >
                                <MoodChart
                                    day={{ moods, date: currentDay.valueOf() }}
                                    setHighlightedHour={(hour: number) => {
                                        setActiveMood(
                                            moods.find(
                                                (mood: moodType) =>
                                                    dayjs(mood.time).hour() ===
                                                    hour
                                            )?.id || -1
                                        );
                                    }}
                                    detailed={true}
                                    activeMood={activeMood}
                                />
                            </SharedElement>
                        </div>
                    </div>
                </div>
                <div id="moodsList" style={{ opacity }}>
                    {moods
                        .filter((mood) =>
                            dayjs(mood.date).isSame(currentDay, "day")
                        )
                        .map((mood) => (
                            <MoodListItem
                                key={mood.id}
                                activeMood={activeMood}
                                mood={mood}
                                setActiveMood={(id: moodType["id"]) =>
                                    setActiveMood(id)
                                }
                                refresh={() => setRefresh(true)}
                                editMood={() => {
                                    editMood();
                                }}
                            />
                        ))}
                    <button
                        className="moodEntry addMood"
                        onClick={async () => {
                            const newMoods = moods.slice();
                            let id = 0;
                            const ids = getMoods().map((m) => m.id);
                            while (ids.includes(id)) id++;
                            const newMood = {
                                date: currentDay.valueOf(),
                                id,
                                mood: 4,
                                text: "",
                                time: Date.now(),
                            } as moodType;
                            newMoods.push(newMood);
                            addMood(newMood);
                            await saveMoodsToStorage();
                            setMoods(newMoods);
                            setActiveMood(id);
                            setEditMoodOnNextRender(id);
                        }}
                    >
                        +
                    </button>
                </div>
                <div id="bottomChart" style={{ opacity }}>
                    {moods.length !== 0 ? (
                        <DailyPieChart moods={moods} />
                    ) : null}
                </div>
            </div>
            <div id="undoButtons">
                <button
                    id="undo"
                    className={getHistoryLength() < 0 ? "hidden" : ""}
                    onClick={async () => {
                        await goBackInTime();
                        setRefresh(true);
                    }}
                >
                    <UndoRoundedIcon />
                </button>
                <button
                    id="redo"
                    className={getFutureLength() === 0 ? "hidden" : ""}
                    onClick={async () => {
                        await backToTheFuture();
                        setRefresh(true);
                    }}
                >
                    <RedoRoundedIcon />
                </button>
            </div>
            <AddMoodScreen
                open={addMoodScreenOpen}
                close={() => {
                    setAddMoodScreenOpen(false);
                    setActiveMood(-1);
                    setRefresh(true);
                }}
                ref={addMoodScreenRef}
                refresh={() => setRefresh(true)}
                customSaveFunction={(mood: moodType) => saveEditedMood(mood)}
                change={(mood: moodType) => setModifiedMood(mood)}
            />
        </>
    );
};

export default DayScreen;
