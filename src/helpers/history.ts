import { moodType, setMoods } from "./moods";


export let timeLine: Array<moodType[]> = [];

let pointer: number = 0;

export const getFutureLength = (): number => timeLine.length - (pointer + 1);
export const getHistoryLength = (): number => pointer - 1

const getCurrent = (): moodType[] => timeLine.slice()[pointer];

export const deleteFuture = () => timeLine = timeLine.slice(0, pointer + 1);

export const addNewState = (moods: moodType[]): void => {
    deleteFuture();
    timeLine.push([]);
    pointer = (timeLine.length) - 1;
    moods.forEach(mood => timeLine[pointer].push(mood));

}

export const goBackInTime = () => {
    return new Promise<void>((resolve, reject) => {
        if (pointer < 1) return reject();
        pointer--;
        setMoods(getCurrent()).then(resolve, reject);
    })
}

export const backToTheFuture = () => {
    return new Promise<void>((resolve, reject) => {
        if (pointer == timeLine.length - 1) return reject();
        pointer++;
        setMoods(getCurrent()).then(resolve, reject);
    })
}
export const clearTimeline = (): void => { timeLine.length = 0; pointer = -1; };
