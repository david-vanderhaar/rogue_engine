export const COLORS = {
  main: '#16161d',
  accent: '#f9d091',
  text: '#ec9c5d',
  white: '#eeeeee',
  sunset: '#f9d091',
  sandy_brown: '#ec9c5d',
  brown_sugar: '#b7744f',
  raw_umber: '#926846',
  ebony: '#4f5941',
  umber: '#756356',
  gray: '#50534c',
  liver: '#5c4540',
  black: '#16161d',

  flesh1: '#833139',
  flesh2: '#CC7468',
  flesh3: '#DDA78F',
}


export const TILE_KEY = {
  'GROUND': {
    // background: COLORS.sunset,
    background: COLORS.black,
    foreground: COLORS.ebony,
    character: '.',
    sprite: '',
    // passable: false,
    passable: true,
    tags: [],
  },
  'GROUND_ALT': {
    background: COLORS.black,
    foreground: COLORS.ebony,
    character: '',
    sprite: '',
    passable: true,
    tags: [],
  },
}