import { IVec2Like } from "cc";

export function clampf(value: number, min_inclusive: number, max_inclusive: number) {
    if (min_inclusive > max_inclusive) {
        var temp = min_inclusive;
        min_inclusive = max_inclusive;
        max_inclusive = temp;
    }
    return value < min_inclusive ? min_inclusive : value < max_inclusive ? value : max_inclusive;
}

export function clamp01(value: number) {
    return value < 0 ? 0 : value < 1 ? value : 1;
}

export function lerp(a: number, b: number, r: number) {
    return a + (b - a) * r;
}

export function remap(v: number, low1: number, high1: number, low2: number, high2: number) {
    return low2 + (high2 - low2) * (v - low1) / (high1 - low1);
}

export function manhattan(a: IVec2Like, b: IVec2Like) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function toFixed(num: number, n = 0) {
    if (n == 0) {
        return Math.round(num);
    } else {
        const m = Math.pow(10, n);
        return Math.round(num * (m * 10) / 10) / m;
    }
}

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

export function degreesToRadians(angle: number) {
    return angle * RAD;
}

export function radiansToDegrees(angle: number) {
    return angle * DEG;
}

// https://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript
// Bresenham algorithm in Javascript
export function line(out: any[], x0: number, y0: number, x1: number, y1: number) {
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (x0 != x1 || y0 != y1) {
        var e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }

        out.push(x0, y0);
    }
}
