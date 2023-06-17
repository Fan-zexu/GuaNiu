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

export function forEach(items: any[], callback: Function) {
    for (let index = 0; index < items.length; index++) {
        callback(items[index]);
    }
};

export function mockedFn() {
    return 'mockedFn';
}

type AnyFunction = (...args: any[]) => any;
export function after1000ms(callback?: AnyFunction) {
    console.log("准备计时");
    setTimeout(() => {
        console.log("午时已到");
        callback && callback();
    }, 1000);
}