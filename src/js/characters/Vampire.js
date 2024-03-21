import Character from '../Character';

export default class Vampire extends Character {
  constructor(level, type = 'vampire') {
    super(level, type);
    this.attack = 25;
    this.defence = 25;
    this.moveRange = 2;
    this.attackRange = 2;
    if (this.level > 1){
      this.attack = Math.ceil(this.attack +  (this.attack*0.2)*level);
      this.defence = Math.ceil(this.defence*1.1 + (this.defence*0.1)*level);
      console.log('villian', this.attack)
    }
  }
}
