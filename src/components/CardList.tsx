import DayCard, { dayType } from "./DayCard";
import "../styles/CardList.scss";
import { moodType } from "../helpers/moods";
import dayjs from "dayjs";
type props = {
    moods: Array<moodType>;
};

const CardList: React.FC<props> = ({ moods }) => {
    const days: Array<dayType> = [];
    moods.forEach((mood) => {
        const foundDay = days.find((day) =>
            dayjs(mood.date).isSame(day.date, "day")
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
