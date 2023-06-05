export function handleStr(str: string) {
    return 'custom' + str;
}

export function sleep(time: number) {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

export const getData = async () => {
    await sleep(10);
    return {
        success: true
    }
};