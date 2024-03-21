import Character from '../Character';
import characters from '../characters';
import { charAttributes } from '../characters';
import { characterGenerator, generateTeam } from '../generators';

test("Character parent class error response on creation test", ()=>{
    expect(() => {return new Character(1)}).toThrowError('Only defined characters are allowed');
});

test.each(characters)("Character сhild classes successful creation tests", (char)=>{
    expect(() => {return new char(1)}).not.toThrowError();
});

test.each(charAttributes)("Character %s proper attributes creation tests", (_, char, attack, defence) => {
    let adventure = new char(1);
    expect([adventure.attack, adventure.defence]).toEqual([attack, defence]);
})

test("CharacterGenerator test", ()=>{
    for (let i = 0; i < characters.length; i++){
        expect(characterGenerator(characters, 1).next().value).toBeInstanceOf(Character);
    }
});

test("generateTeam method tests", () => {
    let team = generateTeam(characters, 4, 4).characters;
    for (let i = 0; i < team.length; i++) {
        let level = team[i].level;
        console.log(level)
        expect([team.length, true]).toEqual([4, level < 4 && level > 0]);
    }
})