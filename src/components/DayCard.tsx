import dayjs from "dayjs";
import { useLayoutEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { SharedElement } from "react-shared-element-transition";
import { transferredState } from "../App";
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
    const { state } = useLocation();

    const ref = useRef<HTMLDivElement | null>(null);

    // scroll to last visited
    useLayoutEffect(() => {
        if (
            (state as transferredState).scrollToDay ===
                dayjs(new Date(day.date)).format("DDMMYYYY") &&
            ref.current
        )
            ref.current.scrollIntoView({ behavior: "auto", block: "center" });
        // disable dependencies because this should only run once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className="cardContainer"
            id={dayjs(new Date(day.date)).format("DDMMYYYY")}
            ref={ref}
        >
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
                            <span
                                className={
                                    "todayLabel" +
                                    (dayjs(day.date).isSame(
                                        dayjs(Date.now()),
                                        "day"
                                    )
                                        ? " active"
                                        : " inactive")
                                }
                            ></span>
                            {dayjs().isSame(dayjs(day.date), "day")
                                ? "Today"
                                : dayjs()
                                      .add(-1, "day")
                                      .isSame(dayjs(day.date), "day")
                                ? "Yesterday"
                                : dayjs(day.date).format("dd DD.MM")}
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
