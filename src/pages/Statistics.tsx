import { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import PeriodToggleButtons from "../components/PeriodToggleButtons";
import AverageChart from "../components/statsCharts/AverageChart";
import "../styles/Statistics.scss";
import { period } from "../components/PeriodToggleButtons";
import {
    addMood,
    decodeMoods,
    getEncodedMoods,
    getMoods,
    moodType,
} from "../helpers/moods";
import ButtonGroup from "@mui/material/ButtonGroup/ButtonGroup";
import Button from "@mui/material/Button/Button";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import { Share } from "@capacitor/share";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { useHistory } from "react-router-dom";
import AlertMassage from "../components/AlertToast";

const Statistics: React.FC = () => {
    const history = useHistory();
    const [period, setPeriod] = useState<period>("week");
    const [referenceDay, setReferenceDay] = useState(dayjs().valueOf());

    // status notification from importing moods
    const [status, setStatusBase] = useState<{
        msg: string;
        key: number;
    } | null>(null);

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

        if (period === "all") return;
        if (direction === "plus")
            newRefDay = dayjs(referenceDay).add(1, period).valueOf();
        else newRefDay = dayjs(referenceDay).subtract(1, period).valueOf();

        if (dayjs(newRefDay).isBefore(dayjs().add(1, "day")))
            setReferenceDay(newRefDay);
    };

    // import
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFiles = useCallback(() => {
        if (inputRef.current) {
            var files = inputRef.current.files;
            if (files === null) return;
            let file = files[0];

            if (file) {
                var reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = function (evt) {
                    if (evt?.target && evt.target.result)
                        if (evt.target.result instanceof ArrayBuffer) {
                            let td = new TextDecoder();
                            let ua = new Uint8Array(evt.target.result);
                            importMoods(td.decode(ua));
                        } else importMoods(evt.target.result);
                };
            }
        }
    }, []);

    const importMoods = (base64string: string) => {
        const jsonString = decodeMoods(base64string);
        let addCounter = 0;
        try {
            const moods = JSON.parse(jsonString) as moodType[];
            const ogMoods = getMoods();
            moods.forEach((mood) => {
                console.log("adding mood start");
                const found = ogMoods.find(
                    (m) =>
                        m.date === mood.date &&
                        m.id === mood.id &&
                        m.mood === mood.mood &&
                        m.time === mood.time
                );
                if (found === undefined) {
                    let id = 0;
                    const ids = moods.map((m) => m.id);
                    while (ids.includes(id)) id++;
                    addMood({ ...mood, id });
                    addCounter++;
                } else console.warn("duplicate mood found: ", found);
            });
            setStatusBase({
                key: Math.random(),
                msg: "added " + addCounter + " moods",
            });
        } catch (error) {
            setStatusBase({
                key: Math.random(),
                msg: "Error while importing moods: " + error,
            });
        }
    };

    useEffect(() => {
        if (inputRef.current)
            inputRef.current.addEventListener("change", handleFiles, false);
        return () => {
            inputRef.current &&
                // eslint-disable-next-line react-hooks/exhaustive-deps
                inputRef.current.removeEventListener("change", handleFiles);
        };
    }, [handleFiles, inputRef]);

    const exportFun = async () => {
        const data = await getEncodedMoods();

        console.log(data);

        try {
            const result = await Filesystem.writeFile({
                path: `moodlyBackup_${dayjs(new Date()).format(
                    "MM_HH_DD_MM_YYYY"
                )}.txt`,
                data: btoa(data),
                directory: Directory.Cache,
            });
            console.log("Wrote file", result);
            let shareRet = await Share.share({
                title: "moodly backup file",
                url: result.uri,
                dialogTitle: "Save file",
                text: "Export moods",
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
            {status ? <AlertMassage message={status.msg} /> : null}
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
                        <Button component="label">
                            Import
                            <input
                                ref={inputRef}
                                hidden
                                type="file"
                                accept=".txt"
                            />
                        </Button>
                        <Button onClick={exportFun}>Export</Button>
                    </ButtonGroup>
                </ThemeProvider>
            </div>
        </div>
    );
};

export default Statistics;
