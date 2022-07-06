import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { moodType } from "../helpers/moods";
import "../styles/DayCard.scss";
import MoodChart from "./MoodChart";

export type dayType = {
    moods: Array<moodType>;
    date: number;
};

type props = {
    day: dayType;
};

const DayCard: React.FC<props> = ({ day }) => {
    return (
        <div className="cardContainer">
            <Link
                to={"/days/" + dayjs(day.date).format("DD.MM.YYYY")}
                style={{ textDecoration: "none" }}
            >
                <div className="dayCard">
                    <h2 className="title">
                        {dayjs(day.date).format("dd DD.MM")}
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
