import { Storage } from "@capacitor/storage";
import React, { useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import "../styles/DayScreen.scss";
import MoodChart from "../components/MoodChart";
import { getMoods, moodColors, moodType, removeMood } from "../helpers/moods";
import dayjs from "dayjs";
// icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const DayScreen = ({ match }: RouteComponentProps<{ date?: string }>) => {
    const { date: dateFromUrl } = match.params;

    const emptyDaysList: Array<moodType> = [];
    const [moods, setMoods] = useState(emptyDaysList);
    const [currentDay, setCurrentDay] = useState(
        dayjs(dateFromUrl, "DD.MM.YYYY")
    );

    const [refresh, setRefresh] = useState(false);
    const [highlightedHour, setHighlightedHour] = useState<null | number>(null);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (highlightedHour != null)
            timer = setTimeout(() => setHighlightedHour(null), 50);
    }, [highlightedHour]);

    useEffect(() => {
        console.log("refresh");

        getMoods()
            .then((newMoods) =>
                newMoods.filter((mood: moodType) =>
                    dayjs(mood.date).isSame(currentDay, "day")
                )
            )
            .then((moods: Array<moodType>) =>
                moods.sort(
                    (a, b) =>
                        dayjs(a.time)
                            .set("date", 30)
                            .set("month", 11)
                            .set("year", 2004)
                            .valueOf() -
                        dayjs(b.time)
                            .set("date", 30)
                            .set("month", 11)
                            .set("year", 2004)
                            .valueOf()
                )
            )
            .then((moods) => {
                setMoods(moods);
                setRefresh(false);
            });
    }, [refresh]);

    return (
        <div id="page" className="dayView">
            <div id="header">
                <h2 id="date">
                    {currentDay.format("dd")} {currentDay.format("DD.MM")}
                </h2>
                <div id="detailedDayChart">
                    <MoodChart
                        day={{ moods, date: currentDay.valueOf() }}
                        setHighlightedHour={(hour: number) =>
                            setHighlightedHour(hour)
                        }
                        detailed={true}
                    />
                </div>
            </div>
            <div id="moodsList">
                {moods
                    .filter((mood) =>
                        dayjs(mood.date).isSame(currentDay, "day")
                    )
                    .map((mood) => (
                        <div
                            key={mood.id as React.Key}
                            className={
                                "moodEntry " +
                                (highlightedHour == dayjs(mood.time).hour()
                                    ? "highlighted"
                                    : "")
                            }
                        >
                            <span
                                className="moodNumber"
                                style={{
                                    color: moodColors[mood.mood - 1],
                                }}
                            >
                                {mood.mood}
                            </span>
                            <span className="moodTime">
                                {dayjs(mood.time).format("HH:MM")}
                            </span>
                            <div className="edit">
                                <button
                                    className="edit"
                                    onClick={() => {
                                        // TODO: edit menu
                                        // might use AddMoodScreen
                                    }}
                                >
                                    <EditIcon />
                                </button>
                                <button
                                    className="delete"
                                    onClick={() =>
                                        removeMood(mood).then(() => {
                                            console.log("asdf");
                                            setRefresh(true);
                                        })
                                    }
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
            <Link to="/">back</Link>
        </div>
    );
};

export default DayScreen;
