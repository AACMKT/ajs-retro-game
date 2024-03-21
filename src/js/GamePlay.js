import { calcHealthLevel, calcTileType } from './utils';
import GameState from './GameState';

export default class GamePlay {
  constructor() {
    this.boardSize = 8;
    this.container = null;
    this.boardEl = null;
    this.cells = [];
    this.cellClickListeners = [];
    this.cellEnterListeners = [];
    this.cellLeaveListeners = [];
    this.newGameListeners = [];
    this.saveGameListeners = [];
    this.loadGameListeners = [];
    this.modalListeners = [];
    this.modal = null;
    this.gameState = new GameState;
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  /**
   * Draws boardEl with specific theme
   *
   * @param theme
   */
  drawUi(theme) {
    this.checkBinding();
    this.container.innerHTML = `
      <div class="modal"></div>
      <div class="controls">
        <button data-id="action-restart" class="btn">New Game</button>
        <button data-id="action-save" class="btn">Save Game</button>
        <button data-id="action-load" class="btn">Load Game</button>
      </div>
      <div>
        <p class="hight-score">Score: ${this.gameState.score}</p>
      </div>
      <div class="board-container">
        <div data-id="board" class="board"></div>
      </div>
    `;
    this.modal =  this.container.querySelector('.modal');
    this.showModal(this.gameState.level);
    this.newGameEl = this.container.querySelector('[data-id=action-restart]');
    this.saveGameEl = this.container.querySelector('[data-id=action-save]');
    this.loadGameEl = this.container.querySelector('[data-id=action-load]');

    this.newGameEl.addEventListener('click', event => this.onNewGameClick(event));
    this.saveGameEl.addEventListener('click', event => this.onSaveGameClick(event));
    this.loadGameEl.addEventListener('click', event => this.onLoadGameClick(event));
    this.modal.addEventListener('click', event => {this.modalResponse(event)});
    this.boardEl = this.container.querySelector('[data-id=board]');

    this.boardEl.classList.add(theme);
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
      cellEl.addEventListener('mouseenter', event => this.onCellEnter(event));
      cellEl.addEventListener('mouseleave', event => this.onCellLeave(event));
      cellEl.addEventListener('click', event => this.onCellClick(event));
      this.boardEl.appendChild(cellEl);
    }

    this.cells = Array.from(this.boardEl.children);
  }

