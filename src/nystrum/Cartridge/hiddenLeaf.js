import {createCartridge} from './cartridge'
import Modes from '../Modes/index';
import { COLORS } from '../Modes/HiddenLeaf/theme';
import Title from '../Modes/HiddenLeaf/Screen/Title';
import CharacterSelect from '../Modes/HiddenLeaf/Screen/CharacterSelect';
import { SCREENS } from '../Screen/constants';
import RockLee from '../Characters/RockLee';
import Gaara from '../Characters/Gaara';

export const hiddenLeafCart = () => {
  return (
    createCartridge({
      modes: {The_Chunin_Exams: Modes.Chunin},
      characters: {
        Gaara: Gaara(),
        Rock_Lee: RockLee(),
      },
      theme: COLORS,
      screens: {
        [SCREENS.TITLE]: {
          component: Title,
        },
        [SCREENS.CHARACTER_SELECT]: {
          component: CharacterSelect,
        },
      }
    })
  )
}