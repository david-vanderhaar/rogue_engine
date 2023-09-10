import {createCartridge} from './cartridge'
import Characters from '../Characters/index';
import Modes from '../Modes/index';
import { COLORS } from '../Modes/Jacinto/theme';
import { THEMES } from '../constants';
import { jacintoCart } from './jacinto'
import { hiddenLeafCart } from './hiddenLeaf'
import { developmentCart } from './development'
import { somethingInTheTallGrassCart } from './somethingInTheTallGrass';

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

export default {
  defaultCart,
  jacintoCart,
  developmentCart,
  somethingInTheTallGrassCart,
  toTheWallsCart,
  flumeCart,
  hiddenLeafCart,
}