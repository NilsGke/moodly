import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/DayCard.scss";
import MoodChart from "./MoodChart";

export type dayType = {
    moods: Array<moodType>;
    date: Date;
};

export type moodType = {
    id: React.Key;
    date: Date;
    time: Date;
    mood: 5 | 4 | 3 | 2 | 1 | null;
    text: String;
};

type props = {
    day: dayType;
};

const DayCard: React.FC<props> = ({ day }) => {
    const date = new Date(day.date);

    return (
        <div className="cardContainer">
            <Link
                to={"/days/" + date.toLocaleDateString()}
                style={{ textDecoration: "none" }}
            >
                <div className="dayCard">
                    <h2 className="title">
                        {["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"].at(
                            date.getDay()
                        )}{" "}
                        {date.toLocaleDateString()}
                    </h2>
                    <div className="chart">
                        <MoodChart day={day} />
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default DayCard;
