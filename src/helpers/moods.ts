import { Storage } from "@capacitor/storage";
import dayjs from "dayjs"


export type moodType = {
    id: number;
    date: number;
    time: number;
    mood: 5 | 4 | 3 | 2 | 1;
    text: string;
};

export const getMoods = (): Promise<Array<moodType>> =>
    new Promise(async (res) => {
        const data = (await Storage.get({ key: "moods" })).value;
        const moods = await JSON.parse(data || `[]`).map(
            (mood: moodType) => ({
                ...mood,
                date: dayjs(mood.date).valueOf(),
            })
        );
        res(moods);
    })


export const addMood = (mood: moodType): Promise<void> =>
    new Promise(async (res) => {
        console.log("getting moods");
        const moods = await getMoods();
        console.log("done");
        mood.id = getFreeId(moods);
        console.log("adding");

        await Storage.set({ key: "moods", value: JSON.stringify([...moods, mood]) })
        console.log("done");
        res();
    });

export const removeMood = (mood: moodType): Promise<void> =>
    new Promise(async (res) => {
        console.log("getting moods");

        const moods = (await getMoods()).filter(m => JSON.stringify(m) != JSON.stringify(mood));
        console.log("done, settings moods");
        await Storage.set({ key: "moods", value: JSON.stringify(moods) });
        console.log("done");
        res();
    })

const getFreeId = (moods: Array<moodType>): number => {
    const taken = moods.map(m => m.id);
    let id = 0;
    while (taken.includes(id)) id++;
    return id;
}

export const moodColors = ["#eb445a", "#f58432", "#ffc409", "#81cd46", "#2dd36f"]