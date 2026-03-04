import { Base } from '../../../StatusEffects/Base.js';
import { DIRECTIONS, ENERGY_THRESHOLD, getDirectionKey } from '../../../constants.js';
import { COLORS } from '../theme.js';
import { PlaceActor } from '../../../Actions/PlaceActor.js';
import { getPositionInDirection } from '../../../../helper.js';
import SpatterEmitter from '../../../Engine/Particle/Emitters/spatterEmitter.js';
import { ANIMATION_TYPES } from '../../../Display/konvaCustom.js';

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
    this['actor_character'] = this.actor.renderer.character;
    this['actor_sprite'] = this.actor.renderer.sprite;
    this['actor_background'] = this.actor.renderer.background;
    this.startDirectionIndicator()
    this.actor.renderer.background = COLORS.blue;
    if (!this.actorIsInEngine() && this.isProjectileType()) {
      this.setProjectileStats();
      this.addActor();
    }
  }

  step () {
    super.step()
    // move in direction
    if (!this.isProjectileType()) {
      for (let index = 0; index < this.range; index++) {
        const targetPos = this.actor.getPosition()
        this.actor.move(getPositionInDirection(targetPos, this.direction))
      }

      // const targetPos = this.actor.getPosition()
      // this.actor.move(getPositionInDirection(targetPos, this.direction))
      // this.actor.move(getPositionInDirection(targetPos, this.direction))
      // console.log(this.timeToLive);
      // this.timeToLive -= 100
    }

    this.runParticleEffects()
  }

  stop () {
    super.stop()
    // change actor renderer back
    this.stopDirectionIndicator()
    this.actor.renderer.background = this['actor_background'];
  }

  startDirectionIndicator () {
    this.actor.renderer.character = this.directionalSprite();
    this.actor.renderer.sprite = this.directionalSprite();
  }

  stopDirectionIndicator () {
    this.actor.renderer.character = this['actor_character'];
    this.actor.renderer.sprite = this['actor_sprite'];
  }

  directionalSprite () {
    const directionKey = getDirectionKey(this.direction)
    return {
      'N': '↑',
      'NE': '↗',
      'W': '←',
      'NW': '↖',
      'SW': '↙',
      'S': '↓',
      'SE': '↘',
      'E': '→',
    }[directionKey]
  }

  runParticleEffects () {
    SpatterEmitter({
      game: this.game,
      fromPosition: this.actor.getPosition(),
      spatterAmount: .3,
      spatterRadius: 3,
      animationTimeStep: 0.9,
      transfersBackground: false,
      spatterColors: [COLORS.blue, COLORS.dark_accent],
    }).start()
  }

  addActor () {
    new PlaceActor({
      entity: this.actor,
      targetPos: this.actor.getPosition(),
      actor: this.actor,
      game: this.game,
      energyCost: 0,
      interrupt: false,
      forcePlacement: true,
    }).perform()
  }

  setProjectileStats() {
    this.actor.direction = this.direction;
    this.actor.range = this.range;
    // this.actor.durability = this.range;
    this.actor.speed = ENERGY_THRESHOLD;
  }

  actorIsInEngine () {
    return this.actor.game.engine.actors.find((actor) => actor.id === this.actor.id) !== undefined
  }

  isProjectileType () {
    return this.actor.entityTypes.includes('DIRECTIONAL_PROJECTING') || this.actor.entityTypes.includes('DIRECTIONAL_PUSHING')
  }
}