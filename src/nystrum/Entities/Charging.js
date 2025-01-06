export const Charging = superclass => class extends superclass {
  constructor({ charge = 2, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('CHARGING');
    this.charge = charge;
    this.chargeMax = charge;
  }
  getCharge() {
    return this.charge;
  }
  decreaseCharge(value) {
    this.charge = Math.max(0, this.charge - value);
  }
  increaseCharge(value) {
    this.charge = Math.min(this.chargeMax, this.charge + value);
  }
  gainEnergy(arg) {
    super.gainEnergy(arg);
    this.increaseCharge(1);
  }
};
