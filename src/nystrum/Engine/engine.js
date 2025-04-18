import * as Helper from '../../helper';
import { Particle } from '../Entities/index';
import { PARTICLE_TEMPLATES } from '../constants';

export class Engine {
  constructor({
    statusEffects = [],
    actors = [],
    currentActor = 0,
    isRunning = false,
    game = null,
  }) {
    this.statusEffects = statusEffects;
    this.actors = actors;
    this.currentActor = currentActor;
    this.isRunning = isRunning;
    this.game = game;
  }

  async processV1 () { // a turn-based system using speed and round-robin
    let actor = this.actors[this.currentActor]
    actor.gainEnergy(actor.speed);
    if (actor.hasEnoughEnergy()) {
      let action = actor.getAction(this.game);
      if (!action) { return false; } // if no action given, kick out to UI input
      while (true) {
        let result = action.perform();
        this.game.draw();
        await Helper.delay(action.processDelay);
        if (!result.success) return false;
        if (result.alternative === null) break;
        action = result.alternative;
      }
    }
    this.currentActor = (this.currentActor + 1) % this.actors.length;
    return true
  }

  async processV2() { // a turn-based system using speed and Action Points
    let actor = this.actors[this.currentActor]
    
    if (this.game.getFirstPlayer() === null) return false
    let acting = true;
    let timePassed = 0;

    while (acting) {
      if (!actor) return false;
      // if (!actor.active) return false;
      if (!actor.active) break;
      // let timePassed = 0;
      this.processStatusEffects(timePassed);
      if (actor.skipTurn) break;

      if (actor.hasEnoughEnergy()) {
        // if (!actor.active) break;
        let action = actor.getAction(this.game);
        if (!action) { return false; } // if no action given, kick out to UI input
        // timePassed += action.getEnergyCost();
        // console.log('timePassed ', timePassed);
        
        while (true) {
          let result = {
            success: false,
            alternative: null,
          };
          // if (actor.energy >= action.energyCost) { // replace with checking for all required resources
          if (action.canPayRequiredResources()) { // replace with checking for all required resources
            
            await action.onBefore();
            result = await action.perform();
            actor.lastActionResult = result
            if (result.success) {
              await action.onSuccess();
              action.payRequiredResources();
              timePassed += action.getEnergyCost();
            } else {
              await action.onFailure();
            }
            await action.onAfter();
          }
          if (!await this.processActionFX(action, result.success)) {
            if (this.shouldAutoRun()) {
              await Helper.delay(25);
            } else {
              await Helper.delay(action.processDelay);
            }
            this.game.draw();
          }
          if (!actor.active) break;
          // if (!result.success) return false;
          if (result.alternative === null) break;
          action = result.alternative;
        }
        
        // this.processStatusEffects(timePassed);

        if (action.interrupt) {
          acting = false;
          break;
        }
      } else {
        actor.gainEnergy(actor.speed);
        acting = false;
      }
    }
    this.actors = this.actors.filter((actor) => actor.active)
    this.currentActor += 1;
    if (this.currentActor >= this.actors.length) {
      this.currentActor = 0;
    }
    return true
  }

  // a turn-based system using speed and Action Points
  // it reorders all actors by energy after every round robin
  async processV3() { 
    let actor = this.actors[this.currentActor]
    if (!actor) return false;
    let timePassed = 0;
    if (actor.hasEnoughEnergy()) {
      let action = actor.getAction(this.game);
      if (!action) { return false; } // if no action given, kick out to UI input
      timePassed += action.energyCost;
      while (true) {
        let result = await action.perform();
        if (!await this.processActionFX(action, result.success)) {
            await Helper.delay(action.processDelay);
            this.game.draw();
        }
        if (!result.success) return false;
        if (result.alternative === null) break;
        action = result.alternative;
      }
      this.processStatusEffects(timePassed);
    } else {
      actor.gainEnergy(actor.speed);
    }
    this.currentActor = (this.currentActor + 1) % this.actors.length;
    if (this.currentActor === 0) this.sortActorsByEnergy();
    return true
  }

  // TODO process that reorders actors after every action

  async start() {
    this.isRunning = true;
    while (this.isRunning) {
      this.isRunning = await this.processV2();
    }
    let actor = this.actors[this.currentActor]
    
    if (!actor) {
      // this.game.backToTitle();
      return false;
    }

    this.setVisibleKeymap(actor);
    
    this.game.updateMode();
    await this.game.updateReact(this.game);
  }
  
  stop() {
    this.isRunning = false;
  }

  setVisibleKeymap (actor) {
    if (actor.entityTypes.includes('HAS_KEYMAP')) {
      const keymap = actor.getKeymap()
      if (keymap) {
        this.game.visibleKeymap = keymap;
      }
    }
  }

  sortActorsByEnergy () {
    this.actors = this.actors.sort((a, b) => b.energy - a.energy);
  }

  shouldAutoRun () {
  // if there is no player, the engine will continue to run, we don't want it to run too fast
    const hasPlayer = this.actors.filter((actor) => actor.entityTypes.includes('PLAYING')).length
    if (hasPlayer) return false;
    return true;
  }

