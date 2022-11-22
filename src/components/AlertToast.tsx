import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";

const AlertMassage: React.FC<{ message: string }> = ({ message }) => {
    const [open, setOpen] = useState(true);
    function handleClose() {
        setOpen(false);
    }

    return (
        <div>
            <ThemeProvider theme={createTheme({ palette: { mode: "dark" } })}>
                <Snackbar
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    open={open}
                    autoHideDuration={2000}
                    onClose={handleClose}
                    ContentProps={{
                        "aria-describedby": "message-id",
                    }}
                    action={[
                        <IconButton key="close" onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>,
                    ]}
                >
                    <Alert
                        onClose={handleClose}
                        severity={
                            message.startsWith("Error") ? "error" : "success"
                        }
                        sx={{ width: "100%" }}
                    >
                        {message}
                    </Alert>
                </Snackbar>
            </ThemeProvider>
        </div>
    );
};

export default AlertMassage;
