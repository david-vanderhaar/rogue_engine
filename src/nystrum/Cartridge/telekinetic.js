import {createCartridge} from './cartridge'
import Modes from '../Modes/index';
import { COLORS } from '../Modes/Telekinetic/theme';
import Title from '../Modes/Telekinetic/Screen/Title';
import Win from '../Modes/Telekinetic/Screen/Win';
import Lose from '../Modes/Telekinetic/Screen/Lose';
import Level from '../Modes/Telekinetic/Screen/Level';
import AbilitySelect from '../Modes/Telekinetic/Screen/AbilitySelect';
import Tournament from '../Modes/Telekinetic/Screen/Tournament';
import { SCREENS } from '../Modes/Telekinetic/Screen/constants';
import Patient40 from '../Modes/Telekinetic/Characters/Patient40';
import Intro from '../Modes/Telekinetic/Screen/Intro';

export const telekineticCart = () => {
  return (
    createCartridge({
      modes: {Telekinetic: Modes.Telekinetic},
      characters: {
        Patient_40: Patient40(),
      },
      theme: COLORS,
      screens: {
        [SCREENS.TITLE]: {
          component: Title,
        },
        [SCREENS.INTRO_MOVIE]: {
          component: Intro,
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
        [SCREENS.ABILITY_SELECT]: {
          component: AbilitySelect,
        },
        [SCREENS.LEVEL_PROGRESS]: {
          component: Tournament,
        },
      }
    })
  )
}