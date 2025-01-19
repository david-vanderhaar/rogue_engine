import SOUNDS from '../sounds';
import * as Constant from '../constants';

export const Equiping = superclass => class extends superclass {
  constructor({ equipment = Constant.EQUIPMENT_LAYOUTS.human(), ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('EQUIPING');
    this.equipment = equipment;
  }

  move(targetPos) {
    const success = super.move(targetPos)

    if (success) {
      this.setAllEquipmentPositions()
      // this.equipment.forEach((slot) => {
      //   if (slot.item) slot.item.setPosition(targetPos)
      // })
    }

    return success
  }

  setAllEquipmentPositions() {
    const targetPos = this.getPosition()
    this.equipment.forEach((slot) => {
      if (slot.item) slot.item.setPosition(targetPos)
    })
  }

  getEquippedItems() {
    return this.equipment.map((slot) => slot.item).filter((item) => item !== null)
  }

  hasItemNameEquipped(itemName) {
    const equipment = this.equipment.filter((slot) => {
      if (slot.item) {
        if (slot.item.name === itemName) {
          return true;
        }
      }
      return false;
    });
    return equipment.length > 0;
  }
  getItemInSlot(slotName) {
    let slot = this.equipment.find((slot) => slot.type === slotName);
    if (!slot) {
      return false;
    }
    if (!slot.item) {
      return false;
    }
    return slot.item;
  }
  equip(slotName, item) {
    let foundSlot = false;
    this.equipment = this.equipment.map((slot) => {
      if (!foundSlot && slot.type === slotName && slot.item === null) {
        slot.item = item;
        item.equippedBy = this;
        item.setPosition(this.getPosition())
        foundSlot = true;
        SOUNDS.equip_1.play();
      }
      return slot;
    });
    return foundSlot;
  }
  unequip(item) {
    this.equipment = this.equipment.map((slot) => {
      if (slot.item) {
        if (slot.item.id === item.id) {
          slot.item = null;
          item.equippedBy = null;
          SOUNDS.equip_0.play();
        }
      }
      return slot;
    });
  }
  addEquipmentSlot({type, name = null, item = null}) {
    const slot = {type, name: name || type, item};
    this.equipment.push(slot);
  }
  removeEquipmentSlot(slotName) {
    this.equipment = this.equipment.filter((slot) => slot.type !== slotName);
  }
};
