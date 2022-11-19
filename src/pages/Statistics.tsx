import { useState } from "react";
import dayjs from "dayjs";
import PeriodToggleButtons from "../components/PeriodToggleButtons";
import AverageChart from "../components/statsCharts/AverageChart";
import "../styles/Statistics.scss";
import { period } from "../components/PeriodToggleButtons";
import { getMoods, loadMoodsFromStorage, moodType } from "../helpers/moods";
import ButtonGroup from "@mui/material/ButtonGroup/ButtonGroup";
import Button from "@mui/material/Button/Button";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import { Share } from "@capacitor/share";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { useHistory } from "react-router-dom";

const Statistics: React.FC = () => {
    const history = useHistory();
    const [period, setPeriod] = useState<period>("week");
    const [referenceDay, setReferenceDay] = useState(dayjs().valueOf());

    const latestDate = referenceDay;
    const oldestDate =
        period === "all" ? 0 : dayjs(latestDate).subtract(1, period);

    // const periodString = period[0].toUpperCase() + period.substring(1) + "ly";

    const moods: Array<moodType> =
        period === "all"
            ? getMoods()
            : getMoods().filter(
                  (mood) =>
                      dayjs(mood.date).isBefore(
                          dayjs(latestDate).add(1, "day"),
                          "day"
                      ) &&
                      dayjs(mood.date).isAfter(
                          dayjs(oldestDate).subtract(1, "day"),
                          "day"
                      )
              );

    const changeReferenceDay = (direction: "plus" | "minus") => {
        let newRefDay: number;
        console.log(period, direction);

        if (period === "all") return;
        if (direction === "plus")
            newRefDay = dayjs(referenceDay).add(1, period).valueOf();
        else newRefDay = dayjs(referenceDay).subtract(1, period).valueOf();

        if (dayjs(newRefDay).isBefore(dayjs().add(1, "day")))
            setReferenceDay(newRefDay);
    };

    const exportFun = async () => {
        const data = JSON.stringify(await loadMoodsFromStorage());

        try {
            const result = await Filesystem.writeFile({
                path: `moodlyBackup.json`,
                data: btoa(data),
                directory: Directory.Cache,
            });
            console.log("Wrote file", result);
            let shareRet = await Share.share({
                title: "moodly backup file",
                url: result.uri,
                dialogTitle: "Save file",
                text: "test test tes",
            });
        } catch (e) {
            console.error("Unable to write file", e);

            console.log("-> trying to share file via navigator api");

            try {
                window.navigator.share({
                    text: data,
                });
            } catch (e) {
                console.log("unable to access (or use) navivator");
                alert(
                    "unable to share file / text. copy text from this page ->"
                );
                history.push("/data");
            }
        }
    };

    return (
        <div id="page" className="statistics">
            <div className="card" id="header">
                <button
                    className="arrow"
                    id="leftArrow"
                    onClick={() => changeReferenceDay("minus")}
                    disabled={period === "all"}
                >
                    &lt;
                </button>
                <div id="periodPicker">
                    <h2>
                        {period !== "all"
                            ? dayjs(oldestDate).format("DD.MM") +
                              " - " +
                              dayjs(latestDate).format("DD.MM")
                            : "Alle"}
                    </h2>
                    <PeriodToggleButtons
                        change={(newPeriod: period) => setPeriod(newPeriod)}
                    />
                </div>
                <button
                    className="arrow"
                    id="rightArrow"
                    onClick={() => changeReferenceDay("plus")}
                    disabled={
                        period === "all" ||
                        dayjs(referenceDay).add(1, period).isAfter(dayjs())
                    }
                >
                    &gt;
                </button>
            </div>

            <div id="chart1" className="card">
                <h2>Daily average</h2>
                <AverageChart moods={moods} />
            </div>

            <div className="card options">
                <ThemeProvider
                    theme={createTheme({ palette: { mode: "dark" } })}
                >
                    <ButtonGroup
                        variant="outlined"
                        aria-label="import export button"
                    >
                        <Button onClick={exportFun}>Export</Button>
                    </ButtonGroup>
                </ThemeProvider>
            </div>
        </div>
    );
};

export default Statistics;
