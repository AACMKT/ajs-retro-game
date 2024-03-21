import Character from '../Character';

export default class Undead extends Character {
  constructor(level, type = 'undead') {
    super(level, type);
    this.attack = 40;
    this.defence = 10;
    this.moveRange = 4;
    this.attackRange = 1;
    if (this.level > 1){
      this.attack = Math.ceil(this.attack +  (this.attack*0.2)*level);
      this.defence = Math.ceil(this.defence*1.1 + (this.defence*0.1)*level);
    }
  }
}
