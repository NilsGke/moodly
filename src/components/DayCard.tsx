import "../styles/DayCard.scss";

export type day = {
    id: React.Key;
    date: Date;
    mood: 5 | 4 | 3 | 2 | 1;
    text: String;
};

type props = {
    day: day;
};

const DayCard: React.FC<props> = ({ day }) => {
    const date = new Date(day.date);
    return (
        <div className="dayCard">
            <h2 className="title">{date.toLocaleDateString()}</h2>
        </div>
    );
};

export default DayCard;
