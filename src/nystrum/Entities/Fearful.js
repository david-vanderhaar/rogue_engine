import * as Helper from '../../helper';
import { ENERGY_THRESHOLD } from '../constants';
import { FearOfDark } from "../Modes/TallGrass/StatusEffects/FearOfDark";
import { PoorSight } from '../Modes/TallGrass/StatusEffects/PoorSight';
import { WeakHits } from '../Modes/TallGrass/StatusEffects/WeakHits';

const fearEffects = [
  [PoorSight, {lifespan: ENERGY_THRESHOLD * 5}],
  [WeakHits, {lifespan: ENERGY_THRESHOLD * 5}],
  // RunningScared, // run in a straigt line for a few turns (set tackle as next action?)
  // SweatyPalms, // may drop equipped item
]

export const Fearful = superclass => class extends superclass {
  constructor({ fearPoints = 0, maxFearPoints = 3, lightSafetyRange = 3, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('FEARFUL');
    this.fearPoints = fearPoints;
    this.maxFearPoints = maxFearPoints;
    this.lightSafetyRange = lightSafetyRange
    this.initializeStatusEffect()
    
  }

  setFear(points) {
    this.fearPoints = Helper.clamp(points, 0, this.maxFearPoints)
  }

  addRandomFearEffect() {
    const [effectClass, args] = Helper.getRandomInArray(fearEffects)
    const effect = new effectClass({
      game: this.game,
      actor: this,
      ...args
    })
    
    this.game.engine.addStatusEffect(effect)
  }

  shouldAddFearEffect() {
    return Math.random() < (this.fearPoints / this.maxFearPoints)
  }

  incrementFear(amount = 1) {
    this.setFear(this.fearPoints + amount)
  }

  decrementFear(amount = 1) {
    this.setFear(this.fearPoints - amount)
  }

  setFearByLightStrength() {
    const safeLights = this.getAllLights().filter((light) => !this.isNotInLightSafety(light))
    if (safeLights.length > 0) this.decrementFear()
    else this.incrementFear()

    if (this.shouldAddFearEffect()) this.addRandomFearEffect()
  }

  isNotInLightSafety(lightSource) {
    const distanceToLightSource = Helper.diagonal_distance(this.getPosition(), lightSource.getPosition())

    return this.lightSafetyRange > (lightSource.lightRange - distanceToLightSource)
  }

  getAllLights() {
    return Helper.filterEntitiesByType(this.game.entityLog.getAllEntities(), 'ILLUMINATING')
  }

  initializeStatusEffect() {
    const effect = new FearOfDark({
      game: this.game,
      actor: this,
    })

    this.game.engine.addStatusEffect(effect);
  }
};
