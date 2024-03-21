import Bowman from './Bowman';
import Daemon from './Daemon';
import Magician from './Magician';
import Swordsman from './Swordsman';
import Undead from './Undead';
import Vampire from './Vampire';

export default [
    Bowman,
    Daemon,
    Magician,
    Swordsman,
    Undead,
    Vampire
];

export const charAttributes =  [
    ['bowman', Bowman, 25, 25],
    ['daemon', Daemon, 10, 10],
    ['magician', Magician, 10, 40],
    ['swordsman', Swordsman, 40, 10],
    ['undead', Undead, 40, 10],
    ['vampire', Vampire, 25, 25]
]