import { Vec2, v2 } from "cc";
import { almostEqual } from "./utils";

export function zero(out: Vec2) {
    return Vec2.set(out, 0, 0);
}

/** 两个点的距离 */
export function distance(a: Vec2, b: Vec2) {
    const x = b.x - a.x;
    const y = b.y - a.y;
    return Math.sqrt(x * x + y * y);
}

/** 两个点的距离的平方 */
export function squaredDistance(a: Vec2, b: Vec2) {
    const x = b.x - a.x;
    const y = b.y - a.y;
    return x * x + y * y;
}

/** 限制向量的大小 */
export function limit(out: Vec2, a: Vec2, len: number): Vec2 {
    let aLen = a.length();
    if (aLen > len)
        return Vec2.multiplyScalar(out, a, len / aLen);
    else
        return Vec2.copy(out, a);
}

/** 设置向量的大小 */
export function setLength(out: Vec2, a: Vec2, len: number): Vec2 {
    let aLen = a.length();
    if (aLen == 0)
        return Vec2.copy(out, a);

    return Vec2.multiplyScalar(out, a, len / aLen);
}

/** To find orientation of ordered triplet (p, q, r). 
// The function returns following values 
// 0 --> p, q and r are colinear 
// 1 --> Clockwise 
// 2 --> Counterclockwise
*/
export function orientation(p1: Vec2, p2: Vec2, p3: Vec2, errorMargin = 0.0001) {
    let val = (p3.x - p2.x) * (p2.y - p1.y) -
        (p2.x - p1.x) * (p3.y - p2.y);

    if (almostEqual(val, 0, errorMargin)) return 0;
    return val > 0 ? 2 : 1;
}

// Given three colinear points p, q, r, the function checks if 
// point q lies on line segment 'pr' 
function onSegment(p: Vec2, q: Vec2, r: Vec2) {
    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
        q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
        return true;

    return false;
}

/** 线段p1p2与线段p3p4是否相交 */
export function doIntersect(p1: Vec2, p2: Vec2, p3: Vec2, p4: Vec2, errorMargin = 0.0001) {
    let o1 = orientation(p1, p2, p3, errorMargin)
    let o2 = orientation(p1, p2, p4, errorMargin)
    let o3 = orientation(p3, p4, p1, errorMargin);
    let o4 = orientation(p3, p4, p2, errorMargin);

    if (o1 != o2 && o3 != o4)
        return true;

    if (o1 == 0 && onSegment(p1, p3, p2)) return true;
    if (o2 == 0 && onSegment(p1, p4, p2)) return true;
    if (o3 == 0 && onSegment(p3, p1, p4)) return true;
    if (o4 == 0 && onSegment(p3, p2, p4)) return true;
    return false;
}

/** 计算两个向量之间的夹角（弧度 0~PI） */
export function angleBetween(a: Vec2, b: Vec2): number {
    return Math.acos(a.dot(b) / (a.length() * b.length()));
}

/** 计算两个向量之间的旋转角 (弧度 0~2*PI) */
export function rotationBetween(a: Vec2, b: Vec2): number {
    let res = angleBetween(a, b);
    return a.cross(b) > 0 ? res : (2 * Math.PI - res);
}

const v2_a: Vec2 = new Vec2();
const v2_b: Vec2 = new Vec2();
/** 计算点到选段的距离 */
export function distToSegmentSquared(point: Vec2, p1: Vec2, p2: Vec2) {
    Vec2.subtract(v2_a, p2, p1);
    Vec2.subtract(v2_b, point, p1);

    let t = Vec2.dot(v2_a, v2_b) / v2_a.lengthSqr();

    if (t < 0) {
        return Vec2.squaredDistance(point, p1);
    } else if (t > 1) {
        return Vec2.squaredDistance(point, p2);
    } else {
        return Vec2.squaredDistance(point, v2_a.multiplyScalar(t).add(p1));
    }
}

/** 点是否在多边形内 */
export function isPointInPoly(poly: Readonly<Vec2[]>, pt: Readonly<Vec2>) {
    let res = false;
    for (let i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        if (((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y)) &&
            (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)) {
            res = !res;
        }
    return res;
}

/** 点是否在线段上 */
export function isPointOnSegment(pt: Vec2, p: Vec2, q: Vec2) {
    let left = Math.min(p.x, q.x), right = Math.max(p.x, q.x), top = Math.min(p.y, q.y), bottom = Math.max(p.y, q.y);
    return pt.x >= left &&
        pt.x <= right &&
        pt.y >= top &&
        pt.y <= bottom &&
        Math.abs((pt.x - p.x) * (q.y - p.y) - (q.x - p.x) * (pt.y - p.y)) <= 0.0001;
}

/** 点是否在多边形的边上 */
export function isPointOnEdge(poly: Vec2[], pt: Vec2) {
    let p: Vec2, q: Vec2;
    for (let i = 1, il = poly.length; i < il; i++) {
        p = poly[i - 1];
        q = poly[i];
        if (isPointOnSegment(pt, p, q))
            return true;
    }
    p = poly[0];
    q = poly[poly.length - 1];
    if (isPointOnSegment(pt, p, q))
        return true;
    return false;
}

/** 将点投影到线段上 */
export function projectPointToSegment(out: Vec2, point: Vec2, p1: Vec2, p2: Vec2) {
    const l2 = squaredDistance(p1, p2);
    if (l2 == 0)
        return Vec2.copy(out, p1);
    let t = (point.x - p1.x) * (p2.x - p1.x) + (point.y - p1.y) * (p2.y - p1.y);
    t /= l2;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    return out.set(p1.x + t * (p2.x - p1.x), p1.y + t * (p2.y - p1.y));
}

const v2_1 = new Vec2();
const v2_2 = new Vec2();
/** 将点投影到多边形上 */
export function projectPointToPolygon(out: Vec2, point: Vec2, polygon: Vec2[]) {
    let closestProjection = zero(v2_1);
    let closestDistance = Infinity;
    let p, q, projectedPoint, d;
    for (let i = 1, il = polygon.length; i < il; i++) {
        p = polygon[i - 1];
        q = polygon[i];
        projectedPoint = projectPointToSegment(v2_2, point, p, q);
        d = squaredDistance(point, projectedPoint);
        if (d < closestDistance) {
            closestDistance = d;
            closestProjection.set(projectedPoint);
        }
    }
    p = polygon[0];
    q = polygon[polygon.length - 1];
    projectedPoint = projectPointToSegment(v2_2, point, p, q);
    d = squaredDistance(point, projectedPoint);
    if (d < closestDistance) {
        closestDistance = d;
        closestProjection.set(projectedPoint);
    }
    return out.set(closestProjection);
}

/** 计算点到多边形的距离 */
export function distanceBetweenPointAndPolygon(point: Vec2, polygon: Vec2[]) {
    this.projectPointToPolygon(v2_1, point, polygon);
    return distance(point, v2_1);
}
