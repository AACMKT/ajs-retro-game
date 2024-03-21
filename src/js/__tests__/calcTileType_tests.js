import { calcTileType } from '../utils';

test.each([
    [0, 10, 'top-left'],
    [9, 10, 'top-right'],
    [4, 10, 'top'],
    [90, 10, 'bottom-left'],
    [99, 10, 'bottom-right'],
    [94, 10, 'bottom'],
    [19, 10, 'right'],
    [40, 10, 'left'],
    [55, 10, 'center'],
    [0, 3, 'top-left'],
    [2, 3, 'top-right'],
    [1, 3, 'top'],
    [6, 3, 'bottom-left'],
    [8, 3, 'bottom-right'],
    [7, 3, 'bottom'],
    [5, 3, 'right'],
    [3, 3, 'left'],
    [4, 3, 'center'],
])('calcTitleType tests', (grid, size, response) => expect(calcTileType(grid, size)).toBe(response));
