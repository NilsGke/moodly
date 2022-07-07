import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import "../styles/DayScreen.scss";
import MoodChart from "../components/MoodChart";
import { getMoods, moodType } from "../helpers/moods";
import dayjs from "dayjs";
import MoodListItem from "../components/MoodListItem";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import { history, clearHistory, goBackInTime } from "../helpers/history";

const DayScreen = ({ match }: RouteComponentProps<{ date?: string }>) => {
    const currentDay = dayjs(match.params.date, "DD.MM.YYYY");

    const [moods, setMoods] = useState<Array<moodType>>([]);
    const [refresh, setRefresh] = useState(false);
    const [activeMood, setActiveMood] = useState<moodType["id"]>(-1);

    useEffect(() => {
        (async () => {
            let newMoods = (await getMoods())
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
        })();
    }, [refresh]);

    // clear history on first render
    useEffect(clearHistory, []);

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
                                            dayjs(mood.time).hour() == hour
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
                                activeMood={activeMood}
                                mood={mood}
                                setActiveMood={(id: moodType["id"]) =>
                                    setActiveMood(id)
                                }
                                refresh={() => setRefresh(true)}
                            />
                        ))}
                </div>
            </div>
            <button
                id="undo"
                className={history.length == 0 ? "hidden" : ""}
                onClick={() => goBackInTime().then(() => setRefresh(true))}
            >
                <UndoRoundedIcon />
            </button>
        </>
    );
};

export default DayScreen;
