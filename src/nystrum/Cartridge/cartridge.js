export const createCartridge = (data = {}) => {
  return {
    name: data?.name || 'ゲーム (Gemu)', //also serves ast meta tag title
    coverImage: data?.coverImage || `${window.PUBLIC_URL}/fire_man_blue.jpg'`,
    icon: data?.icon || `${window.PUBLIC_URL}/favicon.ico`,
    modes: data?.modes || [], // mode should define available characters?
    theme: data?.theme || null, // theme should define bg/text/accent color etc,
    screens: data?.screens || {
      title: {
        component: null,
        position: 0,
      },
      modeSelect: {
        component: null,
        position: 1,
      },
      chracterSelect: {
        component: null,
        position: 2,
      },
      game: {
        component: null, // level
        position: 3,
      },
      win: {
        component: null,
        position: 4,
      },
      lose: {
        component: null,
        position: 4,
      },
    },
  }
}