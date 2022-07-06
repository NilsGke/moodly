import { Storage } from "@capacitor/storage";
import { useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import DayCard, { moodType } from "../components/DayCard";
import "../styles/DayScreen.scss";
import MoodChart from "../components/MoodChart";

const DayScreen = ({ match }: RouteComponentProps<{ date?: string }>) => {
    const { date } = match.params;

    const emptyDaysList: Array<moodType> = [];
    const [moods, setMoods] = useState(emptyDaysList);
    const [currentDay, setCurrentDay] = useState(
        new Date(
            date?.split(".")[1] +
                "." +
                date?.split(".")[0] +
                "." +
                date?.split(".")[2]
        )
    );
    const [refresh, setRefresh] = useState(true);
    const [highlightedHour, setHighlightedHour] = useState<null | number>(null);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (highlightedHour != null) {
            // @ts-ignore
            clearTimeout(timer);
            timer = setTimeout(() => setHighlightedHour(null), 2000);
        }
    }, [highlightedHour]);

    useEffect(() => {
        Storage.get({ key: "moods" })
            .then((newMoods) =>
                JSON.parse(newMoods.value || `[]`)
                    .map((mood: moodType) => ({
                        ...mood,
                        date: new Date(mood.date),
                    }))
                    .filter(
                        (mood: moodType) =>
                            new Date(mood.date).toLocaleDateString() ===
                            new Date(currentDay).toLocaleDateString()
                    )
            )
            .then((moods) => {
                setMoods(moods);
            });
    }, [refresh]);

    return (
        <div id="page" className="dayView">
            <div id="header">
                <h2 id="date">
                    {["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"].at(
                        currentDay.getDay()
                    )}{" "}
                    {currentDay.toLocaleDateString()}
                </h2>
                <div id="detailedDayChart">
                    <MoodChart
                        day={{ moods, date: currentDay }}
                        setHighlightedHour={(hour: number) =>
                            setHighlightedHour(hour)
                        }
                        detailed={true}
                    />
                </div>
            </div>
            <div id="moodsList">
                {moods
                    .filter(
                        (mood) =>
                            new Date(mood.date).toLocaleDateString() ==
                            currentDay.toLocaleDateString()
                    )
                    .map((mood) => (
                        <div
                            key={mood.id}
                            className={
                                "moodEntry " +
                                (highlightedHour ==
                                new Date(mood.time).getHours()
                                    ? "highlighted"
                                    : "")
                            }
                        >
                            <span className="moodNumber">{mood.mood}</span>
                            <span className="moodTime">
                                {new Date(mood.time).toLocaleTimeString()}
                            </span>
                        </div>
                    ))}
            </div>
            <Link to="/">back</Link>
        </div>
    );
};

export default DayScreen;