  addStatusEffect(newEffect) {
    if (!newEffect.allowDuplicates) {
      if (this.statusEffects.filter((effect) => (
        effect.actor.id === newEffect.actor.id &&
        effect.name === newEffect.name
      )).length > 0) {
        return false;
      };
    }
    // newEffect.onStart();
    newEffect.start();
    this.statusEffects.push(newEffect)
    return true;
  }

  removeStatusEffectById (id) {
    this.statusEffects = this.statusEffects.filter((effect) => {
      if (effect.id !== id) return true;
      // effect.onStop();
      effect.stop();
      return false;
    });
  }
  
  removeStatusEffectByActorId (actorId) {
    this.statusEffects = this.statusEffects.filter((effect) => {
      if (effect.actor.id !== actorId) return true;
      // effect.onStop();
      effect.stop();
      return false;
    });
  }

  removeDeadStatusEffects() {
    this.statusEffects = this.statusEffects.filter((effect) =>{
      if (effect.lifespan >= 0 && effect.timeToLive <= 0) {
        // effect.onStop();
        effect.stop();
        return false;
      }
      return true;
    });
  }

  getStatusEffectsByActorId(actorId) {
    return this.statusEffects.filter((effect) => effect.actor.id === actorId);
  }

  actorHasStatusEffect(actorId, effectName) {
    return this.getStatusEffectsByActorId(actorId)
      .filter((effect) => effect.name === effectName)
      .length > 0;
  }

  processStatusEffects (timePassed) {
    let effects = this.statusEffects.filter((effect) => {
      if (effect.processOnlyOnActorTurn) return effect.actor.id === this.getCurrentActor().id
      else return true
    })

    effects.forEach((effect) => {
      effect.timeSinceLastStep += timePassed;
      effect.timeToLive -= timePassed;
      if (effect.timeSinceLastStep >= effect.stepInterval) {
        // effect.onStep(timePassed);
        effect.step(timePassed);
        effect.timeSinceLastStep = 0;
      } 
    });
    this.removeDeadStatusEffects();
  }

  currentActorIsPlayer() {
    const actor = this.actors[this.currentActor]
    if (!actor) return false

    return actor.entityTypes.includes('PLAYING')
  }

  async processActionFX (action, actionSuccess) {
    if (!actionSuccess) { 
      // If action is not successful, instead of running action's normal particle animation
      // we'll show a red X on the entity that initiated the action
      const particle = new Particle({
        game: this.game,
        name: 'particle',
        passable: true,
        pos: {...action.actor.pos},
        renderer: PARTICLE_TEMPLATES.fail.renderer,
      })
      this.game.placeActorOnMap(particle);
      this.game.draw();
      await Helper.delay(25);
      this.game.removeActorFromMap(particle);
      particle.update(1);
      this.game.draw();
      action.removeDeadParticles(); // is this needed?
      return true;
    }

    if (action.particles.length) {
      let time = action.particles[0].particleAnimationTimeStep
      const easingFunction = action.particles[0].particleEasingFunction
      while (action.particles.length > 0) {
        action.particles.forEach((particle) => {
          this.game.placeActorOnMap(particle);
        })
        this.game.draw();
        // const delay = Math.max(time * 100, 12)
        // await Helper.delay(delay);
        await Helper.delay(10);
        action.particles.forEach((particle) => {
          this.game.removeActorFromMap(particle);
          particle.update(1);
        })
        action.removeDeadParticles();
        this.game.draw();
        time = easingFunction(time);
      }
      return true;
    }
    return false;
  }

  addActor (entity) {
    this.actors.push(entity);
  }

  addActorAsPrevious (entity) {
    this.actors.splice(this.currentActor, 0, entity);
  }

  addActorAsNext (entity) {
    this.actors.splice(this.currentActor + 1, 0, entity);
  }

  setActorToPrevious (entity) {
    this.currentActor -= 1;
    if (this.currentActor <= -1) this.currentActor = this.actors.length - 1;
  }

  setActorToNext (entity) {
    this.currentActor = (this.currentActor + 1) % this.actors.length;
  }

  getCurrentActor() {
    return this.actors[this.currentActor]
  }

}

export class CrankEngine extends Engine {
  async process() { // a turn-based system using speed and Action Points
    let actor = this.actors[this.currentActor]
    let acting = true;
    while (acting) {
      if (actor.hasEnoughEnergy()) {
        let action = actor.getAction(this.game);
        if (!action) { return false; } // if no action given, kick out to UI input
        while (true) {
          this.game.draw();
          let result = await action.perform();
          await Helper.delay(action.processDelay);
          if (!result.success) return false;
          if (result.alternative === null) break;
          action = result.alternative;
        }
      } else {
        // actor.gainEnergy(actor.speed);
        acting = false;
      }
    }
    // this.currentActor = (this.currentActor + 1) % this.actors.length;
    this.currentActor += 1;
    if (this.currentActor + 1 >= this.actors.length) {
      this.currentActor = 0;
      this.actors.forEach((actor) => actor.gainEnergy(actor.speed));
      return false;
    }
    return true
  }

  async start() {
    this.isRunning = true;
    while (this.isRunning) {
      this.isRunning = await this.process();
    }
    let actor = this.actors[this.currentActor]
    this.setVisibleKeymap(actor);
    // this.game.updateMode();
    this.game.mode.update();
    await this.game.updateReact(this.game);
  }
}