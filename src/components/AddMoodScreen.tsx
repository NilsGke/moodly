import { forwardRef, useImperativeHandle, useState } from "react";
import "../styles/AddMoodScreen.scss";
import { GrFormClose } from "react-icons/gr";
import { addMood, moodType } from "../helpers/moods";
import dayjs from "dayjs";

export type functions = {
    open: () => void;
    close: () => void;
};
type props = {
    refresh: () => void;
};

const AddMoodScreen: React.ForwardRefRenderFunction<functions, props> = (
    { refresh },
    ref
) => {
    const [visible, setVisible] = useState(false);

    const [date, setDate] = useState(dayjs().valueOf());
    const [time, setTime] = useState(dayjs().valueOf());
    const [mood, setMood] = useState<moodType["mood"]>(1);
    const [moodSet, setMoodSet] = useState(false);
    const [text, setText] = useState("");

    useImperativeHandle(ref, () => ({
        open: () => setVisible(true),
        close: () => setVisible(false),
    }));

    const save = async () => {
        await addMood({
            date,
            time,
            mood,
            id: -1,
            text,
        });
        setVisible(false);
        refresh();
    };

    return (
        <div
            id="addMoodScreen"
            className={visible ? "" : "hidden"}
            onClick={(event) => {
                if (event.target === event.currentTarget) setVisible(false);
            }}
        >
            <div id="window">
                <div id="form">
                    <label htmlFor="dateInput" id="dateLabel">
                        {dayjs(date).format("dd DD.MM")}
                    </label>
                    <input
                        type="date"
                        name="dateInput"
                        id="dateInput"
                        onChange={(e) =>
                            setDate(
                                e.target.value != ""
                                    ? dayjs(e.target.value).valueOf()
                                    : date
                            )
                        }
                    />

                    <label htmlFor="timeInput" id="timeLabel">
                        {dayjs(time).format("HH:MM")}
                    </label>
                    <input
                        type="time"
                        name="timeInput"
                        id="timeInput"
                        onChange={(e) => {
                            console.log(
                                e.target.value + " 30.11.2004",
                                dayjs(
                                    e.target.value + "T30.11.2004",
                                    "HH:MMTDD.MM.YYYY"
                                )
                            );
                            setTime(
                                e.target.value != ""
                                    ? dayjs(e.target.value, "HH:MM").valueOf()
                                    : date
                            );
                        }}
                    />

                    <div id="moods">
                        <div id="moodsContainer">
                            {[1, 2, 3, 4, 5].map((a, i) => (
                                <label
                                    htmlFor={"moodInput" + a}
                                    className={
                                        "moodCircle" +
                                        (moodSet && mood == a
                                            ? " selected"
                                            : "")
                                    }
                                >
                                    {a}
                                </label>
                            ))}
                        </div>

                        <div id="moodsInputs">
                            {[1, 2, 3, 4, 5].map((a, i) => (
                                <input
                                    type="radio"
                                    name={"moodInput"}
                                    id={"moodInput" + a}
                                    onChange={(e) => {
                                        setMoodSet(true);
                                        console.log(e.target.id);

                                        setMood(
                                            parseInt(
                                                e.target.id.replace(
                                                    "moodInput",
                                                    ""
                                                )
                                            ) as moodType["mood"]
                                        );
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <textarea
                        name="text"
                        id="textInput"
                        cols={30}
                        rows={10}
                        placeholder={"add some notes..."}
                    ></textarea>

                    <button
                        id="saveButton"
                        onClick={() => save()}
                        disabled={mood == null}
                    >
                        Speichern
                    </button>
                </div>
                <button id="close" onClick={() => setVisible(false)}>
                    <GrFormClose />
                </button>
            </div>
        </div>
    );
};

const decToHex = (num: number): String => num.toString(16).toUpperCase();

export default forwardRef(AddMoodScreen);
