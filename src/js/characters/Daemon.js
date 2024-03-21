import Character from '../Character';

export default class Daemon extends Character {
  constructor(level, type = 'daemon') {
    super(level, type);
    this.attack = 10;
    this.defence = 10;
    this.moveRange = 1;
    this.attackRange = 4;
    if (this.level > 1){
      this.attack = Math.ceil(this.attack +  (this.attack*0.2)*level);
      this.defence = Math.ceil(this.defence*1.1 + (this.defence*0.1)*level);
      console.log('villian', this.attack)
    }
  }
}
