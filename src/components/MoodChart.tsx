import { Area, ComposedChart, XAxis } from "recharts";
import { moodColors } from "../helpers/moods";
import { dayType } from "./DayCard";

type dataPoint = {
    uv?: number | null;
    pv: number;
    amt: number;
    ar?: number;
    pt?: number | null;
};

type props = {
    day: dayType;
    detailed?: boolean;
    setHighlightedHour?: (hour: number) => void;
};

const MoodChart: React.FC<props> = ({ day, detailed, setHighlightedHour }) => {
    const hours = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23,
    ];

    const data: Array<dataPoint> = hours.map((num) => {
        let [total, amount] = [0, 0];

        day.moods.forEach((mood) => {
            const hour = parseInt(
                new Date(mood.time).toLocaleTimeString().slice(0, 2)
            );

            if (hour === num && mood.mood != null) {
                total += mood.mood;
                amount++;
            }
        });

        let average = total / amount;

        return {
            uv: average || null,
            pv: 5,
            amt: 5,
        };
    });

    data.map((d, i) => {
        if (i != 0)
            data[i - 1] = {
                ...d,
                pt: d.uv,
            };
    });

    data.unshift({ ar: 1, pv: 5, amt: 5 });
    data.push({ ar: 5, pv: 5, amt: 5 });

    data[0].uv = data[0].uv == null ? 3 : data[0].uv;
    data[23].uv = data[23].uv == null ? 3 : data[23].uv;

    let highest = 0,
        lowest = 5;

    data.map((d) => d.uv).forEach((num) => {
        if (highest < (num || 0)) highest = num || highest;
        if (lowest > (num || 5)) lowest = num || lowest;
    });
    moodColors.slice(lowest - 1, highest);
    const gradient = moodColors
        .map((c, i) => (
            <stop
                key={i}
                offset={1 - (1 / (moodColors.length - 1)) * i}
                stopColor={c}
                stopOpacity={1}
            />
        ))
        .reverse();

    const chartId = "chartGradient" + new Date(day.date).getTime();

    return (
        <ComposedChart
            width={detailed ? 300 : 250}
            height={detailed ? 200 : 150}
            data={data}
            onClick={(e) => {
                if (
                    e != null &&
                    e.activeLabel != undefined &&
                    setHighlightedHour != undefined
                )
                    setHighlightedHour(parseInt(e.activeLabel));
            }}
        >
            <defs>
                <linearGradient id={chartId} x1="0" y1="0" x2="0" y2="1">
                    {gradient}
                </linearGradient>
            </defs>
            {detailed ? <XAxis markerUnits={"Uhr"} /> : null}
            <Area
                type="monotone"
                dataKey="uv"
                stroke={`url(#${chartId})`}
                fillOpacity={1}
                strokeWidth={3}
                connectNulls={true}
                fill="none"
                dot={
                    detailed ? { fill: "#3dc2ff", r: 5, strokeWidth: 0 } : false
                }
            />

            <Area
                type="monotone"
                dataKey="ar"
                fillOpacity={0}
                strokeWidth={0}
                fill="none"
            />
        </ComposedChart>
    );
};

export default MoodChart;
