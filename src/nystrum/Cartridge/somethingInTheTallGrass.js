import {createCartridge} from './cartridge'
import Characters from '../Characters/index';
import Modes from '../Modes/index';
import { COLORS } from '../Modes/Jacinto/theme';
import { SCREENS } from '../Screen/constants';
import CharacterSelect from '../Screen/CharacterSelect';
import Level from '../Screen/Level';
import Win from '../Screen/Win';
import Lose from '../Screen/Lose';
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