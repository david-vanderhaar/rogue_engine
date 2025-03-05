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
import TheRifleman from '../Modes/Normandy/Characters/TheRifleman';
import TheMedic from '../Modes/Normandy/Characters/TheMedic';
import TheEngineer from '../Modes/Normandy/Characters/TheEngineer';
import TheMachineGunner from '../Modes/Normandy/Characters/TheMachineGunner';

export const normandyCart = () => {
  return (
    createCartridge({
      modes: { The_War: Modes.Normandy, },
      characters: {
        TheRifleman: TheRifleman(),
        TheMedic: TheMedic(),
        TheEngineer: TheEngineer(),
        TheMachineGunner: TheMachineGunner(),
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