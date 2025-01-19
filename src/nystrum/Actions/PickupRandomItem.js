import { MESSAGE_TYPE } from '../message';
import { Base } from './Base';
import * as Helper from '../../helper';

export class PickupRandomItem extends Base {
  constructor({attemptEquip = false, ...args }) {
    super({ ...args });
    this.attemptEquip = attemptEquip;
  }

  perform() {
    let success = false;
    const items = this.game.map[Helper.coordsToString(this.actor.pos)].entities.filter((e) => e.id !== this.actor.id);
    if (items.length) {
      const item = Helper.getRandomInArray(items);
      this.game.addMessage(`${this.actor.name} picks up ${item.name}.`, MESSAGE_TYPE.ACTION);
      this.actor.addToContainer(item);
      if (this.attemptEquip) this.attemptToEquip(item);
      this.processPickupEffects(item, this.actor)
      let entities = this.game.map[Helper.coordsToString(this.actor.pos)].entities;
      this.game.map[Helper.coordsToString(this.actor.pos)].entities = entities.filter((it) => it.id !== item.id);
      success = true;
    } 
    return {
      success,
      alternative: null,
    };
  }

  processPickupEffects(item, actor) {
    item?.processPickupEffects && item?.processPickupEffects(actor)
  }

  attemptToEquip(item) {
    const didEquip = this.actor.equip(item.equipmentType, item);
    if (didEquip) {
      this.game.addMessage(`${this.actor.name} equips ${item.name}.`, MESSAGE_TYPE.ACTION);
      this.actor.removeFromContainer(item);
    }

    return didEquip;
  }
}
;
