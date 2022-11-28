import { Storage } from "@capacitor/storage";
import dayjs from "dayjs";
import { dayType } from "../components/DayCard";
import { addNewState } from "./history";

export type moodType = {
    id: number;
    date: number;
    time: number;
    mood: 5 | 4 | 3 | 2 | 1;
    text: string;
};

let moods: moodType[] = [];

export const getMoods = (): moodType[] => moods.slice();

export const loadMoodsFromStorage = (): Promise<Array<moodType>> =>
    new Promise(async (res) => {
        const data = (await Storage.get({ key: "moods" })).value;
        const newMoods: moodType[] = await JSON.parse(data || `[]`).map(
            (mood: moodType) => ({
                ...mood,
                date: dayjs(mood.date).valueOf(),
            })
        );
        moods = newMoods;
        res(newMoods);
    });

export const saveMoodsToStorage = (): Promise<void> => {
    return new Promise((res) =>
        Storage.set({ key: "moods", value: JSON.stringify(getMoods()) }).then(
            res
        )
    );
};

export const setMoods = (newMoods: Array<moodType>): Promise<void> => {
    moods = newMoods;
    return saveMoodsToStorage();
};

export const addMood = async (newMood: moodType): Promise<void> => {
    const oldMoods = getMoods();
    if (newMood.id === -1) newMood.id = getFreeId(oldMoods);
    moods = [...oldMoods, newMood];
    return saveMoodsToStorage();
};

export const modifyMood = (modifiedMood: moodType): Promise<void> => {
    moods = getMoods().map((m) => {
        if (m.id !== modifiedMood.id) return m;
        else return modifiedMood;
    });
    return saveMoodsToStorage();
};

export const removeMood = (mood: moodType): Promise<void> => {
    const oldMoods = getMoods();
    const newMoods = oldMoods.filter((m) => m.id !== mood.id);
    addNewState(newMoods);
    return setMoods(newMoods);
};

const getFreeId = (moods: Array<moodType>): number => {
    const taken = moods.map((m) => m.id);
    let id = 0;
    while (taken.includes(id)) id++;
    return id;
};

export const moodsToDays = (moods: Array<moodType>): Array<dayType> => {
    const days: Array<dayType> = [];
    moods.forEach((mood) => {
        const foundDay = days.find((day) => dayjs(day.date).isSame(mood.date));
        if (foundDay === undefined)
            days.push({
                moods: [mood],
                date: mood.date,
            });
        else foundDay.moods.push(mood);
    });
    return days.sort((a, b) => a.date - b.date);
};

export const getEncodedMoods = async (): Promise<string> =>
    btoa(encodeURIComponent(JSON.stringify(await loadMoodsFromStorage())));

export const decodeMoods = (str: string): string =>
    decodeURIComponent(window.atob(str));

export const moodColors = [
    "#eb445a",
    "#f58432",
    "#ffc409",
    "#81cd46",
    "#2dd36f",
];
