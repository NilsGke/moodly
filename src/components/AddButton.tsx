import { IoIosAdd } from "react-icons/io";
import "../styles/AddButton.scss";
import { functions } from "./AddMoodScreen";

type props = {
    addMoodScreenRef: React.RefObject<functions>;
};

export const AddButton: React.FC<props> = ({ addMoodScreenRef }) => {
    return (
        <button id="addButton" onClick={() => addMoodScreenRef.current?.open()}>
            <IoIosAdd />
        </button>
    );
};
