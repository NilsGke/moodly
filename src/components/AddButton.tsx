import { IoIosAdd } from "react-icons/io";
import CheckIcon from "@mui/icons-material/Check";
import "../styles/AddButton.scss";

type props = {
    isConfirmButton: boolean;
    click: () => void;
};

export const AddButton: React.FC<props> = ({ isConfirmButton, click }) => {
    console.log("rerender addbutton", {
        isOpen: isConfirmButton,
    });

    return (
        <button
            id="addButton"
            className={isConfirmButton ? "confirm" : "open"}
            onClick={click}
        >
            {isConfirmButton ? <CheckIcon /> : <IoIosAdd />}
        </button>
    );
};
