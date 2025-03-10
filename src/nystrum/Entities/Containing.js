export class ContainerSlot {
  constructor({ itemType, items, hidden = false }) {
    this.itemType = itemType;
    this.items = items;

    // if hidden, the slot will not be displayed in the inventory
    this.hidden = hidden;
  }
}

export const Containing = superclass => class extends superclass {
  constructor({ container = [], ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('CONTAINING');
    this.container = container;
  }

  move(targetPos) {
    const success = super.move(targetPos)

    if (success) {
      this.container.forEach((slot) => {
        if (slot.items.length > 0) slot.items.forEach((item) => item.setPosition(targetPos))
      })
    }

    return success
  }

  createSlot(item) {
    let slot = new ContainerSlot({
      itemType: item.name,
      items: [item],
    });
    this.container.push(slot);
  }
  containsCount(itemType) {
    let container = this.container;
    let slots = container.filter((slot) => slot.itemType === itemType);
    return slots.length > 0 ? slots.flatMap((slot) => slot.items).length : 0;
  }
  contains(itemType) {
    let container = this.container;
    let slots = container.filter((slot) => slot.itemType === itemType);
    return slots.length > 0 ? slots[0].items[0] : false;
  }
  addToContainer(item) {
    const index = this.container.findIndex((slot) => slot.itemType === item.name);
    if (index >= 0) {
      this.container[index].items.push(item);
    }
    else {
      this.createSlot(item);
    }
  }
  removeFromContainer(item) {
    let success = false
    this.container.forEach((slot, index) => {
      slot.items = slot.items.filter((it) => it.id !== item.id);
      if (!slot.items.length)
        this.container.splice(index, 1);
        success = true
    });
    return success
  }
};
