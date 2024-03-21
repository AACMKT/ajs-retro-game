import Team from './Team'
/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  let randomIndex = Math.floor(Math.random() * allowedTypes.length);
  let level = Math.round(Math.random() * (maxLevel - 1)) + 1;
  yield new allowedTypes[randomIndex](level)

}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  let characters = []
  for (let i=0; i < characterCount; i++) {
    characters.push(characterGenerator(allowedTypes, maxLevel).next().value)
  }
  return new Team(characters);
}

export function* findStartPoints(team, number) {
  const board = document.querySelector('.board, .prairie');
  const boardSize = Math.sqrt(board.children.length);
  let startCells =  [];
  
    if (team == 'heroes') {
      for (let i = 0; i < boardSize; i++) {
        startCells.push(i*boardSize + Math.round(Math.random()));
      }
    }
    else {
      for (let i = 0; i < boardSize; i++) {
        startCells.push(i*boardSize + (boardSize - 1) - Math.round(Math.random()));
      }
    }

  startCells = startCells.sort(() => Math.random() - 0.5);
  startCells = startCells.slice(0, number)
  for (let index = 0; index < startCells.length; index ++) {
    yield startCells.slice(index, index + 1)[0];
  }
}

