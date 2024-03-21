import GamePlay from './GamePlay';
import PositionedCharacter from './PositionedCharacter';
import { generateTeam, findStartPoints } from './generators';
import { toolTipContent, getActionsRange } from './utils';
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.heroes = [Bowman, Swordsman, Magician];
    this.villains = [Daemon, Undead, Vampire];
    this.charsArray = [];
    this.focusedChar = NaN;
    this.playerTurn = true;
    this.cursorState = '';
    this.currentIndex = NaN;
    this.boardSize = this.gamePlay.boardSize;
  }

  init() {
    this.gamePlay.drawUi(this.gamePlay.gameState.background);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addModalResponselistener(this.modalResponse.bind(this));
    this.initiateCharacters();
  }

  saveGame() {
    this.gamePlay.gameState.positionedAdventures = this.charsArray;
    this.gamePlay.gameState.focusedChar = this.focusedChar;
    this.stateService.save(this.gamePlay.gameState);
  }

  loadGame() {
    let data = this.stateService.load();
    let adventures = this.heroes.concat(this.villains);
    data.positionedAdventures.forEach(char => {
      let level = char.character.level;
      let health = char.character.health;
      let attack = char.character.attack;
      let defence = char.character.defence;
      char.character = new (adventures.find(adv => (new adv).type == char.character.type));
      char.character.level = level;
      char.character.health = health;
      char.character.attack = attack;
      char.character.defence = defence;
    });
    this.gamePlay.drawUi(data.background);
    this.gamePlay.gameState.background = data.background;
    this.gamePlay.gameState.level = data.level;
    this.gamePlay.gameState.score = data.score;
    this.gamePlay.gameState.positionedAdventures = data.positionedAdventures;

    this.gamePlay.modal.classList.remove('modal_visibility');
    this.charsArray = [];
    this.charsArray = data.positionedAdventures;
    this.gamePlay.redrawPositions(this.charsArray);
    if (data.focusedChar && data.focusedChar != NaN){
      this.focusedChar = data.positionedAdventures.find(char => char.position == data.focusedChar.position);
      this.gamePlay.selectCell(this.focusedChar.position)
    }
    else {
      this.focusedChar = NaN
    }
    this.playerTurn = data.playerTurn;
  }

  newGame() {
    this.gamePlay.gameState.background = 'prairie';
    this.gamePlay.gameState.level = 1;
    this.gamePlay.gameState.score = 0;
    this.gamePlay.drawUi(this.gamePlay.gameState.background);
    this.gamePlay.modal.classList.remove('modal_visibility');
    this.charsArray = [];
    this.focusedChar = NaN;
    this.playerTurn = true;
    this.initiateCharacters();
  }

  modalResponse(event) {
    if (event.target.id == 'new-game') {
      this.gamePlay.modal.classList.remove('modal_visibility');
      while (this.gamePlay.modal.firstChild) {
        this.gamePlay.modal.firstChild.remove();
      }
    }
    else if (event.target.id == 'continue-game') {
      this.heroesLevelUp();
      this.initiateCharacters(1 + this.gamePlay.gameState.level);
      this.playerTurn = true;
      this.gamePlay.modal.remove('modal_visibility');
      while (this.gamePlay.modal.firstChild) {
        this.gamePlay.modal.firstChild.remove();
      }
    }
    else if (event.target.id == 'load-game') {
      this.loadGame();
    }
  }

  isHero(adventure) {
    let isHero = false
    this.heroes.forEach(char => {
      if(adventure instanceof char) {
        isHero = true;
      }
    });
    return isHero
  }

  isSelected() {
    let isSelected = false
    this.gamePlay.cells.forEach(cell => {if (cell.classList.contains('selected')){
      isSelected = true;
    }});
    return isSelected;
  }

  /*getActionsRange(flag, char = this.focusedChar) {
    if (this.focusedChar) {
      let index = char.position;
      let range = 0;
      let board = this.gamePlay.boardSize
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
  }*/

  getPositionedVillians() {
    let positionedVillians = [];
    this.charsArray.forEach(char => {
      if (this.villains.find(villian => char.character instanceof villian)) {
        positionedVillians.push(char)
      } 
    });
    return positionedVillians
  }

  getPositionedHeroes() {
    let positionedHeroes = [];
    this.charsArray.forEach(char => {
      if (this.heroes.find(hero => char.character instanceof hero)) {
        positionedHeroes.push(char)
      } 
    });
    return positionedHeroes
  }
  

  villainCoreLogic() {
    if (this.getPositionedVillians().length > 0) {
      let priorToMove = 'undead'
      let positionedHeroes = this.getPositionedHeroes();
      let positionedVillians = this.getPositionedVillians();
      let inBattleContact = [];

      positionedVillians.forEach(villian => {
        if (villian.character.health > 0) {
          let heroesUnderAttack = []
          positionedHeroes.forEach(hero => {
            if (getActionsRange('attack', villian, this.boardSize).includes(hero.position)) {
              heroesUnderAttack.push(hero);
            }
            if (heroesUnderAttack.length > 0) {
              inBattleContact.push({'villian': villian, 'heroes': heroesUnderAttack})
            }
          })
        }

      });
      if (inBattleContact.length > 0) {
        this.villianAttack(inBattleContact)
      }
      else {
        let randomIndex = Math.floor(Math.random() * positionedVillians.length)
        let villian = positionedVillians.find(villian => villian.character.type == priorToMove)
        villian = villian ? villian : positionedVillians[randomIndex];
        this.villianMove(villian)
      }
      this.playerTurn = true;
    } 
  }

  villianMove(villian) {
    let heroesPositions = this.getPositionedHeroes().map(hero => hero.position);
    let charactersPositions = this.charsArray.map(char => char.position);
    let villianPosition = villian.position;
    let villianMoveRange = getActionsRange('move', villian, this.boardSize).filter(el => !charactersPositions.includes(el));
    if ((getActionsRange('attack', villian, this.boardSize).length > 9)) {
      let safetyRange = [];
      heroesPositions.forEach(position => {
        let range = getActionsRange('attack', {character: new Swordsman(1), position: position}, this.boardSize);
        safetyRange = safetyRange.concat(range);
      });
      villianMoveRange = villianMoveRange.filter(el => !safetyRange.includes(el))
    }
    let closestRight = Math.min(...(heroesPositions.filter(v => v >= villianPosition)));
    closestRight = closestRight != ('Infinity') ? closestRight : 0; 
    let closestLeft = Math.max(...(heroesPositions.filter(v => v <= villianPosition)));
    closestLeft = closestLeft !=  -'Infinity' ? closestLeft : 0; 
    let closestHeroIndex =  closestRight <= closestLeft ? closestLeft : closestRight;
    let closestRightInMoveRange = Math.min(...(villianMoveRange.filter(v => v >= closestHeroIndex)));
    closestRightInMoveRange = closestRightInMoveRange != 'Infinity' ? closestRightInMoveRange : 0; 
    let closestLeftInMoveRange = Math.max(...(villianMoveRange.filter(v => v <= closestHeroIndex)));
    closestLeftInMoveRange = closestLeftInMoveRange !=  -'Infinity' ? closestLeftInMoveRange : 0; 
    let closestInMoveRange = closestRightInMoveRange <= closestLeftInMoveRange ? closestLeftInMoveRange : closestRightInMoveRange;
    this.charsArray.splice(this.charsArray.indexOf(villian), 1);
    this.gamePlay.deselectCell(villian.position);
    villian.position = closestInMoveRange;

    this.charsArray.push(villian);
    this.gamePlay.redrawPositions(this.charsArray);
  }

  villianAttack(inBattleContact) {
    let duelists = (inBattleContact.toSorted((a, b) => a.villian.character.attack - b.villian.character.attack)).at(-1);
    let randomHeroIndex = Math.floor(Math.random() * duelists.heroes.length);
    let attackedHero = duelists.heroes[randomHeroIndex];
    let villian = duelists.villian
    let damage = Math.round(Math.max(villian.character.attack - attackedHero.character.defence, villian.character.attack * 0.1));
    attackedHero.character.health -= damage;
    let heroPosition = attackedHero.position;
    this.gamePlay.showDamage(heroPosition, damage).then(() => {this.gamePlay.redrawPositions(this.charsArray)});
    if (attackedHero.character.health <= 0) {
      if (this.focusedChar.position == attackedHero.position) {
        this.focusedChar = NaN;
      }
      this.gamePlay.deselectCell(attackedHero.position);
      this.gamePlay.setCursor('pointer');
      this.charsArray = this.charsArray.filter(char => char.position != attackedHero.position);
      this.gamePlay.redrawPositions(this.charsArray)
      }
         
  }

  heroAction(index){
    if (this.getPositionedHeroes().length > 0) {
      let target = this.gamePlay.cells[index];
      if (this.isSelected()) {
        if (!target.hasChildNodes()){
          if (getActionsRange('move', this.focusedChar, this.boardSize).includes(index)) {
            this.playerTurn = false;
            this.charsArray.splice(this.charsArray.indexOf(this.focusedChar), 1);
            this.gamePlay.deselectCell(this.focusedChar.position);
            this.focusedChar.position = index;
            this.charsArray.push(this.focusedChar);
            this.gamePlay.redrawPositions(this.charsArray);
            this.gamePlay.selectCell(index);
            
          } 
        }
        else {
          let villain = this.charsArray.find((char) => char.position == index);
          let hero = this.focusedChar.character;
          if (hero != NaN) {
            if (!this.isHero(villain.character) && getActionsRange('attack', this.focusedChar, this.boardSize).includes(index)) {
              this.playerTurn = false;
              let damage = Math.round(Math.max(hero.attack - villain.character.defence, hero.attack * 0.1));
              villain.character.health -= damage;
              this.gamePlay.gameState.score += damage;
              this.gamePlay.showDamage(index, damage).then(() => {this.gamePlay.redrawPositions(this.charsArray)})
              if (villain.character.health <= 0) {
                this.charsArray = this.charsArray.filter(char => char.position != villain.position);
                this.gamePlay.deselectCell(villain.position);
                this.gamePlay.redrawPositions(this.charsArray);
              };
            }
          }

        }
      }
    }
  }

  heroesLevelUp() {
    this.charsArray.forEach(hero => {
      let attackFactor = hero.character.health > 50 ? 110 : 80 + hero.character.health
      hero.character.attack = Math.ceil(Math.max(hero.character.attack, hero.character.attack * (attackFactor) / 100))
      if (hero.character.health + 80 < 100) {
        hero.character.health += 80;
      }
      else {
        hero.character.health = 100;
      }
      hero.character.level += 1;
    })

  }

  villiansResponce() {
    if (!this.playerTurn && this.getPositionedVillians().length > 0) {
      this.gamePlay.setCursor('not-allowed');
      setTimeout(() => {this.villainCoreLogic();
        this.gamePlay.setCursor(this.cursorState);
        this.gamePlay.cells.forEach(cell => {if (!cell.classList.contains('selected-yellow')) {
          this.gamePlay.deselectCell(this.gamePlay.cells.indexOf(cell))
          }
        });
        this.onCellEnter(this.currentIndex);
      }, 1000);
      
    }

  }

  onCellClick(index) {
    if (this.playerTurn) {
      let target = this.gamePlay.cells[index];
      if (target.hasChildNodes()) {
        let adventure = this.charsArray.find((char) => char.position == index);
        if (this.isHero(adventure.character)) {
          this.charsArray.forEach(char => this.gamePlay.deselectCell(char.position));
          this.gamePlay.selectCell(index);
          this.focusedChar = adventure;
        }
        else {
          if (!this.isSelected()){
            let errMsg = "You can't control enemy characters"
            GamePlay.showError(errMsg);
          }
        }
      }
      this.heroAction(index);
      this.villiansResponce();
      if ((this.getPositionedVillians()).length == 0) {
        if (this.focusedChar != NaN && this.currentIndex != NaN) {
          this.gamePlay.selectCell(this.currentIndex, 'green');
          this.gamePlay.setCursor('pointer');
        }
        this.gamePlay.gameState.level += 1;
        let background = this.gamePlay.gameState.updateBackground(this.gamePlay.gameState.background);
        this.focusedChar = NaN;
        setTimeout(() => this.gamePlay.drawUi(background), 1200);
      }
    }
  }

  onCellEnter(index) {
    this.currentIndex = index;
    if (this.playerTurn) {
      this.gamePlay.setCursor('pointer');
      }
    this.cursorState = 'pointer';
    let target = this.gamePlay.cells[index];
    if (target.hasChildNodes()) {
      let adventure = this.charsArray.find((char) => char.position == index);
      this.gamePlay.showCellTooltip(toolTipContent(adventure.character), index);
      if (this.isSelected()) {
        if (!this.isHero(adventure.character)){
          if (getActionsRange('attack', this.focusedChar, this.boardSize).includes(index)) {

            this.getPositionedVillians().forEach(villian => this.gamePlay.deselectCell(villian.position));
            this.gamePlay.setCursor('crosshair');
            this.gamePlay.selectCell(index, 'red');

            this.cursorState = 'crosshair';
          } 
          else {
            this.gamePlay.setCursor('not-allowed');
          }
        }
    
      }
    }
    else {
      if (this.isSelected() && this.focusedChar.position != index && this.playerTurn){
        if (getActionsRange('move', this.focusedChar, this.boardSize).includes(index)){
            this.gamePlay.selectCell(index, 'green')
        }
        else {
          this.gamePlay.setCursor('not-allowed');
        }
      }
    }
    }

  onCellLeave(index) {
    if (this.playerTurn) {
      let target = this.gamePlay.cells[index];
      if (target.hasChildNodes()){
        this.gamePlay.hideCellTooltip(index)
      }
    if (index != this.focusedChar.position) {
      this.gamePlay.deselectCell(index);
    }
    }
  }

  initiateCharacters(numberOfChars = 3) {
    let heroes = [];
    let numberOfVillains = numberOfChars;
    if (this.gamePlay.gameState.level > 1 && this.charsArray.length > 0) {
      let number = this.charsArray.length <= numberOfChars ? numberOfChars - this.charsArray.length : this.charsArray.length
      heroes = generateTeam(this.heroes, 1, number);
      let leveledUpHeroes = this.charsArray.map(hero => hero.character);
      leveledUpHeroes.forEach(hero => heroes.characters.push(hero));
      numberOfVillains = numberOfChars + 1
    }
    else {
      heroes = generateTeam(this.heroes, this.gamePlay.gameState.level, numberOfChars);
    }
    this.charsArray = [];
    let villains = generateTeam(this.villains, this.gamePlay.gameState.level, numberOfVillains);
    let herosCell = findStartPoints('heroes', numberOfChars);
    let villainsCell = findStartPoints('villains', numberOfVillains);
    heroes.characters.forEach(char => {
      this.charsArray.push(new PositionedCharacter(char, herosCell.next().value))
    });
    villains.characters.forEach(char => {
      this.charsArray.push(new PositionedCharacter(char, villainsCell.next().value))
    });
    this.gamePlay.redrawPositions(this.charsArray)
  }
}
