export default class BehaviorChain {
  constructor({ repeat = 1}) {
    this.repeat = repeat;
  }

  behaviors() {
    return [];
  }

  create() {
    return Array(this.repeat).fill(this.behaviors()).flat();
  }
}