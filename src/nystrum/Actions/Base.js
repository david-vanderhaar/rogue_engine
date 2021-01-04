import * as _ from 'lodash';
import { Particle } from '../Entities/index';
import * as Constant from '../constants';
import {EnergyResource} from './ActionResources/EnergyResource';

export class Base {
  constructor({ 
    game,
    actor,
    label = 'action label',
    hidden = false,
    energyCost = Constant.ENERGY_THRESHOLD, 
    processDelay = 50, 
    particles = [], 
    particleTemplate = Constant.PARTICLE_TEMPLATES.default, 
    onBefore = () => null, 
    onAfter = () => null, 
    onSuccess = () => null, 
    onFailure = () => null, 
    interrupt = false, 
    requiredResources = [],
  }) {
    this.actor = actor;
    this.game = game;
    this.label = label;
    this.hidden = hidden;
    this.energyCost = energyCost;
    this.processDelay = processDelay;
    this.particles = particles;
    this.particleTemplate = particleTemplate;
    this.onBefore = onBefore;
    this.onAfter = onAfter;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
    this.interrupt = interrupt;
    this.requiredResources = [new EnergyResource({ getResourceCost: () => this.energyCost }), ...requiredResources];
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

  setAsNextAction() {
    this.actor.setNextAction(this);
  }

  getEnergyCost() {
    return _.find(this.requiredResources, {name: 'Energy'}).getResourceCost();
  }

  getRequiredResourceName() {
    return _.map(this.requiredResources, 'name');
  }

  listPayableResources() {
    return _.map(this.requiredResources, (resource) => {
      const name = resource.name; 
      const getResourceCost = resource.getResourceCost; 
      const actorResourcePath = resource.actorResourcePath; 
      const actorResourceGetter = resource.actorResourceGetter;

      const actorVariable = _.get(this.actor, actorResourcePath, null);
      
      let canPay = false;
      // if the actor has provided a setter for this variable, use that 
      if (_.get(this.actor, actorResourceGetter)) {
        canPay = this.actor[actorResourceGetter]() >= getResourceCost();
      } else if (actorVariable) {
        // else if the actor has a path to the appropriate variable, get that value and set it manually
        canPay = actorVariable >= getResourceCost();
      }

      return {
        name,
        canPay,
      }
    })
  }

  canPayRequiredResources() {
    return !_.find(this.listPayableResources(), {'canPay': false});
  }

  payRequiredResources() {
    _.each(this.requiredResources, (resource) => {
      console.log('resource');
      console.log(resource);
      
      const getResourceCost = resource.getResourceCost;
      const actorResourcePath = resource.actorResourcePath;
      const actorResourceSetter = resource.actorResourceSetter;
      
      const actorVariable = _.get(this.actor, actorResourcePath, null);
      const resourceCost = getResourceCost();
      // if the actor has provided a setter for this variable, use that 
      if (_.get(this.actor, actorResourceSetter, null)) {
        this.actor[actorResourceSetter](actorVariable - resourceCost)
        return true;
      }

      // else if the actor has a path to the appropriate variable, get that value and set it manually
      if (actorVariable) {
        console.log('actorVariable');
        console.log(actorVariable);
        console.log('resource Cost');
        console.log(resourceCost);
        this.actor[actorResourcePath] -= resourceCost;
        return true;
        // return _.set(this.actor, actorResourcePath, actorVariable - getResourceCost());
      }
      return false;
    })
  }
  
  perform() {
    console.log(`${this.actor.name} performs`);
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    };
  }

}