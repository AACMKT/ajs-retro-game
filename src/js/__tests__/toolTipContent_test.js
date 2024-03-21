import { toolTipContent } from "../utils";
import characters from '../characters';

test.each(characters)("toolTip message correctness tests", (Char)=>{
    let level = Math.floor(Math.random() * 4) + 1;
    let char = new Char(level)
    let attack =  char.attack;
    let defence =  char.defence;
    let health = char.health;
    expect(toolTipContent(char)).toBe(`🎖${level} ⚔${attack} 🛡${defence} ❤${health}`)
});