export const Illuminating = superclass => class extends superclass {
  constructor({ lightRange = 8, lightColor = '#f9d091', ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('ILLUMINATING');
    this.lightRange = lightRange
    this.lightColor = lightColor
  }
};
