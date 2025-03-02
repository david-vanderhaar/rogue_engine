import {createCartridge} from './cartridge'
import Modes from '../Modes/index';
import { COLORS } from '../Modes/Normandy/theme';
import Title from '../Modes/Normandy/Screen/Title';
import Win from '../Modes/Normandy/Screen/Win';
import Lose from '../Modes/Normandy/Screen/Lose';
import Level from '../Modes/Normandy/Screen/Level';
import CharacterSelect from '../Modes/Normandy/Screen/CharacterSelect';
import Tournament from '../Modes/Normandy/Screen/Tournament';
import { SCREENS } from '../Modes/Normandy/Screen/constants';
import SomeoneInTheTallGrass from '../Modes/Normandy/Characters/SomeoneInTheTallGrass';
import AnotherInTheTallGrass from '../Modes/Normandy/Characters/AnotherInTheTallGrass';

export const normandyCart = () => {
  return (
    createCartridge({
      modes: { The_War: Modes.Normandy, },
      characters: {
        SomeoneInTheTallGrass: SomeoneInTheTallGrass(),
        AnotherInTheTallGrass: AnotherInTheTallGrass(),
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