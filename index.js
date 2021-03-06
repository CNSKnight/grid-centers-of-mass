/**
 * 
 * @notes 
 * - run in a console with `$ node .`
 * - run in Chrome by issuing `$ node --inspect-brk .`, then navigate to `chrome://inspect/#devices` and choose a Remote Target
 */

const randInt = require('random-int');
const calcCentersOfMass = require('./calc-centers-of-mass');

// grid factories
const grids = {
    random(cells, max) {
        const grid = [];
        for (y = 0; y < cells; y++) {
            grid[y] = [];
            for (x = 0; x < cells; x++) {
                grid[y][x] = randInt(0, max);
            }
        }
        return grid;
    },
    test01() {
        const grid = [];
        const cells = 7;

        for (y = 0; y < cells; y++) {
            grid[y] = [];
            for (x = 0; x < cells; x++) {
                grid[y][x] = 242;
            }
        }

        return grid;
    }
};

const threshold = 200;
const grid = grids.random(7, threshold + 60);

/**
 * This generator simplifies a state-safe context for interating the full-grid with stops & starts
 * 
 * @param {Int} min 
 * @param {Array} grid 
 * @param {Array} seen 
 */
const findNextGridCellAboveThreshold = function* (min, grid, seen) {
    for (const y in grid) {
        for (const x in grid[y]) {
            if (grid[y][x] > min && !seen.includes(x + '.' + y)) {
                seen.push(x + '.' + y);
                yield { x: +x, y: +y };
            }
        }
    }
}

const subRegions = [];
let srIdx = 0;
const seen = [];
const getAdjacentCellsMap = ({ x, y }) => [
    // right
    {
        x: x + 1,
        y
    },
    // down
    {
        x,
        y: y + 1
    },
    // offset-left
    {
        x: x - 1,
        y: y + 1
    },
    // offset-right
    {
        x: x + 1,
        y: y + 1
    }
];

/**
 * recursor for hunting down sub-regions of adjacent cells, each with a value above a threshold
 * 
 * @param {Array} xy 
 * @todo Y-Combinate/Memoize
 */
const findAdjacentCellsAboveThreshold = (xy) => {
    let token;
    for (test of getAdjacentCellsMap(xy)) {
        if (grid[test.y] && grid[test.y][test.x] && grid[test.y][test.x] > threshold) {
            token = test.x + '.' + test.y;
            if (!seen.includes(token)) {
                seen.push(token);
                subRegions[srIdx].push({ x: test.x, y: test.y, v: grid[test.y][test.x] });
                findAdjacentCellsAboveThreshold({ x: test.x, y: test.y });
            }
        }

    }
};

console.log('Processing Test Grid:\n', grid, '\n');

for (const xy of findNextGridCellAboveThreshold(threshold, grid, seen)) {
    subRegions[srIdx] = [{ ...xy, v: grid[xy.y][xy.x] }];
    findAdjacentCellsAboveThreshold(xy);
    srIdx += 1;
}

if (subRegions.length) {
    console.log('Sub-Regions Found: ', subRegions.length, '\n');
    const centersOfMass = calcCentersOfMass(subRegions);
    console.log('CoM (X, Y) Coordinate Points Reported:\n', centersOfMass);
}
