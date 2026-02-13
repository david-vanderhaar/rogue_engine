import { Say } from '../../../Actions/Say';
import Behavior from './Behavior';
import { EquipItem } from '../../../Actions/EquipItem';

export default class ExecuteEquipItem extends Behavior {
  constructor({ getItem, itemName, ...args }) {
    super({ ...args });
    this.getItem = getItem;
    this.itemName = itemName;
  }

  isValid () {
    // can only equip if have item in container that is not currently equipped
    return this.actor.hasItemNameEquipped(this.itemName) === false
  }

  constructActionClassAndParams () {
    const item = this.getItem(this.actor.game.engine, this.actor.getPosition());
    return [
      EquipItem,
      {
        item,
        onBefore: () => {
          if (!this.actor.hasEquipmentSlot(item.equipmentType)) {
            this.actor.addEquipmentSlot({type: item.equipmentType})
          }
        }
      }
    ]
  }
}
