import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import "../styles/AddMoodScreen.scss";
import { GrFormClose } from "react-icons/gr";
import { addMood, moodType } from "../helpers/moods";
import dayjs from "dayjs";

export type componentProps = {
    setValues: (mood: moodType) => void;
    save: () => void;
};
type props = {
    open: boolean;
    close: () => void;
    refresh: () => void;
    customSaveFunction?: (mood: moodType) => Promise<void>;
    change?: (mood: moodType) => void;
};

const AddMoodScreen: React.ForwardRefRenderFunction<componentProps, props> = (
    { open, close, refresh, customSaveFunction, change: setChangedMood },
    ref
) => {
    const [date, setDate] = useState(dayjs().valueOf());
    const [time, setTime] = useState(dayjs().valueOf());
    const [mood, setMood] = useState<moodType["mood"]>(1);
    const [moodChosen, setMoodChosen] = useState(false);
    const [fixedId, setFixedId] = useState<moodType["id"] | null>(null); // this is only used if the addscreen is used to edit a mood
    const [text, setText] = useState("");

    useImperativeHandle(ref, () => ({
        setValues: (mood: moodType) => {
            setDate(mood.date);
            setTime(mood.time);
            setMood(mood.mood);
            setMoodChosen(true);
            setText(mood.text);
            setFixedId(mood.id);
        },
        save: () => save(),
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
        // eslint-disable-next-line
    }, [date, time, mood, text]);

    return (
        <div
            id="addMoodScreen"
            className={open ? "" : "hidden"}
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

                    {customSaveFunction ? (
                        <button
                            id="saveButton"
                            onClick={() => save()}
                            disabled={mood == null || !moodChosen}
                        >
                            Speichern
                        </button>
                    ) : (
                        ""
                    )}
                </div>
                <button id="close" onClick={() => close()}>
                    <GrFormClose />
                </button>
            </div>
        </div>
    );
};

export default forwardRef(AddMoodScreen);
