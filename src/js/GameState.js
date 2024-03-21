export default class GameState {
  constructor() {
    this.level = 1;
    this.positionedAdventures = [];
    this.focusedChar = null;
    this.background = 'prairie';
    this.score = 0;
  }

  static from(object) {
    if(localStorage.state) {
      this.background = object.background;
      this.heroesTeam = object.heroesTeam;
    }
    else {
      throw new Error('Faild to load state')
    }
    // TODO: create object
    return null;
  }

  updateBackground(background) {
    const backgrounds = ['prairie', 'desert', 'arctic', 'mountain'];
    if (backgrounds.includes(background)) {
      let index = backgrounds.indexOf(background);
      if (index + 1 < backgrounds.length) {
        index += 1
      }
      else {
        index = 0;
      }
      this.background = backgrounds[index]
    }
    return this.background
  }
}
