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

// https://gist.github.com/battmanz/e28311f765a18fc6a841201912422d60
function dot(vector1 : Array<number>, vector2 : Array<number>) {
    return vector1.reduce((sum, element, index) => sum += element * vector2[index], 0);
}

// https://lucidar.me/en/mathematics/check-if-a-point-belongs-on-a-line-segment/#:~:text=The%20cross%20product%20of%20A,t%20belongs%20on%20the%20segment.
export function isOnSegment(A : Array<number>, B : Array<number>, P : Array<number>) {
    const KAC = dot(
        [
            B[0] - A[0],
            B[1] - A[1]
        ],
        [
            P[0] - A[0],
            P[1] - A[1]
        ]
    )
    const KAB = dot(
        [
            B[0] - A[0],
            B[1] - A[1]
        ],
        [
            B[0] - A[0],
            B[1] - A[1]
        ]
    )
    return !(KAC < 0 || KAC > KAB)
}

export function magnitude(point : Array<number>) {
    const x = point[0]
    const y = point[1]
    return Math.sqrt((x * x + y * y))
}

export function getOrtogonalProjection(A : Array<number>, B : Array<number>, P : Array<number>) {
    const AP = [P[0] - A[0], P[1] - A[1]]
    const AB = [B[0] - A[0], B[1] - A[1]]
    const dots = dot(AP, AB) / dot(AB, AB)
    const projection = [AB[0] * dots, AB[1] * dots]
    return [A[0] + projection[0], A[1] + projection[1]]
}

export function getProjectionOnLineString(point : Array<number>, string : Array<Array<number>>) {

    const projections = []
    
    // for every pair of coordinates
    for (let j = 1; j < string.length; j++) {
        const i = j - 1

        // get the projection
        const result = getOrtogonalProjection(
            string[i],
            string[j],
            point
        )

        // append if projection is between the pair
        if (isOnSegment(string[i], string[j], result)) {
            projections.push({
                projection : result,
                segment : [string[i], string[j]]
            })
        }
    }

    // get the closest point, so if the point is in an edge,
    // the projection will be the edge, otherwise the projection,
    // would be somewhere in the closest segment, and its not
    // guaranteed that the projection will be on the LineString

    // there is also this weird case in which the projection is
    // not in any of the segments of that edge, and the chosen
    // projection is very far away; this also prevents this case
    const closestPoint = string.slice().sort((a, b) => 
        magnitude([a[0] - point[0], a[1] - point[1]]) - magnitude([b[0] - point[0], b[1] - point[1]])
    )[0]
    projections.push({
        projection : closestPoint,
        segment : [closestPoint, string[string.indexOf(closestPoint) + 1]]
    })

    // sort projections by their distance
    projections.sort((a, b) => {
        const da = magnitude([a.projection[0] - point[0], a.projection[1] - point[1]])
        const db = magnitude([b.projection[0] - point[0], b.projection[1] - point[1]])
        return da - db
    })

    //returns closest projection, that is in a segment, including edges
    return projections[0]
}
