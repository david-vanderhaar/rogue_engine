import spatterEmitter from '../Engine/Particle/Emitters/spatterEmitter';

export const HasBloodSpatter = superclass => class extends superclass {
  constructor({ blood_on = true, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('HAS_BLOOD_SPATTER');
    this.blood_on = blood_on;
  }

  bloodSpatter(value) {
    spatterEmitter({
      game: this.game,
      fromPosition: this.getPosition(),
      spatterAmount: .2 * value,
      spatterRadius: 3,
      // spatterDirection: Helper.getDirectionFromOrigin(this.actor.getPosition(), this.targetPos),
      transfersBackground: true,
      spatterColors: ['#833139', '#aa2123'],
    }).start()
  }
};
