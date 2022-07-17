import dayjs from "dayjs";
import { Area, ComposedChart, XAxis } from "recharts";
import { moodColors, moodsToDays, moodType } from "../../helpers/moods";
import { dayType } from "../DayCard";

type dataPoint = {
    uv?: number | null;
    pv: number;
    amt: number;
    ar?: number;
    pt?: number | null;
};

type dayWithAverages = dayType & {
    hours: Array<{
        hour: number;
        average: number;
    }>;
};

type props = {
    moods: Array<moodType>;
};

const AverageChart: React.FC<props> = ({ moods }) => {
    const hours = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23,
    ];

    const daysAverages: Array<Array<number>> = moodsToDays(moods).map((day) => {
        const averagedDay: dayWithAverages = {
            ...day,
            hours: hours.map((h) => ({ hour: h, average: 0 })),
        };

        averagedDay.hours.forEach((hour) => {
            let total = 0;
            let amount = 0;
            day.moods.forEach((mood) => {
                if (dayjs(mood.time).hour() === hour.hour) {
                    total += mood.mood;
                    amount++;
                }
            });

            hour.average = Math.round(total / amount);
        });

        return averagedDay.hours.map((hour) => hour.average);
    });

    const filled = daysAverages
        .map((d) => d.map((n) => (isNaN(n) ? undefined : n)))
        .map((day) => {
            let count = 0;
            while (day.includes(undefined)) {
                count++;
                if (count === 300) {
                    console.log("exit");
                    break;
                }

                const startIndex = day.findIndex((num) => num === undefined);
                const endIndex = day.findIndex(
                    (num, i) => i >= startIndex && num !== undefined
                );
                const avg =
                    ((day[startIndex - 1] || 0) + (day[endIndex] || 0)) / 2;
                for (let i = startIndex; i < endIndex; i++) day[i] = avg;
            }
            return day;
        });

    // console.log(filled)

    const averaged: number[] = [];
    for (let i = 0; i < hours.length; i++) {
        let total: number = 0,
            count: number = 0;
        filled.forEach((elm) => {
            const element = elm[i];
            if (element === undefined) return;
            else {
                total += element;
                count++;
            }
        });
        averaged.push(total / count);
    }

    console.log(averaged, hours);

    const data: Array<dataPoint> = averaged.map((average) => ({
        uv: average || null,
        pv: 5,
        amt: 5,
    }));

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

    return (
        <ComposedChart width={300} height={200} data={data}>
            <defs>
                <linearGradient id="averageChart" x1="0" y1="0" x2="0" y2="1">
                    {gradient}
                </linearGradient>
            </defs>
            <XAxis markerUnits={"Uhr"} interval={1} fontSize={10} />

            <Area
                type="monotone"
                dataKey="uv"
                stroke={
                    gradient.length === 1
                        ? `#${gradient[0]}`
                        : `url(#averageChart)`
                }
                fillOpacity={1}
                strokeWidth={3}
                connectNulls={true}
                fill="none"
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

export default AverageChart;
