export const Describable = superclass => class extends superclass {
  constructor({ baseDescription = '', baseDescriptors = [], ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('DESCRIBABLE');
    this.baseDescription = baseDescription;
    this.baseDescriptors = baseDescriptors; // can be added by any entity mixin
  }
  getDescription() {
    return this.baseDescription
  }

  getFullDescription() {
    return this.getDescriptors().join("\n")
  }

  getDescriptors() {
    return [
      this.getDescription(),
      ...this.baseDescriptors,
      // this.getDurabliltyDescription
      // ...this.getStatusEffectDescriptions
    ]
  }
};
