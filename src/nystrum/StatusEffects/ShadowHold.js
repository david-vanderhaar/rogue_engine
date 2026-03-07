import Stunned from './Stunned.js'
import {ANIMATION_TYPES} from '../Display/konvaCustom.js'
import { COLORS } from '../Modes/HiddenLeaf/theme.js';

export default class ShadowHold  extends Stunned {
  constructor({backgroundColor = COLORS.black, ...args}) {
    super({ ...args });
    this.backgroundColor = backgroundColor
  }

  start() {
    super.start()
    // change actor renderer
    this['actor_background'] = this.actor.renderer.background;
    // this['actor_color'] = this.actor.renderer.color;
    this.actor.renderer.background = this.backgroundColor;
  }

  stop() {
    super.stop()
    // change actor renderer back
    this.actor.renderer.background = this['actor_background'];
    // this.actor.renderer.color = this['actor_color'];
  }
}