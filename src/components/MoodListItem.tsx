import { moodColors, moodType, removeMood } from "../helpers/moods";
// icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import { useRef } from "react";
type props = {
    mood: moodType;
    activeMood: moodType["id"];
    setActiveMood: (mood: moodType["id"]) => void;
    refresh: () => void;
    editMood: () => void;
};

const closedHeight = "65px";

const MoodListItem: React.FC<props> = ({
    mood,
    activeMood,
    setActiveMood,
    refresh,
    editMood,
}) => {
    const ref = useRef<HTMLDivElement | null>(null);

    return (
        <div
            ref={ref}
            key={mood.id as React.Key}
            className={"moodEntry" + (activeMood === mood.id ? " active" : "")}
            onClick={() => {
                setActiveMood(mood.id === activeMood ? -1 : mood.id);
                if (ref.current === undefined || ref.current === null) return;
                if (mood.id === activeMood)
                    ref.current.animate(
                        [
                            { maxHeight: ref.current.clientHeight + "px" },
                            { maxHeight: closedHeight },
                        ],
                        {
                            duration: 200,
                            iterations: 1,
                            fill: "both",
                            easing: "ease-in-out",
                        }
                    );
                else
                    ref.current.animate(
                        [{ maxHeight: closedHeight }, { maxHeight: "7000px" }],
                        {
                            duration: 2000,
                            iterations: 1,
                            fill: "both",
                            easing: "ease-in-out",
                        }
                    );
            }}
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
