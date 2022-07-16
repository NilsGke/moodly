import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { SharedElement } from "react-shared-element-transition";
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
            <div className="cardBackgroundContainer">
                <SharedElement
                    id={"background" + dayjs(day.date).format("DD.MM")}
                    pathname="/"
                >
                    <div className="cardBackground"></div>
                </SharedElement>
            </div>
            <Link
                to={"/days/" + dayjs(day.date).format("DD.MM.YYYY")}
                style={{ textDecoration: "none" }}
            >
                <div className="dayCard">
                    <SharedElement
                        id={"title" + dayjs(day.date).format("DD.MM")}
                        pathname="/"
                    >
                        <h2 className="title">
                            {dayjs(day.date).format("dd DD.MM")}
                        </h2>
                    </SharedElement>
                    <div className="chart">
                        <SharedElement
                            id={"chart" + dayjs(day.date).format("DD.MM")}
                            pathname="/"
                        >
                            <MoodChart day={day} />
                        </SharedElement>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default DayCard;
