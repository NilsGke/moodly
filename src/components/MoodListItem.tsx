import { moodColors, moodType, removeMood } from "../helpers/moods";
// icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
type props = {
    mood: moodType;
    activeMood: moodType["id"];
    setActiveMood: (mood: moodType["id"]) => void;
    refresh: () => void;
    editMood: () => void;
};

const MoodListItem: React.FC<props> = ({
    mood,
    activeMood,
    setActiveMood,
    refresh,
    editMood,
}) => {
    return (
        <div
            key={mood.id as React.Key}
            className={"moodEntry" + (activeMood === mood.id ? " active" : "")}
            onClick={() => setActiveMood(mood.id === activeMood ? -1 : mood.id)}
        >
            <span
                className="moodNumber"
                style={{
                    color: moodColors[mood.mood - 1],
                }}
            >
                {mood.mood}
            </span>
            <span className="moodTime">{dayjs(mood.time).format("HH:mm")}</span>
            <span className="text">{mood.text}</span>
            <div className="edit">
                <button className="edit" onClick={() => editMood()}>
                    <EditIcon />
                </button>
                <button
                    className="delete"
                    onClick={() => removeMood(mood).then(() => refresh())}
                >
                    <DeleteIcon />
                </button>
            </div>
        </div>
    );
};

export default MoodListItem;
