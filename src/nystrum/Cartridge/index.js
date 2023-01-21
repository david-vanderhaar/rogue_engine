import {createCartridge} from './cartridge'
import Characters from '../Characters/index';
import Modes from '../Modes/index';
import { COLORS } from '../Modes/Jacinto/theme';
import { THEMES } from '../constants';
import { jacintoCart } from './jacinto'

const defaultCart = () => {
  // includes all modes with all characters
  return (
    createCartridge({
      modes: Modes,
      characters: Characters,
      theme: THEMES.SOLARIZED,
      coverImage: `${window.PUBLIC_URL}/fire_man_blue.jpg`
    })
  )
}

const toTheWallsCart = () => {
  return (
    createCartridge({
      modes: {To_The_Walls: Modes.Castle},
      characters: {
        The_Man_From_The_Future: Characters.The_Veteran
      },
      theme: COLORS
    })
  )
}

const flumeCart = () => {
  return (
    createCartridge({
      modes: {Flume: Modes.Flume},
      characters: {
        FireFighter: Characters.FireFighter,
      },
      theme: COLORS
    })
  )
}

const hiddenLeafCart = () => {
  return (
    createCartridge({
      modes: {The_Chunin_Exams: Modes.Chunin},
      characters: {
        Gaara: Characters.Gaara,
        Rock_Lee: Characters.Rock_Lee,
      },
      theme: COLORS
    })
  )
}

export default {
  defaultCart,
  jacintoCart,
  toTheWallsCart,
  flumeCart,
  hiddenLeafCart,
}