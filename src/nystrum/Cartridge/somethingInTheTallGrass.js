import {createCartridge} from './cartridge'
import Modes from '../Modes/index';
import { COLORS } from '../Modes/TallGrass/theme';
import { SCREENS } from '../Screen/constants';
import CharacterSelect from '../Modes/TallGrass/Screen/CharacterSelect';
import Level from '../Screen/Level';
import Win from '../Modes/TallGrass/Screen/Win';
import Lose from '../Modes/TallGrass/Screen/Lose';
import SomeoneInTheTallGrass from '../Modes/TallGrass/Characters/SomeoneInTheTallGrass';

export const somethingInTheTallGrassCart = () => {
  return (
    createCartridge({
      name: 'Something In The Tall Grass',
      modes: { Something_In_The_Tall_Grass: Modes.SomethingInTheTallGrass },
      characters: {Someone: SomeoneInTheTallGrass},
      theme: COLORS,
      screens: {
        [SCREENS.CHARACTER_SELECT]: {
          component: CharacterSelect,
        },
        [SCREENS.LEVEL]: {
          component: Level,
        },
        [SCREENS.WIN]: {
          component: Win,
        },
        [SCREENS.LOSE]: {
          component: Lose,
        },
      }
    })
  )
}