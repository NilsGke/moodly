import DayCard, { dayType } from "./DayCard";
import "../styles/CardList.scss";
import { moodType } from "../helpers/moods";
import dayjs from "dayjs";

type props = {
    moods: Array<moodType>;
    transitionOpacity: number;
};

const CardList: React.FC<props> = ({ moods, transitionOpacity }) => {
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

    const sortedDays = days.sort((a, b) => b.date - a.date);
    const elements: JSX.Element[] = [];

    sortedDays.forEach((day, i) => {
        if (i !== 0) {
            // if the *years* arent the same then we add a divider tag thingy
            if (
                dayjs(sortedDays[i - 1].date).format("YY") !=
                dayjs(sortedDays[i].date).format("YY")
            )
                elements.push(
                    <div className="divider">
                        <span>
                            {dayjs(sortedDays[i - 1].date).format("YYYY")}
                        </span>
                    </div>
                );

            // if the *months* arent the same then we add a divider tag thingy
            if (
                dayjs(sortedDays[i - 1].date).format("MM") !=
                dayjs(sortedDays[i].date).format("MM")
            )
                elements.push(
                    <div className="divider">
                        <span>
                            {dayjs(sortedDays[i - 1].date).format("MMMM")}
                        </span>
                    </div>
                );

            // if the *weeks* arent the same then we add a divider tag thingy
            if (
                !dayjs(sortedDays[i - 1].date).isSame(
                    dayjs(sortedDays[i].date),
                    "week"
                )
            )
                elements.push(<div className="divider"></div>);
        }

        elements.push(<DayCard key={day.date} day={day} />);
    });

    return (
        <div id="cardContainer">
            <div id="cardList" style={{ opacity: transitionOpacity }}>
                {/* {days.map((day, i) => (
                    <DayCard key={day.date} day={day} />
                ))} */}
                {elements}
            </div>
        </div>
    );
};

export default CardList;
