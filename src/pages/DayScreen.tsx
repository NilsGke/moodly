import { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import "../styles/DayScreen.scss";
import MoodChart from "../components/MoodChart";
import { addMood, getMoods, modifyMood, moodType } from "../helpers/moods";
import dayjs from "dayjs";
import MoodListItem from "../components/MoodListItem";
import {
    goBackInTime,
    backToTheFuture,
    clearTimeline,
    getFutureLength,
    getHistoryLength,
    timeLine,
    addNewState,
} from "../helpers/history";
import DailyPieChart from "../components/DailyPieChart";
// icons
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import RedoRoundedIcon from "@mui/icons-material/RedoRounded";
import AddMoodScreen from "../components/AddMoodScreen";

const DayScreen = ({ match }: RouteComponentProps<{ date?: string }>) => {
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
    }, [modifiedMood]);

    type AddMoodScreenFunctions = React.ElementRef<typeof AddMoodScreen>;
    const addMoodScreenRef = useRef<AddMoodScreenFunctions>(null);

    const editMood = () => {
        if (modifiedMood !== null) {
            const moodToModify = moods.find((m) => m.id === activeMood);
            if (moodToModify != null) {
                addMoodScreenRef.current?.setValues(moodToModify);
                addMoodScreenRef.current?.open();
            }
        }
    };

    const saveEditedMood = (mood: moodType) => modifyMood(mood);

    return (
        <>
            <div id="page" className="dayView">
                <div id="header">
                    <h2 id="date">
                        {currentDay.format("dd")} {currentDay.format("DD.MM")}
                    </h2>
                    <div id="detailedDayChart">
                        <MoodChart
                            day={{ moods, date: currentDay.valueOf() }}
                            setHighlightedHour={(hour: number) => {
                                setActiveMood(
                                    moods.find(
                                        (mood: moodType) =>
                                            dayjs(mood.time).hour() === hour
                                    )?.id || -1
                                );
                            }}
                            detailed={true}
                            activeMood={activeMood}
                        />
                    </div>
                </div>
                <div id="moodsList">
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
                </div>
                <div id="bottomChart">
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
                ref={addMoodScreenRef}
                refresh={() => setRefresh(true)}
                customSaveFunction={(mood: moodType) => saveEditedMood(mood)}
                change={(mood: moodType) => setModifiedMood(mood)}
                closeHandler={() => {
                    setActiveMood(-1);
                    setRefresh(true);
                }}
            />
        </>
    );
};

export default DayScreen;
