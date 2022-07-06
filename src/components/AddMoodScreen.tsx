import { forwardRef, useImperativeHandle, useState } from "react";
import "../styles/AddMoodScreen.scss";
import { GrFormClose } from "react-icons/gr";
import { moodType } from "./DayCard";

export type functions = {
    open: () => void;
    close: () => void;
};
type props = {
    addMood: (mood: moodType) => Promise<void>;
};

const AddMoodScreen: React.ForwardRefRenderFunction<functions, props> = (
    props,
    ref
) => {
    const [visible, setVisible] = useState(false);

    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [mood, setMood] = useState<moodType["mood"]>(null);
    const [text, setText] = useState("");

    useImperativeHandle(ref, () => ({
        open: () => setVisible(true),
        close: () => setVisible(false),
    }));

    const save = () => {
        props
            .addMood({
                date,
                time,
                mood: mood,
                id: -1,
                text,
            })
            .then(() => setVisible(false));
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
                        {date.toLocaleDateString()}
                    </label>
                    <input
                        type="date"
                        name="dateInput"
                        id="dateInput"
                        onChange={(e) =>
                            setDate(
                                e.target.value != ""
                                    ? new Date(e.target.value)
                                    : date
                            )
                        }
                    />

                    <label htmlFor="timeInput" id="timeLabel">
                        {time.toLocaleTimeString().slice(0, 5)}
                    </label>
                    <input
                        type="time"
                        name="timeInput"
                        id="timeInput"
                        onChange={(e) => {
                            console.log(e.target.value);
                            setTime(
                                e.target.value != ""
                                    ? new Date(
                                          date.toDateString() +
                                              " " +
                                              e.target.value
                                      )
                                    : date
                            );
                        }}
                    />

                    <div id="moods">
                        <div id="moodsContainer">
                            <label
                                htmlFor="moodInput1"
                                className={
                                    "moodCircle" +
                                    (mood == 1 ? " selected" : "")
                                }
                            >
                                1
                            </label>
                            <label
                                htmlFor="moodInput2"
                                className={
                                    "moodCircle" +
                                    (mood == 2 ? " selected" : "")
                                }
                            >
                                2
                            </label>
                            <label
                                htmlFor="moodInput3"
                                className={
                                    "moodCircle" +
                                    (mood == 3 ? " selected" : "")
                                }
                            >
                                3
                            </label>
                            <label
                                htmlFor="moodInput4"
                                className={
                                    "moodCircle" +
                                    (mood == 4 ? " selected" : "")
                                }
                            >
                                4
                            </label>
                            <label
                                htmlFor="moodInput5"
                                className={
                                    "moodCircle" +
                                    (mood == 5 ? " selected" : "")
                                }
                            >
                                5
                            </label>
                        </div>

                        <div id="moodsInputs">
                            <input
                                type="radio"
                                name="moodInput"
                                id="moodInput1"
                                onChange={(e) =>
                                    setMood(
                                        parseInt(
                                            e.target.id.replace("moodInput", "")
                                        ) as moodType["mood"]
                                    )
                                }
                            />
                            <input
                                type="radio"
                                name="moodInput"
                                id="moodInput2"
                                onChange={(e) =>
                                    setMood(
                                        parseInt(
                                            e.target.id.replace("moodInput", "")
                                        ) as moodType["mood"]
                                    )
                                }
                            />
                            <input
                                type="radio"
                                name="moodInput"
                                id="moodInput3"
                                onChange={(e) =>
                                    setMood(
                                        parseInt(
                                            e.target.id.replace("moodInput", "")
                                        ) as moodType["mood"]
                                    )
                                }
                            />
                            <input
                                type="radio"
                                name="moodInput"
                                id="moodInput4"
                                onChange={(e) =>
                                    setMood(
                                        parseInt(
                                            e.target.id.replace("moodInput", "")
                                        ) as moodType["mood"]
                                    )
                                }
                            />
                            <input
                                type="radio"
                                name="moodInput"
                                id="moodInput5"
                                onChange={(e) =>
                                    setMood(
                                        parseInt(
                                            e.target.id.replace("moodInput", "")
                                        ) as moodType["mood"]
                                    )
                                }
                            />
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

const decToHex = (num: Number): String => num.toString(16).toUpperCase();

export default forwardRef(AddMoodScreen);
