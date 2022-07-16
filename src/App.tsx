import React, { useEffect, useState } from "react";
import {
    BrowserRouter,
    Link,
    Route,
    Switch,
    useLocation,
} from "react-router-dom";
import {
    BottomNavigation,
    BottomNavigationAction,
    CircularProgress,
} from "@mui/material";

import { SharedElementContextProvider } from "react-shared-element-transition";

import { StatusBar } from "@capacitor/status-bar";

import "./styles/App.scss";
import "./styles/devStyles.scss";

// icons
import Timeline from "@mui/icons-material/Timeline";
import BarChartIcon from "@mui/icons-material/BarChart";
// pages
import DayScreen from "./pages/DayScreen";
import DaysList from "./pages/DaysList";
import Statistics from "./pages/Statistics";

// change dayjs to german
import dayjs from "dayjs";
import { loadMoodsFromStorage } from "./helpers/moods";
require("dayjs/locale/de");
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
dayjs.locale("de");

// Display content under transparent status bar (Android only)
StatusBar.setOverlaysWebView({ overlay: true });

const App: React.FC = () => (
    <BrowserRouter>
        <Routes />
    </BrowserRouter>
);

const Routes: React.FC = () => {
    const { pathname } = useLocation();
    const [gotData, setGotData] = useState(false);

    useEffect(() => {
        if (!gotData) loadMoodsFromStorage().then(() => setGotData(true));
    }, [gotData]);

    if (!gotData)
        return (
            <div id="loadingData">
                <CircularProgress />
            </div>
        );

    return (
        <>
            <div
                id="pageContainer"
                className={
                    process.env.NODE_ENV !== "production"
                        ? "devMode"
                        : "production"
                }
            >
                <SharedElementContextProvider pathname={pathname}>
                    <Switch>
                        <Route exact path="/" component={DaysList} />
                        <Route path="/days/:date" component={DayScreen} />
                        <Route path="/days" component={DaysList} />
                        <Route path="/stats" component={Statistics} />
                    </Switch>
                </SharedElementContextProvider>
            </div>
            <BottomNavigation>
                <BottomNavigationAction
                    component={Link}
                    to={pathname === "/stats" ? "/days" : "/"} // change destination to /days when coming from /stats to make the transition possible (with the opacity) (kinda janky solution but works)
                    label="Timeline"
                    value="timeline"
                    icon={<Timeline />}
                    className={pathname === "/" ? "selected" : ""}
                    {...{ ...{ showLabel: pathname === "/" } }}
                />
                <BottomNavigationAction label="" icon={""} />
                <BottomNavigationAction
                    component={Link}
                    to="/stats"
                    label="Stats"
                    icon={<BarChartIcon />}
                    {...{ ...{ showLabel: pathname === "/stats" } }}
                />
            </BottomNavigation>
        </>
    );
};

export default App;
