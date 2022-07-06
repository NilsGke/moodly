import React, { useState } from "react";
import {
    BrowserRouter,
    Link,
    Route,
    Switch,
    useLocation,
} from "react-router-dom";
import DayScreen from "./pages/DayScreen";
import DaysList from "./pages/DaysList";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";

// icons
import Timeline from "@mui/icons-material/Timeline";
import BarChartIcon from "@mui/icons-material/BarChart";

import "./styles/App.scss";
import Statistics from "./pages/Statistics";

const App: React.FC = () => (
    <BrowserRouter>
        <Routes />
    </BrowserRouter>
);
const Routes: React.FC = () => {
    const [value, setValue] = useState(0);
    const location = useLocation();

    return (
        <>
            <Switch>
                <Route exact path="/" component={DaysList} />
                <Route path="/days/:date" component={DayScreen} />
                <Route path="/days" component={DaysList} />
                <Route path="/stats" component={Statistics} />
            </Switch>
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    // setValue(newValue);
                }}
            >
                <BottomNavigationAction
                    component={Link}
                    to="/"
                    label="Timeline"
                    value="timeline"
                    icon={<Timeline />}
                    className={location.pathname == "/" ? "selected" : ""}
                    {...{ ...{ showLabel: location.pathname == "/" } }}
                />
                <BottomNavigationAction label="" icon={""} />
                <BottomNavigationAction
                    component={Link}
                    to="/stats"
                    label="Stats"
                    icon={<BarChartIcon />}
                    {...{ ...{ showLabel: location.pathname == "/stats" } }}
                />
            </BottomNavigation>
        </>
    );
};

export default App;
