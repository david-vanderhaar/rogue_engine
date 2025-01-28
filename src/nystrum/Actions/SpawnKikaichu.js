import { Base } from './Base';
import * as Helper from '../../helper';
import { Bandit, JacintoAI, ThrowableSpawner } from '../Entities';
import * as Behaviors from '../Entities/AI/Behaviors';
import { COLORS } from '../Modes/HiddenLeaf/theme';
import { ENERGY_THRESHOLD, CLONE_PATTERNS } from '../constants';
import SpatterEmitter from '../Engine/Particle/Emitters/spatterEmitter';
import { ChakraBleed } from '../Modes/HiddenLeaf/StatusEffects/ChakraBleed';

export class SpawnKikaichu extends Base {
  constructor({ cloneCount = 10, ...args }) {
    super({ ...args });
    this.cloneCount = cloneCount;
  }

  animateSmoke(positions) {
    // emitter smoke puff effect for each spawn position
    positions.forEach((position) => {
      SpatterEmitter({
        game: this.game,
        fromPosition: position,
        spatterAmount: 0.3,
        spatterRadius: 3,
        animationTimeStep: 0.9,
        easingFunction: Helper.EASING.easeIn,
        transfersBackground: false,
        spatterColors: ['#495877']
      }).start()
    })
  }

  getSpawnPositions() {
    // get cloneCount number of positions at random within radius of actor
    const points = Helper.getPointsWithinRadius(this.actor.getPosition(), 10).filter((point) => {
      return this.game.canOccupyPosition(point, {passable: false})
    })

    const randomPoints = Helper.getNumberOfItemsInArray(this.cloneCount, points)
    return randomPoints
  }

  createSpawnStructure(positions) {
    return {
      x_offset: 0,
      y_offset: 0,
      positions,
    }
  }

  spawnedEntityClass() {
    return JacintoAI;
  }

  spawnedEntityOptions() {
    return {
      name: 'Kikaichu Swarm',
      game: this.game,
      renderer: {
        character: 's',
        color: this.actor.renderer.background,
        background: this.actor.renderer.color,
      },
      durability: 1,
      attackDamage: 1,
      behaviors: [
        new Behaviors.MoveTowardsEnemy({repeat: 3, maintainDistanceOf: 1, chainOnSuccess: true}),
        new Behaviors.MoveOrAttackTowardsEnemy({repeat: 1, maintainDistanceOf: 0}),
      ],
      faction: this.actor.faction,
      enemyFactions: this.actor.enemyFactions,
    }
  }

  createSpawner(positions) {
    return new ThrowableSpawner({
      game: this.game,
      name: 'Kikaichu',
      passable: true,
      renderer: {
        character: 'o',
        sprite: '',
        color: COLORS.base3,
        background: COLORS.base2,
      },
      attackDamage: 0,
      speed: ENERGY_THRESHOLD,
      energy: ENERGY_THRESHOLD,
      spawnStructure: this.createSpawnStructure(positions),
      spawnedEntityClass: this.spawnedEntityClass(),
      getSpawnedEntityOptions: this.spawnedEntityOptions.bind(this),
    })
  }

  perform() {
    const positions = this.getSpawnPositions()
    const spawner = this.createSpawner(positions)
    this.actor.game.placeActorOnMap(spawner)
    spawner.spawnEntities()
    this.animateSmoke(positions)
    spawner.destroy()
    return {
      success: true,
      alternative: null,
    };
  }
}
;
