import { Particle } from '../Entities/index';
import * as Constant from '../constants';

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
  
  perform() {
    console.log(`${this.actor.name} performs`);
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    };
  }
}
