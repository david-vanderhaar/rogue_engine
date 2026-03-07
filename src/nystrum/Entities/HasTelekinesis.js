export const HasTelekinesis = superclass => class extends superclass {
  constructor({ telekenticTriggerRange = 2, telekineticThrowRange = 2, ...args }) {
    super({ ...args });
    this.telekenticTriggerRange = telekenticTriggerRange;
    this.telekineticThrowRange = telekineticThrowRange;
    this.entityTypes = this.entityTypes.concat('HAS_TELEKINESIS');
  }

  getTelekenticTriggerRange () {
    return this.telekenticTriggerRange
  }
  getTelekineticThrowRange () {
    return this.telekineticThrowRange
  }
};
