export function fastRemove(array: any[], index: number) {
    if (index < 0 || index >= array.length)
        return;
    let last = array.length - 1;
    array[index] = array[last];
    array[last] = null;
    array.length--;
}

export function insertArray<T>(array: Array<T>, element: T, sort: (a: T, b: T) => number) {
    let i = array.length;
    array.push(element);

    while (i != 0 && sort(array[i - 1], element) > 0) {
        array[i] = array[i - 1];
        i--;
    }
    array[i] = element;
    return i;
}

export function remove<T>(array: T[], element: T) {
    let i = 0, j = 0, l = array.length;
    while(j < l) {
        if (array[j] !== element) {
            array[i++] = array[j];
        }
        j++;
    }
    array.length = i;
}

export function swap<T>(array: T[], i: number, j: number) {
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}