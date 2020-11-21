import { Particle } from '../Entities/index';
import * as Constant from '../constants';
import * as _ from 'lodash';

export class Base {
  constructor({ 
    game, 
    actor, 
    energyCost = 100, 
    processDelay = 50, 
    particles = [], 
    particleTemplate = Constant.PARTICLE_TEMPLATES.default, 
    onBefore = () => null, 
    onAfter = () => null, 
    onSuccess = () => null, 
    onFailure = () => null, 
    interrupt = false, 
    // requiredResources = [],
  }) {
    this.actor = actor;
    this.game = game;
    this.energyCost = energyCost;
    this.processDelay = processDelay;
    this.particles = particles;
    this.particleTemplate = particleTemplate;
    this.onBefore = onBefore;
    this.onAfter = onAfter;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
    this.interrupt = interrupt;
    // this.requiredResources = requiredResources;
  }

  addParticle(
    life, 
    pos, 
    direction, 
    renderer = { ...this.particleTemplate.renderer }, 
    type = Constant.PARTICLE_TYPE.directional, 
    path = null
  ) {
    let particle = new Particle({
      game: this.game,
      name: 'particle',
      passable: true,
      life,
      pos,
      direction,
      energy: 100,
      renderer,
      type,
      path,
    });
    this.particles.push(particle);
  }

  removeDeadParticles() {
    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  // createActionResource = ({
  //   name = 'Resource',
  //   getResourceCost = () => null,
  //   actorResourcePath = null,
  //   actorResourceGetter = () => null,
  //   actorResourceSetter = () => null,
  // }) => {
  //   return {
  //     name,
  //     getResourceCost,
  //     actorResourcePath,
  //     actorResourceGetter,
  //     actorResourceSetter,
  //   }
  // }

  // getRequiredResources() {
  //   return _.map(this.requiredResources, 'name');
  // }

  // listPayableResources() {
  //   return _.map(this.getRequiredResources(), ({ name, getResourceCost, actorResourcePath, actorResourceGetter }) => {
  //     // if the actor has provided a setter for this variable, use that 
  //     if (_.get(this.actor, actorResourceGetter)) {
  //       return {name, canPay: this.actor[actorResourceGetter] >= getResourceCost()};
  //     }

  //     // else if the actor has a path to the appropriate variable, get that value and set it manually
  //     const actorVariable = _.get(this.actor, actorResourcePath, null);
  //     if (actorVariable) {
  //       return {name, canPay: _.get(this.actor, actorResourcePath) >= getResourceCost()};
  //     }
  //   })
  // }

  // canPayRequiredResources() {
  //   return !_.find(this.listPayableResources(), {'canPay': false});
  // }

  // payRequiredResources() {
  //   _.each(this.getRequiredResources(), ({getResourceCost, actorResourcePath, actorResourceSetter}) => {
  //     // if the actor has provided a setter for this variable, use that 
  //     if (_.get(this.actor, actorResourceSetter)) {
  //       return this.actor[actorResourceSetter](getResourceCost())
  //     } 

  //     // else if the actor has a path to the appropriate variable, get that value and set it manually
  //     const actorVariable = _.get(this.actor, actorResourcePath, null);
  //     if (actorVariable) {
  //       return _.set(this.actor, actorResourcePath, actorVariable - getResourceCost());
  //     }
  //   })
  // }
  
  perform() {
    console.log(`${this.actor.name} performs`);
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    };
  }

}