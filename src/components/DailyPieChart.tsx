import { Cell, Legend, Pie, PieChart } from "recharts";
import { moodColors, moodType } from "../helpers/moods";

type props = {
    moods: Array<moodType>;
};

const DailyPieChart: React.FC<props> = ({ moods }) => {
    const data = [
        {
            value: 0,
        },
        {
            value: 0,
        },
        {
            value: 0,
        },
        {
            value: 0,
        },
        {
            value: 0,
        },
    ];

    moods.forEach((mood) => {
        data[mood.mood - 1].value++;
    });

    return (
        <PieChart width={200} height={120}>
            <Pie
                isAnimationActive={false}
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={50}
                stroke="#383a3e"
                strokeWidth={1}
                fill="#8884d8"
            >
                {data.map((entry, index) => (
                    <Cell key={index} fill={moodColors[index]} />
                ))}
            </Pie>
            <Legend
                align="left"
                verticalAlign="middle"
                formatter={(value: number) => value + 1}
                layout={"vertical"}
                iconType={"square"}
            />
        </PieChart>
    );
};

export default DailyPieChart;
