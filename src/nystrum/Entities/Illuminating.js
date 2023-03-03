export const Illuminating = superclass => class extends superclass {
  constructor({ lightRange = 3, lightColor = '#f1e3b8', ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('ILLUMINATING');
    this.lightRange = lightRange
    this.lightColor = lightColor
  }
};
