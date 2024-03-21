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
