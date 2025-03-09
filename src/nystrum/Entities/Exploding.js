import SOUNDS from '../sounds';
import { FireSpread } from './index';
import * as Constant from '../constants';
import * as Helper from '../../helper';
import {MESSAGE_TYPE} from '../message';
import GradientRadialEmitter from '../Engine/Particle/Emitters/gradientRadialEmitter';
import SpatterEmitter from '../Engine/Particle/Emitters/spatterEmitter';
import {COLORS as NORMANDY_COLORS} from '../Modes/Normandy/theme';

export const Exploding = superclass => class extends superclass {
  constructor({ 
    flammability = 1,
    explosivity = 1,
    timeToSpread = 1,
    spreadCount = 1,
    ...args 
  }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('EXPLODING');
    this.flammability = flammability;
    this.explosivity = explosivity;
    this.timeToSpread = timeToSpread;
    this.spreadCount = spreadCount;
  }
  enflame() {
    // create num of fireSpreads
    const fires = Array(this.flammability).fill('').map((item) => {
      return new FireSpread({
        name: 'Pyro',
        pos: { ...this.pos },
        game: this.game,
        renderer: {
          character: '*',
          color: Constant.THEMES.SOLARIZED.base3,
          background: Constant.THEMES.SOLARIZED.red,
        },
        timeToSpread: this.timeToSpread,
        spreadCount: this.spreadCount,
        durability: 1,
        attackDamage: 1,
        speed: 100,
      });
    });
    fires.forEach((fire) => {
      // add them to map
      this.game.placeActorOnMap(fire);
      // add them to engine
      this.game.engine.addActor(fire);
    });
  }
  explode() {
    const positions = Helper.getPointsWithinRadius({ x: 0, y: 0 }, this.explosivity)
    const tileAnimationLength = this.game.tileKey['BURNT'].animation.length
    let structure = {
      x_offset: 0,
      y_offset: 0,
      positions
    };
    structure.positions.forEach((slot) => {
      let position = {
        x: this.pos.x + slot.x + structure.x_offset,
        y: this.pos.y + slot.y + structure.y_offset
      };
      const tile = this.game.map[Helper.coordsToString(position)];
      if (tile) {
        tile.type = 'BURNT';
        tile.currentFrame = Helper.getRandomInt(0, tileAnimationLength)
        let targets = Helper.getDestructableEntities(tile.entities.filter(
          (entity) => (entity.id !== this.id)
        ));
        if (targets.length > 0) {
          // let target = targets[0];
          targets.forEach((target) => {
            let damage = this['attackDamage'] ? this.attackDamage : this.explosivity;
            // this.game.addMessage(`${this.name} does ${damage} to ${target.name}`, MESSAGE_TYPE.DANGER);
            target.decreaseDurability(damage);
          })
        }
      }
    });
    // if (this.explosivity > 0) {
    //   if (!SOUNDS.explosion_0.playing()) {
    //     SOUNDS.explosion_0.play();
    //   }
    // }
    // // this.game.draw(); //may not need draw here
  }

  animateExplosion_v1 () {
    GradientRadialEmitter({
      game: this.game,
      fromPosition: this.getPosition(),
      radius: this.explosivity,
    }).start()
  }

  getAnimationColors () {
    const colors = [
      [NORMANDY_COLORS.white, NORMANDY_COLORS.red_0, NORMANDY_COLORS.red_1],
      [NORMANDY_COLORS.white, NORMANDY_COLORS.sand_2, NORMANDY_COLORS.sand_1],
      [NORMANDY_COLORS.white, NORMANDY_COLORS.red_0, NORMANDY_COLORS.red_1, NORMANDY_COLORS.sand_2, NORMANDY_COLORS.sand_1],
    ];
    return Helper.getRandomInArray(colors);
  }

  animateExplosion (position) {
    SpatterEmitter({
      game: this.game,
      fromPosition: this.getPosition(),
      spatterAmount: .6,
      spatterRadius: this.explosivity * 2,
      transfersBackground: false,
      spatterColors: this.getAnimationColors(),
    }).start()
  }

  destroy() {
    super.destroy();
    this.explode();
    this.enflame();
    this.animateExplosion()
  }
};
