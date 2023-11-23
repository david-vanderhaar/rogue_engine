import {createCartridge} from './cartridge'
import Modes from '../Modes/index';
import { COLORS } from '../Modes/HiddenLeaf/theme';
import Title from '../Modes/HiddenLeaf/Screen/Title';
import Win from '../Modes/HiddenLeaf/Screen/Win';
import Lose from '../Modes/HiddenLeaf/Screen/Lose';
import Level from '../Modes/HiddenLeaf/Screen/Level';
import CharacterSelect from '../Modes/HiddenLeaf/Screen/CharacterSelect';
import Tournament from '../Modes/HiddenLeaf/Screen/Tournament';
import { SCREENS } from '../Modes/HiddenLeaf/Screen/constants';
import RockLee from '../Characters/RockLee';
import Gaara from '../Characters/Gaara';
import Sasuke from '../Characters/Sasuke';

export const hiddenLeafCart = () => {
  return (
    createCartridge({
      modes: {The_Chunin_Exams: Modes.Chunin},
      characters: {
        Gaara: Gaara(),
        Rock_Lee: RockLee(),
        Sasuke: Sasuke(),
      },
      theme: COLORS,
      screens: {
        [SCREENS.TITLE]: {
          component: Title,
        },
        [SCREENS.WIN]: {
          component: Win,
        },
        [SCREENS.LOSE]: {
          component: Lose,
        },
        [SCREENS.LEVEL]: {
          component: Level,
        },
        [SCREENS.CHARACTER_SELECT]: {
          component: CharacterSelect,
        },
        [SCREENS.TOURNAMENT]: {
          component: Tournament,
        },
      }
    })
  )
}