import { useState } from "react";
import dayjs from "dayjs";
import PeriodToggleButtons from "../components/PeriodToggleButtons";
import AverageChart from "../components/statsCharts/AverageChart";
import "../styles/Statistics.scss";
import { period } from "../components/PeriodToggleButtons";
import { getMoods, moodType } from "../helpers/moods";

const Statistics: React.FC = () => {
    const [period, setPeriod] = useState<period>("week");
    const [referenceDay, setReferenceDay] = useState(dayjs().valueOf());

    const latestDate = referenceDay;
    const oldestDate =
        period === "all" ? 0 : dayjs(latestDate).subtract(1, period);

    // const periodString = period[0].toUpperCase() + period.substring(1) + "ly";

    console.log(getMoods());

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

    console.log(moods);

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
        </div>
    );
};

export default Statistics;
