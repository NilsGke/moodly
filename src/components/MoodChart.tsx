import dayjs from "dayjs";
import { Area, ComposedChart, Line, XAxis } from "recharts";
import { moodColors, moodType } from "../helpers/moods";
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
    activeMood?: moodType["id"];
    modifiedMood?: moodType;
};

const MoodChart: React.FC<props> = ({
    day,
    detailed,
    setHighlightedHour,
    activeMood,
    modifiedMood,
}) => {
    const hours = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23,
    ];

    const data: Array<dataPoint> = hours.map((num) => {
        let [total, amount] = [0, 0];
        let active = false;

        day.moods.forEach((mood) => {
            const hour = dayjs(mood.time).hour();
            if (hour === num && mood.mood != null) {
                total += mood.mood;
                amount++;
                if (mood.id === activeMood) active = true;
            }
        });

        let average = total / amount;

        return {
            uv: average || null,
            pv: 5,
            amt: 5,
            mk: active ? average : null,
        };
    });
    // console.log(day.moods);

    data.forEach((d, i) => {
        if (i !== 0)
            data[i - 1] = {
                ...d,
                pt: d.uv,
            };
    });

    // this is to keep the lines in the center of the chart (if the full range (1 - 5) is not present)
    data.unshift({ ar: 1, pv: 5, amt: 5 });
    data.push({ ar: 5, pv: 5, amt: 5 });

    // adds endpoints that have the same value as closest points
    for (let i = 0; i < data.length; i++) {
        const p = data[i];
        if (data[0].uv == null && p.uv != null) data[0].uv = p.uv;

        if (
            data[data.length - 1].uv == null &&
            data[data.length - 1 - i].uv != null
        )
            data[data.length - 1].uv = data[data.length - 1 - i].uv;
    }

    let highest = 0,
        lowest = 5;

    // assing highest and lowest
    data.map((d) => d.uv).forEach((num) => {
        if (highest < (num || 0)) highest = num || highest;
        if (lowest > (num || 5)) lowest = num || lowest;
    });

    const colors = moodColors.slice(lowest - 1, highest);

    let gradient: JSX.IntrinsicElements["stop"][] = [];

    if (colors.length > 1)
        gradient = colors
            .map((c, i) => (
                <stop
                    key={i}
                    offset={1 - (1 / (colors.length - 1)) * i}
                    stopColor={c}
                    stopOpacity={1}
                />
            ))
            .reverse();

    const chartId = "chartGradient" + new Date(day.date).getTime();

    return (
        <div>
            <ComposedChart
                width={detailed ? 300 : 250}
                height={detailed ? 200 : 150}
                data={data}
                onClick={(e) => {
                    if (
                        e !== null &&
                        e.activeLabel !== undefined &&
                        setHighlightedHour !== undefined
                    )
                        setHighlightedHour(parseInt(e.activeLabel));
                }}
            >
                <defs>
                    <linearGradient id={chartId} x1="0" y1="0" x2="0" y2="1">
                        {gradient}
                    </linearGradient>
                </defs>
                {detailed ? (
                    <XAxis markerUnits={"Uhr"} interval={1} fontSize={10} />
                ) : null}
                <Area
                    type="monotone"
                    dataKey="uv"
                    stroke={
                        gradient.length === 1
                            ? `#${gradient[0]}`
                            : `url(#${chartId})`
                    }
                    fillOpacity={1}
                    strokeWidth={3}
                    connectNulls={true}
                    fill="none"
                    isAnimationActive={false}
                    dot={
                        detailed
                            ? {
                                  fill: "#92949c",
                                  r: 5,
                                  strokeWidth: 0,
                              }
                            : false
                    }
                />
                {detailed ? (
                    <Line
                        dataKey="mk"
                        fill="none"
                        isAnimationActive={false}
                        dot={{
                            fill: "#3880ff",
                            r: 5,
                            strokeWidth: 0,
                        }}
                    />
                ) : null}

                <Area
                    type="monotone"
                    dataKey="ar"
                    fillOpacity={0}
                    strokeWidth={0}
                    fill="none"
                    isAnimationActive={false}
                />
            </ComposedChart>
        </div>
    );
};

export default MoodChart;
