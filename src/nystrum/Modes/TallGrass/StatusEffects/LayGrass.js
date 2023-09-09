import { getRandomInArray, getTileAtPosition } from '../../../../helper';
import {Base} from '../../../StatusEffects/Base';
import { JACINTO_SOUNDS } from '../../Jacinto/sounds';
import { COLORS } from '../theme';


export class LayGrass extends Base {
  constructor({...args}) {
    super({ ...args });
    this.name = 'flattened';
    this.allowDuplicates = true
    this.processOnlyOnPlayerTurn = true
    const rendererOriginal = {
      ...this.actor.renderer
    }
    const rendererFlattened = {
      color: COLORS.sandy_brown,
      background: COLORS.brown_sugar,
    };

    this.onStart = () => {
      this.actor.renderer = {
        ...this.actor.renderer,
        ...rendererFlattened
      }

      this.actor.lightPassable = true
      this.playRustleSound()
    }

    this.onStep = (timePassed) => {
      const tile = getTileAtPosition(this.game, this.actor.getPosition())
      if (tile.entities.length > 1) this.timeToLive += timePassed
    }

    this.onStop = () => {
      this.actor.renderer = {
        ...rendererOriginal
      }

      this.actor.lightPassable = false
    }
  }

  playRustleSound() {
    const sound = getRandomInArray([
      JACINTO_SOUNDS.grass_00,
      JACINTO_SOUNDS.grass_01,
      JACINTO_SOUNDS.grass_02,
      JACINTO_SOUNDS.grass_03,
      JACINTO_SOUNDS.grass_04,
      JACINTO_SOUNDS.grass_05,
    ])

    sound.play()
  }
}