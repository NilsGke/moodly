import { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { createTheme, ThemeProvider } from "@mui/material";
import "../styles/periodToggle.scss";

type props = {
    change: (newPeriod: period) => void;
};

export type period = "week" | "month" | "all";

const PeriodToggleButtons: React.FC<props> = ({ change }) => {
    const [period, setPeriod] = useState<period>("week");

    const handleAlignment = (
        event: React.MouseEvent<HTMLElement>,
        newPeriod: period
    ) => {
        if (newPeriod !== null) {
            setPeriod(newPeriod);
            change(newPeriod);
        }
    };

    return (
        <div id="periodToggle">
            <ThemeProvider theme={createTheme({ palette: { mode: "dark" } })}>
                <ToggleButtonGroup
                    value={period}
                    exclusive
                    onChange={handleAlignment}
                    aria-label="text alignment"
                >
                    <ToggleButton value="week" aria-label="week">
                        Woche
                    </ToggleButton>
                    <ToggleButton value="month" aria-label="month">
                        Monat
                    </ToggleButton>
                    <ToggleButton value="all" aria-label="all">
                        Alle
                    </ToggleButton>
                </ToggleButtonGroup>
            </ThemeProvider>
        </div>
    );
};

export default PeriodToggleButtons;
