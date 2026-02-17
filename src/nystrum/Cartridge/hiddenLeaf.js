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
import RockLee from '../Modes/HiddenLeaf/Characters/RockLee';
import Gaara from '../Modes/HiddenLeaf/Characters/Gaara';
import Sasuke from '../Modes/HiddenLeaf/Characters/Sasuke';
import Naruto from '../Modes/HiddenLeaf/Characters/Naruto';
import Tenten from '../Modes/HiddenLeaf/Characters/Tenten';
import Temari from '../Modes/HiddenLeaf/Characters/Temari';
import Shino from '../Modes/HiddenLeaf/Characters/Shino';
import Kiba from '../Modes/HiddenLeaf/Characters/Kiba';
import Neji from '../Modes/HiddenLeaf/Characters/Neji';
import Shikamaru from '../Modes/HiddenLeaf/Characters/Shikamaru';

export const hiddenLeafCart = () => {
  return (
    createCartridge({
      modes: {The_Chunin_Exams: Modes.Chunin},
      characters: {
        Rock_Lee: RockLee(),
        Sasuke: Sasuke(),
        Gaara: Gaara(),
        Shino: Shino(),
        Neji: Neji(),
        Shikamaru: Shikamaru(),
        Kiba: Kiba(),
        Naruto: Naruto(),
        Tenten: Tenten(),
        Temari: Temari(),
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
        // [SCREENS.OVERWORLD]: {
        //   component: Level,
        // },
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