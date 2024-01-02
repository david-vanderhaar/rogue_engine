import { Base } from './Base';
import * as Helper from '../../helper';
import { Bandit, ThrowableSpawner } from '../Entities';
import { COLORS } from '../Modes/HiddenLeaf/theme';
import { ENERGY_THRESHOLD } from '../constants';


export class SpawnShadowClones extends Base {
  constructor({ cloneCount = 10, ...args }) {
    super({ ...args });
    this.cloneCount = cloneCount;
  }

  animateSmoke(positions) {
    // emitter smoke puff effect for each spawn position
  }

  getSpawnPositions() {
    // get cloneCount number of positions at random within radius of actor
    const points = Helper.getPointsWithinRadius(this.actor.getPosition(), 10)
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
    return Bandit;
  }

  targetEntity() {
    // get enemies in game
    const enemies = this.actor.game.engine.actors.filter(actor => {
      return this.actor.isEnemy(actor) && actor.id !== this.actor.id
    })

    const enemy = enemies.at(0)

    console.log(enemy);
    return enemy
  }

  spawnedEntityOptions() {
    return {
      renderer: {...this.actor.renderer},
      name: 'Shadow Clone',
      game: this.game,
      durability: 1,
      speed: 300,
      targetEntity: this.targetEntity(),
      // faction: this.actor.faction,
      enemyFactions: this.actor.enemyFactions,
    }
  }

  createSpawner(positions) {
    return new ThrowableSpawner({
      game: this.game,
      name: 'Shadow Clones',
      passable: true,
      renderer: {
        character: 'o',
        sprite: '',
        color: COLORS.base3,
        background: COLORS.base2,
      },
      position: this.actor.getPosition(),
      attackDamage: 0,
      speed: ENERGY_THRESHOLD,
      energy: ENERGY_THRESHOLD,
      spawnStructure: this.createSpawnStructure(positions),
      spawnedEntityClass: this.spawnedEntityClass(),
      spawnedEntityOptions: this.spawnedEntityOptions(),
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
