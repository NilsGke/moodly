import { forwardRef, useImperativeHandle, useState } from "react";
import "../styles/AddMoodScreen.scss";

export type functions = {
    open: () => void;
    close: () => void;
};
type props = {};

const AddMoodScreen: React.ForwardRefRenderFunction<functions, props> = (
    props,
    ref
) => {
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
        open: () => setVisible(true),
        close: () => setVisible(false),
    }));

    return (
        <div
            id="addMoodScreen"
            className={visible ? "" : "hidden"}
            onClick={(event) => {
                event.preventDefault();
                if (event.target === event.currentTarget) setVisible(false);
            }}
        >
            <div id="window">
                <div id="form">
                    <input type="date" name="dateInput" id="newDateInput" />
                    <button onClick={() => alert("hi")}>asdf</button>
                </div>
            </div>
        </div>
    );
};

export default forwardRef(AddMoodScreen);
