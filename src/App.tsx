import React, { useEffect, useState } from "react";
import {
    BrowserRouter,
    Link,
    Route,
    Switch,
    useLocation,
} from "react-router-dom";
import { CircularProgress } from "@mui/material";

import { SharedElementContextProvider } from "react-shared-element-transition";

import { StatusBar } from "@capacitor/status-bar";

import "./styles/App.scss";
import "./styles/devStyles.scss";
import "./styles/topBar.scss";

// icons
import BarChartIcon from "@mui/icons-material/BarChart";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

// pages
import DayScreen from "./pages/DayScreen";
import DaysList from "./pages/DaysList";
import Statistics from "./pages/Statistics";

// change dayjs to german
import dayjs from "dayjs";
import { loadMoodsFromStorage } from "./helpers/moods";
import Data from "./pages/Data";
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
            <div id="topBar">
                <div
                    className={
                        "navButton left" +
                        (pathname === "/" || pathname === "/days"
                            ? " hidden"
                            : "")
                    }
                >
                    <Link to={pathname === "/stats" ? "/days" : "/"}>
                        <KeyboardArrowLeftIcon />
                    </Link>
                </div>
                <div className="logo">
                    <h1>
                        <img
                            src={
                                process.env.PUBLIC_URL +
                                "/assets/logo/logoText.svg"
                            }
                            alt="Moodly logo text"
                        />
                    </h1>
                </div>
                <div
                    className={
                        "navButton right" +
                        (pathname !== "/" && pathname !== "/days"
                            ? " hidden"
                            : "")
                    }
                >
                    <Link to={"/stats"}>
                        <BarChartIcon />
                    </Link>
                </div>
            </div>
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
                        <Route path="/data" component={Data} />
                    </Switch>
                </SharedElementContextProvider>
            </div>
        </>
    );
};

export default App;
