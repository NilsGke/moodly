import { getMoods, moodType, setMoods } from "./moods";


export const history: Array<moodType[]> = [];

export const saveCurrentInHistory = () => {
    return new Promise<void>(async (resolve, reject) => {
        history.push(await getMoods())
        resolve();
    })
}

export const goBackInTime = () =>
    new Promise<void>((resolve, reject) => {
        if (history.length === 0) return reject();
        const newMoods = history.pop() || [];
        setMoods(newMoods).then(resolve, reject);
    })

export const clearHistory = (): void => { history.length = 0 };
