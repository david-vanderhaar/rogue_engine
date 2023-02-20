import {createCartridge} from './cartridge'
import Characters from '../Characters/index';
import Modes from '../Modes/index';
import { COLORS } from '../Modes/Jacinto/theme';
import { SCREENS } from '../Screen/constants';
import CharacterSelect from '../Screen/CharacterSelect';
import Level from '../Screen/Level';
import Win from '../Screen/Win';
import Lose from '../Screen/Lose';
import Neo from '../Modes/Development/Characters/Neo'

export const developmentCart = () => {
  return (
    createCartridge({
      modes: { Development: Modes.Development },
      characters: {Neo},
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