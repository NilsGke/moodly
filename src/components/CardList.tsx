import { useState } from "react";
import DayCard, { dayType, moodType } from "./DayCard";
import "../styles/CardList.scss";
type props = {
    moods: Array<moodType>;
};

const CardList: React.FC<props> = ({ moods }) => {
    const days: Array<dayType> = [];
    moods.forEach((mood) => {
        const foundDay = days.find(
            (day) =>
                new Date(day.date).toDateString() ===
                new Date(mood.date).toDateString()
        );

        if (foundDay !== undefined) {
            foundDay.moods.push(mood);
        } else {
            days.push({
                date: mood.date,
                moods: [mood],
            });
        }
    });

    return (
        <div id="cardContainer">
            <div id="cardList">
                {days.map((day, i) => (
                    <DayCard key={i} day={day} />
                ))}
            </div>
        </div>
    );
};

export default CardList;
