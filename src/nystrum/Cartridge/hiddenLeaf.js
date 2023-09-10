import {createCartridge} from './cartridge'
import Characters from '../Characters/index';
import Modes from '../Modes/index';
import { COLORS } from '../Modes/HiddenLeaf/theme';
import Title from '../Modes/HiddenLeaf/Screen/Title';
import CharacterSelect from '../Modes/HiddenLeaf/Screen/CharacterSelect';
import { SCREENS } from '../Screen/constants';

export const hiddenLeafCart = () => {
  return (
    createCartridge({
      modes: {The_Chunin_Exams: Modes.Chunin},
      characters: {
        Gaara: Characters.Gaara,
        Rock_Lee: Characters.Rock_Lee,
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