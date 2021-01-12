export class Point {
    x : number
    y : number

    constructor(x : number, y : number) {
        this.x = x
        this.y = y
    }

    get magnitude() {
        return Math.sqrt((this.x * this.x + this.y * this.y))
    }
}

function magnitude(point : Array<number>) {
    const x = point[0]
    const y = point[1]
    return Math.sqrt((x * x + y * y))
}

function getOrtogonalProjection(A : Array<number>, B : Array<number>, P : Array<number>) {
    const dAP = magnitude([P[0] - A[0], P[1] - A[1]])
    const dBP = magnitude([P[0] - B[0], P[1] - B[1]])
    const intersections = intersectTwoCircles(A[0], A[1], dAP, B[0], B[1], dBP)
    if (intersections.length == 0) {
        return []
    }
    return [
        (intersections[0][0] + intersections[1][0]) / 2,
        (intersections[0][1] + intersections[1][1]) / 2
    ]
}

// https://gist.github.com/jupdike/bfe5eb23d1c395d8a0a1a4ddd94882ac
// https://math.stackexchange.com/questions/256100/how-can-i-find-the-points-at-which-two-circles-intersect
function intersectTwoCircles(x1 : number, y1 : number, r1 : number, x2 : number, y2 : number, r2 : number) {
    var centerdx = x1 - x2;
    var centerdy = y1 - y2;
    var R = Math.sqrt(centerdx * centerdx + centerdy * centerdy);
    if (!(Math.abs(r1 - r2) <= R && R <= r1 + r2)) { // no intersection
        return []; // empty list of results
    }
    // intersection(s) should exist
  
    var R2 = R*R;
    var R4 = R2*R2;
    var a = (r1*r1 - r2*r2) / (2 * R2);
    var r2r2 = (r1*r1 - r2*r2);
    var c = Math.sqrt(2 * (r1*r1 + r2*r2) / R2 - (r2r2 * r2r2) / R4 - 1);
  
    var fx = (x1+x2) / 2 + a * (x2 - x1);
    var gx = c * (y2 - y1) / 2;
    var ix1 = fx + gx;
    var ix2 = fx - gx;
  
    var fy = (y1+y2) / 2 + a * (y2 - y1);
    var gy = c * (x1 - x2) / 2;
    var iy1 = fy + gy;
    var iy2 = fy - gy;
  
    // note if gy == 0 and gx == 0 then the circles are tangent and there is only one solution
    // but that one solution will just be duplicated as the code is currently written
    return [[ix1, iy1], [ix2, iy2]];
}

export {getOrtogonalProjection}