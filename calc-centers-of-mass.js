const mathUtils = {
    pythag: (a, b) => Math.sqrt(a * a + b * b),
    rad2deg: rad => rad * 180 / Math.PI,
    deg2rad: deg => deg * Math.PI / 180,
    atan2: (y, x) => mathUtils.rad2deg(Math.atan2(y, x)),
    cos: x => Math.cos(mathUtils.deg2rad(x)),
    sin: x => Math.sin(mathUtils.deg2rad(x))
};

// Point setup
const Point = (x, y) => ({
    x,
    y,
    add: ({ x: x2, y: y2 }) => Point(x + x2, y + y2),
    sub: ({ x: x2, y: y2 }) => Point(x - x2, y - y2),
    bind: f => f(x, y),
    inspect: () => `(${x.toPrecision(2)}, ${y.toPrecision(2)})`
});

Point.origin = Point(0, 0);
Point.fromVector = ({ a, m }) => Point(m * mathUtils.cos(a), m * mathUtils.sin(a));

// Vector setup
const Vector = (a, m) => ({
    a,
    m,
    scale: x => Vector(a, m * x),
    add: v => Vector.fromPoint(Point.fromVector(Vector(a, m)).add(Point.fromVector(v))),
    inspect: () => `Vector(${a}, ${m})`
});

Vector.zero = Vector(0, 0);
Vector.fromPoint = ({ x, y }) => Vector(mathUtils.atan2(y, x), mathUtils.pythag(x, y));

const calcMidpoint = set => {
    const count = set.length;
    const midpoint = set.reduce((accum, { x, y }) => {
        return accum.add(Point(x, y));
    }, Point.origin);
    return midpoint.bind((x, y) => Point(x / count, y / count));
};

// per-pointset CoM
/**
 * 
 * @param {x, y, weight} set 
 */
const calcCenterOfMass = (set) => {
    if (set.length == 1) {
        return Point(set[0].x, set[0].y);
    }
    const midpoint = calcMidpoint(set);
    const totalWeight = set.reduce((accum, { v: weight }) => accum + weight, 0);
    const vectorSum = set.reduce((accum, { v: weight }) =>
        accum.add(Vector.fromPoint(midpoint.sub(midpoint)).scale(weight / totalWeight)), Vector.zero);
    return Point.fromVector(vectorSum).add(midpoint)
}

// CoM's for an array of points
const calcCentersOfMass = pointSets => {
    const centers = [];
    for (const set of pointSets) {
        centers.push(calcCenterOfMass(set));
    }
    return centers;
};

module.exports = calcCentersOfMass;
