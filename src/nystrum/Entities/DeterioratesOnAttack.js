import { MESSAGE_TYPE } from "../message";

export const DeterioratesOnAttack = superclass => class extends superclass {
  constructor({ damageOnUse = 1, ...args }) {
    super({ ...args });
    this.damageOnUse = damageOnUse;
    this.entityTypes = this.entityTypes.concat('DETERIORATES_ON_ATTACK');
  }

  attack(entity) {
    super.attack(entity);
    this.decreaseDurabilityWithoutDefense(this.damageOnUse);
  }

  destroy() {
    this.game.addMessage(`${this.name} breaks`, MESSAGE_TYPE.INFORMATION);
    this.equippedBy?.unequip(this);
    super.destroy();
  }
};
