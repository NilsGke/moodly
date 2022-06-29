import DayCard, { day } from "./DayCard";

type props = {
    days: Array<day>;
};

const CardList: React.FC<props> = ({ days }) => {
    return (
        <div id="cardContainer">
            <div id="cardList">
                {days.map((mood) => (
                    <DayCard key={mood.id} day={mood} />
                ))}
            </div>
        </div>
    );
};

export default CardList;
