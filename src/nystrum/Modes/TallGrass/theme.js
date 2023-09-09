export const COLORS = {
  main: '#16161d',
  accent: '#ec9c5d',
  text: '#f9d091',
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

  yellow: '#b58900',
  orange: '#cb4b16',
  red: '#dc322f',
  magenta: '#d33682',
  violet: '#6c71c4',
  blue: '#268bd2',
  cyan: '#2aa198',
  green: '#859900',
}


export const TILE_KEY = {
  'TALL_GRASS': {
    background: COLORS.sunset,
    foreground: COLORS.sandy_brown,
    character: '.',
    sprite: '',
    passable: true,
    lightPassable: false,
    tags: ['BURNABLE'],
  },
  'LAYED_GRASS': {
    background: COLORS.brown_sugar,
    foreground: COLORS.sandy_brown,
    character: '.',
    sprite: '',
    passable: true,
    lightPassable: true,
    tags: ['BURNABLE', 'BRAMBLES', 'BERRIES'],
  },
  'BERRY': {
    background: COLORS.blue,
    foreground: COLORS.sunset,
    character: 'b',
    sprite: '',
    passable: true,
    lightPassable: true,
    tags: ['BURNABLE', 'BERRIES'],
  },
  'BRAMBLE': {
    background: COLORS.ebony,
    foreground: COLORS.sunset,
    character: '*',
    sprite: '',
    passable: true,
    lightPassable: true,
    tags: ['BURNABLE', 'BERRIES'],
  },
  'GROUND': {
    background: COLORS.black,
    foreground: COLORS.ebony,
    character: '.',
    sprite: '',
    passable: true,
    tags: ['BURNABLE',],
  },
  'GROUND_ALT': {
    background: COLORS.black,
    foreground: COLORS.ebony,
    character: '',
    sprite: '',
    passable: true,
    tags: ['BURNABLE'],
  },
  'NEST': {
    background: COLORS.liver,
    foreground: COLORS.white,
    character: '+',
    sprite: '',
    passable: true,
    tags: ['LOOT'],
  },
  'DOOR': {
    background: COLORS.liver,
    foreground: COLORS.brown_sugar,
    character: '+',
    sprite: '',
    passable: true,
    tags: ['BURNABLE'],
  },
  'FLOOR': {
    background: COLORS.liver,
    foreground: COLORS.gray,
    character: '',
    passable: true,
    tags: ['BURNABLE', 'OVERGROWN', 'LOOT'],
  },
  'STEEL_FLOOR': {
    background: COLORS.gray,
    foreground: COLORS.gray,
    character: '',
    passable: true,
    tags: ['LOOT'],
  },
  'WALL_VERTICAL': {
    background: COLORS.liver,
    foreground: COLORS.raw_umber,
    character: '||',
    sprite: '',
    passable: false,
    tags: ['BURNABLE', 'WALL', 'OVERGROWN'],
  },
  'WALL_HORIZONTAL': {
    background: COLORS.liver,
    foreground: COLORS.raw_umber,
    character: '=',
    sprite: '',
    passable: false,
    tags: ['BURNABLE', 'WALL', 'OVERGROWN'],
  },
  'WALL_CORNER_NW': {
    background: COLORS.liver,
    foreground: COLORS.raw_umber,
    character: '#',
    sprite: '',
    passable: false,
    tags: ['BURNABLE', 'WALL', 'OVERGROWN'],
  },
  'WALL_CORNER_NE': {
    background: COLORS.liver,
    foreground: COLORS.raw_umber,
    character: '#',
    sprite: '',
    passable: false,
    tags: ['BURNABLE', 'WALL', 'OVERGROWN'],
  },
  'WALL_CORNER_SW': {
    background: COLORS.liver,
    foreground: COLORS.raw_umber,
    character: '#',
    sprite: '',
    passable: false,
    tags: ['BURNABLE', 'WALL', 'OVERGROWN'],
  },
  'WALL_CORNER_SE': {
    background: COLORS.liver,
    foreground: COLORS.raw_umber,
    character: '#',
    sprite: '',
    passable: false,
    tags: ['BURNABLE', 'WALL', 'OVERGROWN'],
  },
}