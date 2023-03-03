// import * as ROT from 'rot-js';

// const FOV = new ROT.FOV.PreciseShadowcasting(fovLightPasses);
// // const FOV = new ROT.FOV.RecursiveShadowcasting((x, y) => this.fovLightPasses(x, y, this));

// const fovLightPasses = (x, y, game) => {
//   // if (Helper.coordsAreEqual(game.getFirstPlayer().getPosition(), {x, y})) return true
//   // return game.canOccupyPosition({x, y})
// }

export const Illuminating = superclass => class extends superclass {
  constructor({ lightRange = 3, lightColor = '#fff', ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('ILLUMINATING');
    this.lightRange = lightRange
    this.lightColor = lightColor
  }
};
