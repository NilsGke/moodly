import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import "../styles/AddMoodScreen.scss";
import { GrFormClose } from "react-icons/gr";
import { addMood, moodType } from "../helpers/moods";
import dayjs from "dayjs";

export type functions = {
    open: () => void;
    close: () => void;
    setValues: (mood: moodType) => void;
};
type props = {
    refresh: () => void;
    customSaveFunction?: (mood: moodType) => Promise<void>;
    change?: (mood: moodType) => void;
    closeHandler?: () => void;
};

const AddMoodScreen: React.ForwardRefRenderFunction<functions, props> = (
    { refresh, customSaveFunction, change: setChangedMood, closeHandler },
    ref
) => {
    const [visible, setVisible] = useState(false);

    const [date, setDate] = useState(dayjs().valueOf());
    const [time, setTime] = useState(dayjs().valueOf());
    const [mood, setMood] = useState<moodType["mood"]>(1);
    const [moodChosen, setMoodChosen] = useState(false);
    const [fixedId, setFixedId] = useState<moodType["id"] | null>(null); // this is only used if the addscreen is used to edit a mood
    const [text, setText] = useState("");

    useImperativeHandle(ref, () => ({
        open: () => setVisible(true),
        close: () => close(),
        setValues: (mood: moodType) => {
            setDate(mood.date);
            setTime(mood.time);
            setMood(mood.mood);
            setMoodChosen(true);
            setText(mood.text);
            setFixedId(mood.id);
        },
    }));

    const save = async () => {
        if (customSaveFunction)
            await customSaveFunction({
                date,
                time,
                mood,
                id: fixedId || -1,
                text,
            });
        else
            await addMood({
                date,
                time,
                mood,
                id: -1,
                text,
            });
        close();
        refresh();
        setMoodChosen(false);
    };

    useEffect(() => {
        if (setChangedMood)
            setChangedMood({
                date,
                time,
                mood,
                id: fixedId || -1,
                text,
            });
    }, [date, time, mood, text]);

    const close = () => {
        setVisible(false);
        if (closeHandler) closeHandler();
    };

    return (
        <div
            id="addMoodScreen"
            className={visible ? "" : "hidden"}
            onClick={(event) => {
                if (event.target === event.currentTarget) close();
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
                <button id="close" onClick={() => close()}>
                    <GrFormClose />
                </button>
            </div>
        </div>
    );
};

export default forwardRef(AddMoodScreen);
