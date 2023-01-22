import {createCartridge} from './cartridge'
import Characters from '../Characters/index';
import Modes from '../Modes/index';
import { COLORS } from '../Modes/Jacinto/theme';
import { SCREENS } from '../Screen/constants';
import Title from '../Modes/Jacinto/Screen/Title';
import CharacterSelect from '../Screen/CharacterSelect';
import Level from '../Screen/Level';
import Win from '../Screen/Win';
import Lose from '../Screen/Lose';

export const jacintoCart = () => {
  return (
    createCartridge({
      modes: { Jacinto: Modes.Jacinto },
      characters: {
        The_Commander: Characters.The_Commander,
        The_Scout: Characters.The_Scout,
        The_Stranded: Characters.The_Stranded,
        The_Veteran: Characters.The_Veteran,
      },
      theme: COLORS,
      screens: {
        [SCREENS.TITLE]: {
          component: Title,
        },
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