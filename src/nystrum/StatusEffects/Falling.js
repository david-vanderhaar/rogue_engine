import Stunned from './Stunned.js'
import {ANIMATION_TYPES} from '../Display/konvaCustom.js'
import { COLORS } from '../Modes/Telekinetic/theme.js';
import { Base } from './Base.js';
import { coordsToString, getTileAtPosition } from '../../helper.js';
import { tileHasTag } from '../Maps/helper.js';

export default class Falling  extends Base {
  constructor({timeUntilDestroy = 3, ...args}) {
    super({ ...args });
    this.name = 'falling';
    this.description = "you are hanging by a thread, if you don't find solid ground soon, you will fall to your death"
    this.renderer = {
      color: COLORS.white,
      background: COLORS.dark_accent,
      character: 'f',
    };
    this.allowDuplicates = false
    if (args.actor.entityTypes.includes('PLAYING')) {
      this.processOnlyOnActorTurn = true
    }
    this.lifespan = -1
    this.stepInterval = 100
    this.timeUntilDestroy = timeUntilDestroy
  }

  start() {
    super.start()
    // change actor renderer
    this['actor_background'] = this.actor.renderer.background;
    this['actor_color'] = this.actor.renderer.color;
    this.actor.renderer.background = COLORS.dark_accent;
    this.actor.renderer.color = COLORS.white;

    // make FREE-FALL not traversable
    this['original_traversable_tiles'] = [...this.actor.traversableTiles];
    this.actor.traversableTiles = this.actor.traversableTiles.filter((tile) => tile !== 'FREE_FALL')
  }

  step(timePassed) {
    super.step(timePassed)
    console.log('falling: ', timePassed);
    

    if (this.timeUntilDestroy <= 0) {
      // kill actor
      this.actor.destroy()
      return;
    }

    // this.animateText('falling', this.renderer.color)
    this.animateText(`turns until death: ${this.timeUntilDestroy - 1}`, COLORS.red)
    // this.actor.skipTurn = false
    // this.remove()

    // if not on FALLING tile, remove self
    const pos = this.actor.getPosition();
    const tile = getTileAtPosition(this.game, pos);
    if (tile && !tileHasTag({tile, tag: 'FALLING'})) {
      this.remove()
    } else if (!tile) {
      this.remove()
    }

    this.timeUntilDestroy -= 1
  }

  stop() {
    super.stop()
    // change actor renderer back
    this.actor.renderer.background = this['actor_background'];
    this.actor.renderer.color = this['actor_color'];

    // make FREE-FALL traversable again
    this.actor.traversableTiles = this['original_traversable_tiles']
  }

  addChangeAnimation() {
    const text = 'falling'
    this.animateText(text, this.renderer.color)
  }

  animateText(text, color) {
    this.game.display.addAnimation(
      ANIMATION_TYPES.TEXT_FLOAT,
      {
        ...this.actor.getPosition(),
        color,
        text,
        timeToLive: 750,
      }
    );
  }
}