  /**
   * Draws positions (with chars) on boardEl
   *
   * @param positions array of PositionedCharacter objects
   */
  redrawPositions(positions) {
    let score = this.container.querySelector('.hight-score');
    score.innerHTML = `Score: ${this.gameState.score}`
    for (const cell of this.cells) {
      cell.innerHTML = '';
    }

    for (const position of positions) {
      const cellEl = this.boardEl.children[position.position];
      const charEl = document.createElement('div');
      charEl.classList.add('character', position.character.type);
      if (position.character.level > 1) {
        const charGlow = document.createElement('div');
        charGlow.classList.add('glowing-circle');
        let glowIntensity = 0.25*position.character.level < 1 ? 0.3*position.character.level : 1;
        charGlow.style.opacity = glowIntensity;
        cellEl.appendChild(charGlow);
      }

      const healthEl = document.createElement('div');
      healthEl.classList.add('health-level');

      const healthIndicatorEl = document.createElement('div');
      healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${calcHealthLevel(position.character.health)}`);
      healthIndicatorEl.style.width = `${position.character.health}%`;
      healthEl.appendChild(healthIndicatorEl);

      charEl.appendChild(healthEl);
      cellEl.appendChild(charEl);

    }
  }

  showModal(level) {
    let mode = 'welcome'
    if (this.gameState.level > 1) {
      mode = 'continue';
    }
    let modalBox = document.createElement('div');
    this.modal.classList.add('modal_visibility')
    modalBox.classList.add('modal__box');
    let textBox = document.createElement('h1');
    let button = document.createElement('button');
    button.type="button";
    if (mode == 'welcome'){
      textBox.textContent = "Retro Game";
      button.type="button";
      button.id = 'new-game'
      button.innerHTML = "New Game"
    }
    else if (mode == 'continue') {
      textBox.textContent = `Level ${level - 1} complited`;
      button.id = 'continue-game'
      button.innerHTML = "Continue"
    }
    else {
      console.log('mode should be "welcome" or "continue"');
      button.type="button";
      button.id = 'new-game'
      button.innerHTML = "New Game"
    }
    button.classList.add('modal_button');
    modalBox.appendChild(textBox);
    modalBox.appendChild(button);
    if (localStorage.length > 0) {
      let loadButton = document.createElement('button');
      loadButton.type="button";
      loadButton.id = 'load-game';
      loadButton.innerHTML = "Load";
      loadButton.classList.add('modal_button');
      loadButton.classList.add('load_button');
      modalBox.appendChild(loadButton);
    }

    this.modal.appendChild(modalBox);
  }

    /**
   * Add listener to module buttons click
   *
   * @param callback
   */
  addModalResponselistener(callback) {
    this.modalListeners.push(callback);
  }

  /**
   * Add listener to mouse enter for cell
   *
   * @param callback
   */
  addCellEnterListener(callback) {
    this.cellEnterListeners.push(callback);
  }

  /**
   * Add listener to mouse leave for cell
   *
   * @param callback
   */
  addCellLeaveListener(callback) {
    this.cellLeaveListeners.push(callback);
  }

  /**
   * Add listener to mouse click for cell
   *
   * @param callback
   */
  addCellClickListener(callback) {
    this.cellClickListeners.push(callback);
  }

  /**
   * Add listener to "New Game" button click
   *
   * @param callback
   */
  addNewGameListener(callback) {
    this.newGameListeners.push(callback);
  }

  /**
   * Add listener to "Save Game" button click
   *
   * @param callback
   */
  addSaveGameListener(callback) {
    this.saveGameListeners.push(callback);
  }

  /**
   * Add listener to "Load Game" button click
   *
   * @param callback
   */
  addLoadGameListener(callback) {
    this.loadGameListeners.push(callback);
  }

  modalResponse(event) {
    event.preventDefault();
    this.modalListeners.forEach(o => o.call(null, event));
  }

  onCellEnter(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellEnterListeners.forEach(o => o.call(null, index));
  }

  onCellLeave(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellLeaveListeners.forEach(o => o.call(null, index));
  }

  onCellClick(event) {
    const index = this.cells.indexOf(event.currentTarget);
    this.cellClickListeners.forEach(o => o.call(null, index));
  }

  onNewGameClick(event) {
    event.preventDefault();
    this.newGameListeners.forEach(o => o.call(null));
  }

  onSaveGameClick(event) {
    event.preventDefault();
    this.saveGameListeners.forEach(o => o.call(null));
  }

  onLoadGameClick(event) {
    event.preventDefault();
    this.loadGameListeners.forEach(o => o.call(null));
  }

  static showError(message) {
    alert(message);
  }

  static showMessage(message) {
    alert(message);
  }

  selectCell(index, color = 'yellow') {
    this.deselectCell(index);
    this.cells[index].classList.add('selected', `selected-${color}`);
  }

  deselectCell(index) {
    const cell = this.cells[index];
    cell.classList.remove(...Array.from(cell.classList)
      .filter(o => o.startsWith('selected')));
  }

  showCellTooltip(message, index) {
    this.cells[index].title = message;
  }

  hideCellTooltip(index) {
    this.cells[index].title = '';
  }
  
  showDamage(index, damage) {
    return new Promise((resolve) => {
      const cell = this.cells[index];
      const damageEl = document.createElement('span');
      damageEl.textContent = damage;
      damageEl.classList.add('damage');
      cell.appendChild(damageEl);
      damageEl.addEventListener('animationend', () => {
        cell.removeChild(damageEl);
        resolve();
      });
    });
  }

  setCursor(cursor) {
    this.boardEl.style.cursor = cursor;
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay not bind to DOM');
    }
  }
}
