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
    const [moodChosen, setMoodChosen] = useState(false);
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
        setMoodChosen(false);
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
                                e.target.value !== ""
                                    ? dayjs(e.target.value).valueOf()
                                    : date
                            )
                        }
                    />

                    <label htmlFor="timeInput" id="timeLabel">
                        {dayjs(time).hour() + ":" + dayjs(time).minute()}
                    </label>
                    <input
                        type="time"
                        name="timeInput"
                        id="timeInput"
                        onChange={(e) =>
                            setTime(
                                e.target.value !== ""
                                    ? dayjs()
                                          .hour(
                                              parseInt(
                                                  e.target.value.split(":")[0]
                                              )
                                          )
                                          .minute(
                                              parseInt(
                                                  e.target.value.split(":")[1]
                                              )
                                          )
                                          .valueOf()
                                    : date
                            )
                        }
                    />

                    <div id="moods">
                        <div id="moodsContainer">
                            {[1, 2, 3, 4, 5].map((a, i) => (
                                <label
                                    key={a}
                                    htmlFor={"moodInput" + a}
                                    className={
                                        "moodCircle" +
                                        (moodChosen && mood === a
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
                                    key={a}
                                    type="radio"
                                    name={"moodInput"}
                                    id={"moodInput" + a}
                                    onChange={(e) => {
                                        setMoodChosen(true);
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
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                    ></textarea>

                    <button
                        id="saveButton"
                        onClick={() => save()}
                        disabled={mood == null || !moodChosen}
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

export default forwardRef(AddMoodScreen);
