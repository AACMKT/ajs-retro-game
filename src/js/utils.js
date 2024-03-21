/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  const topLeft = 0;
  const topRight = boardSize - 1;
  const bottomRight = Math.pow(boardSize, 2) - 1;
  const bottomLeft = (Math.pow(boardSize, 2) - boardSize)
  if (index == topLeft) {
    return 'top-left';
  }
  if (index > topLeft && index < topRight) {
    return 'top'
  }
  if (index == topRight) {
    return 'top-right'
  }
  if ((index + 1 )% (boardSize) == 0 && index > topRight && index < bottomRight) {
    return 'right'
  }
  if (index == bottomRight) {
    return 'bottom-right'
  }
  if (index > bottomLeft && index < bottomRight) {
    return 'bottom'
  }
  if (index == bottomLeft) {
    return 'bottom-left';
  }
  if (index % (boardSize) == 0 && index > topLeft && index < bottomLeft) {
    return 'left';
  }
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function toolTipContent(adventure) {
  let level = adventure.level;
  let attack =  adventure.attack;
  let defence =  adventure.defence;
  let health = adventure.health;
  return `\u{1F396}` + `${level} ` + `\u{2694}` + `${attack} ` + `\u{1F6E1}` + `${defence} ` + `\u{2764}` + `${health}`

}

export function getActionsRange(flag, char, boardSize) {
  if (char != NaN) {
    let index = char.position;
    let range = 0;
    let board = boardSize
    if (flag == 'move'){
      range = char.character.moveRange;
    }
    else if (flag == 'attack') {
      range = char.character.attackRange;
    }
    else {
      throw new SyntaxError('Choose proper action flag (move or attack)!')
    }
    let cellsToAct = [];
    for (let i = 0; i < board; i += 1){
      let currentRow = [];
      let row = i*8
      for (let cell = 0 + row; cell < 8 + row; cell += 1) {
        currentRow.push(cell);
      }
      cellsToAct.push(currentRow);
    }
    let charRowIndex = cellsToAct.findIndex(row => row.includes(index));
    let charInRowIndex = (cellsToAct.filter(row => row.includes(index)).flat()).indexOf(index);
    let startRow = charRowIndex < range ? 0 : charRowIndex - range;
    if (board - charRowIndex - 1 > range){
      let endRow = startRow == 0 ? charRowIndex + range + 1 : 2*range + 1;
      cellsToAct = cellsToAct.splice(startRow, endRow)
    }
    else {
      cellsToAct = cellsToAct.splice(startRow)
    }
    let startCell = charInRowIndex - range > 0 ? charInRowIndex - range : 0;
    if (board - charInRowIndex - 1 > range){
      let endCell = startCell == 0 ? charInRowIndex + range + 1 : 2*range + 1;
      cellsToAct.forEach((r, i) => {cellsToAct[i] = r.splice(startCell, endCell)});
    }
    else {
      cellsToAct.forEach((r, i) => {cellsToAct[i] = r.splice(startCell)});
    }
    return cellsToAct.flat()
  }
  else {
    return []
  }
}
