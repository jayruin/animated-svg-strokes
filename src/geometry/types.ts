export interface Point {
    readonly x: number;
    readonly y: number;
}

export interface Line {
    readonly startPoint: Point;
    readonly endPoint: Point;
}
