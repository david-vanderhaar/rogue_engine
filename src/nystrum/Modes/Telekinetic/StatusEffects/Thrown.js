import { Base } from '../../../StatusEffects/Base.js';
import { DIRECTIONS, ENERGY_THRESHOLD } from '../../../constants.js';
import { COLORS } from '../theme.js';
import { PlaceActor } from '../../../Actions/PlaceActor.js';
import { getPositionInDirection } from '../../../../helper.js';

export default class Thrown  extends Base {
  constructor({
    direction = DIRECTIONS.N,
    range = 1,
    ...args
  }) {
    super({ ...args });
    this.direction = direction
    this.range = range

    this.name = 'thrown';
    this.description = "hurtling through the air"
    this.allowDuplicates = false
    this.processOnlyOnActorTurn = true
    this.lifespan = ENERGY_THRESHOLD * this.range
    // this.stepInterval = ENERGY_THRESHOLD
    this.stepInterval = 0
  }

  start () {
    super.start()
    // change actor renderer
    this['actor_background'] = this.actor.renderer.background;
    // this['actor_color'] = this.actor.renderer.color;
    this.actor.renderer.background = COLORS.orange;

    if (!this.actorIsInEngine() && this.isProjectileType()) this.addActor()
  }

  step () {
    super.step()
    // move in direction
    if (!this.isProjectileType()) {

      for (let index = 0; index < this.range; index++) {
        const targetPos = this.actor.getPosition()
        this.actor.move(getPositionInDirection(targetPos, this.direction))
      }
  
      console.log(this.timeToLive);
      // this.timeToLive -= 100
    }
    
  }

  stop () {
    super.stop()
    // change actor renderer back
    this.actor.renderer.background = this['actor_background'];
    // this.actor.renderer.color = this['actor_color'];
  }

  addActor () {
    console.log('adding actor: ', this.actor.name);
    this.actor.direction = this.direction
    this.actor.range = this.range
    this.actor.speed = ENERGY_THRESHOLD
    new PlaceActor({
      entity: this.actor,
      targetPos: this.actor.getPosition(),
      actor: this.actor,
      game: this.game,
      energyCost: 0,
      interrupt: false,
    }).perform()
  }

  actorIsInEngine () {
    return this.actor.game.engine.actors.find((actor) => actor.id === this.actor.id) !== undefined
  }

  isProjectileType () {
    return this.actor.entityTypes.includes('DIRECTIONAL_PROJECTING')
  }

  // Version 1, workin on DirectionalProjecting
  // start () {
  //   super.start()
  //   // change actor renderer
  //   this['actor_background'] = this.actor.renderer.background;
  //   // this['actor_color'] = this.actor.renderer.color;
  //   this.actor.renderer.background = COLORS.orange;
  //   this.actor.direction = this.direction

  //   // add actor to engine if not
  //   if (this.actor.game.engine.actors.find((actor) => actor.id === this.actor.id) === undefined) {
  //     new PlaceActor({
  //       entity: this.actor,
  //       targetPos: this.actor.getPosition(),
  //       actor: this.actor,
  //       game: this.game,
  //       energyCost: 0,
  //     }).perform()
  //   }
  // }

  // step () {
  //   super.step()
  // }

  // stop () {
  //   super.stop()
  //   // change actor renderer back
  //   this.actor.renderer.background = this['actor_background'];
  //   // this.actor.renderer.color = this['actor_color'];
  // }
}