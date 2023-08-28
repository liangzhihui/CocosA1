export function defer<T>() {
    let resolve, reject;
    let promise = new Promise<T>(function () {
        resolve = arguments[0];
        reject = arguments[1];
    });

    return {
        promise: promise,
        resolve: resolve,
        reject: reject
    }
}

export function promisify(fn: Function) {
    return function (...args) {
        return new Promise<any>((resolve, reject) => {
            function customCallback(err, ...results) {
                if (err) {
                    return reject(err);
                }
                return resolve(results.length === 1 ? results[0] : results);
            }
            args.push(customCallback);
            fn.apply(this, args);
        });
    }
}

export const wait = (time: number) =>
    new Promise<number>((resolve) => setTimeout(() => resolve(time), time));
