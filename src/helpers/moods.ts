import { Storage } from "@capacitor/storage";
import dayjs from "dayjs"
import { saveCurrentInHistory } from "./history";

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

export const setMoods = (moods: Array<moodType>): Promise<void> => {
    return new Promise((res) =>
        Storage.set({ key: "moods", value: JSON.stringify(moods) }).then(res)
    )
}

export const addMood = (mood: moodType): Promise<void> =>
    new Promise(async (res) => {
        await saveCurrentInHistory();
        const moods = await getMoods();
        mood.id = getFreeId(moods);
        await Storage.set({ key: "moods", value: JSON.stringify([...moods, mood]) })
        res();
    });

export const removeMood = (mood: moodType): Promise<void> =>
    new Promise(async (res) => {
        await saveCurrentInHistory();
        const moods = (await getMoods()).filter(m => JSON.stringify(m) != JSON.stringify(mood));
        await Storage.set({ key: "moods", value: JSON.stringify(moods) });
        res();
    })

const getFreeId = (moods: Array<moodType>): number => {
    const taken = moods.map(m => m.id);
    let id = 0;
    while (taken.includes(id)) id++;
    return id;
}



export const moodColors = ["#eb445a", "#f58432", "#ffc409", "#81cd46", "#2dd36f"]