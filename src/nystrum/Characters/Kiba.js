// import deps
import * as Item from '../items';
import * as Constant from '../constants';
import { COLORS as HIDDEN_LEAF_COLORS } from '../Modes/HiddenLeaf/theme';
import { JacintoAI, Player } from '../Entities/index';
import { ContainerSlot } from '../Entities/Containing';
import {ChakraResource} from '../Actions/ActionResources/ChakraResource';
import {Say} from '../Actions/Say';
import {MoveOrAttackWithTileSound} from '../Actions/MoveOrAttackWithTileSound';
import {OpenInventory} from '../Actions/OpenInventory';
import {OpenDropInventory} from '../Actions/OpenDropInventory';
import {PickupRandomItem} from '../Actions/PickupRandomItem';
import { PrepareDirectionalAction } from '../Actions/PrepareDirectionalAction';
import SpatterEmitter from '../Engine/Particle/Emitters/spatterEmitter';
import GradientRadialEmitter from '../Engine/Particle/Emitters/gradientRadialEmitter';
import { calculateStraightPath, getDirectionFromOrigin, getPositionInDirection } from '../../helper';
import { TackleByRange } from '../Actions/TackleByRange';
import { checkIsWalkingOnFire, checkIsWalkingOnWater, } from '../Modes/HiddenLeaf/StatusEffects/helper';
import { AddStatusEffect } from '../Actions/AddStatusEffect';
import { WolfSpeed } from '../Modes/HiddenLeaf/StatusEffects/WolfSpeed';
import { PreparePlaceActorInDirection } from '../Actions/PreparePlaceActorInDirection';
import * as Behaviors from '../Entities/AI/Behaviors/index';
import { Attack } from '../Actions/Attack';
import { Move } from '../Actions/Move';
import { generatePlayerCharacterOptions } from '../Modes/HiddenLeaf/Characters/Utilities/characterHelper';

const portrait =  `${window.PUBLIC_URL}/hidden_leaf/kiba.png`;
const basicInfo = {
  name: 'Kiba',
  description: 'Wolf Pack!',
  renderer: {
    character: 'K',
    color: HIDDEN_LEAF_COLORS.kiba_alt,
    background: HIDDEN_LEAF_COLORS.kiba,
    portrait,
    basePortrait: portrait,
    damageFlashPortrait: `${window.PUBLIC_URL}/hidden_leaf/white.png`,
  },
  abilities: [
    {
      name: 'Fang Over Fang',
      description: 'A technique where the user spins rapidly to attack their opponent.',
    },
    {
      name: 'Wolf Speed',
      description: 'Tapping into the power of the wolf.',
    },
    {
      name: 'Summon Akamaru',
      description: 'Summoning his trusty companion.',
    },
  ],
  speedRating: 2,
  durabilityRating: 2,
  chakraRating: 2,
  speed: 400,
  durability: 5,
  charge: 6,
  portrait,
}

function initialize (engine) {
  function onAfterMoveOrAttack(enginee, actor) {
    checkIsWalkingOnWater(enginee, actor)
    checkIsWalkingOnFire(enginee, actor)
  }
  // define keymap
  const keymap = (engine, actor) => {
    return {
      'w,ArrowUp': () => {
        const direction = Constant.DIRECTIONS.N;
        let newX = actor.pos.x + direction[0];
        let newY = actor.pos.y + direction[1];
        return new MoveOrAttackWithTileSound({
          hidden: true,
          targetPos: { x: newX, y: newY },
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD,
          onAfter: () => onAfterMoveOrAttack(engine, actor),
        });
      },
      's,ArrowDown': () => {
        const direction = Constant.DIRECTIONS.S;
        let newX = actor.pos.x + direction[0];
        let newY = actor.pos.y + direction[1];
        return new MoveOrAttackWithTileSound({
          hidden: true,
          targetPos: { x: newX, y: newY },
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD,
          onAfter: () => onAfterMoveOrAttack(engine, actor),
        });
      },
      'a,ArrowLeft': () => {
        const direction = Constant.DIRECTIONS.W;
        let newX = actor.pos.x + direction[0];
        let newY = actor.pos.y + direction[1];
        return new MoveOrAttackWithTileSound({
          hidden: true,
          targetPos: { x: newX, y: newY },
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD,
          onAfter: () => onAfterMoveOrAttack(engine, actor),
        });
      },
      'd,ArrowRight': () => {
        const direction = Constant.DIRECTIONS.E;
        let newX = actor.pos.x + direction[0];
        let newY = actor.pos.y + direction[1];
        return new MoveOrAttackWithTileSound({
          hidden: true,
          targetPos: { x: newX, y: newY },
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD,
          onAfter: () => onAfterMoveOrAttack(engine, actor),
        });
      },
      p: () => new Say({
        label: 'Stay',
        message: 'standing still...',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
      }),
      Escape: () => new Say({
        label: 'Pass',
        message: 'pass turn...',
        game: engine.game,
        actor,
        energyCost: actor.energy,
      }),
      l: () => new PrepareDirectionalAction({
        label: 'Fang Over Fang',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD * (basicInfo.speed/100),
        passThroughRequiredResources: [new ChakraResource({ getResourceCost: () => 6 })],
        actionLabel: 'Fang Over Fang',
        actionClass: TackleByRange,
        positionsByDirection: (actor, direction) => {
          const pos = actor.getPosition();
          return Array(10).fill('').map((none, distance) => {
            if (distance > 0) {
              return getPositionInDirection(pos, direction.map((dir) => dir * (distance)))
            } else {
              return null;
            }
          }).filter((pos) => pos !== null);
        },
        actionParams: {
          additionalDamage: 3,
          range: 8,
          onAfter: () => {
            if (actor.energy <= 0) {
              GradientRadialEmitter({
                game: engine.game,
                fromPosition: actor.getPosition(),
                radius: 2,
                // wolf gray, white, and kiba red
                colorGradient: [HIDDEN_LEAF_COLORS.kiba, HIDDEN_LEAF_COLORS.kiba_alt, HIDDEN_LEAF_COLORS.white],
                backgroundColorGradient: [HIDDEN_LEAF_COLORS.white, HIDDEN_LEAF_COLORS.kiba, HIDDEN_LEAF_COLORS.kiba_alt],
              }).start()
            }
            SpatterEmitter({
              game: engine.game,
              fromPosition: actor.getPosition(),
              spatterAmount: 0.1,
              spatterRadius: 2,
              animationTimeStep: 0.6,
              transfersBackground: false,
              spatterColors: [HIDDEN_LEAF_COLORS.kiba_alt, HIDDEN_LEAF_COLORS.white],
            }).start()

            // find Akamaru in engine.actors
            // if found, move Akamaru to actor's position
            const akamaru = engine.game.engine.actors.find((actor) => actor.name === 'Akamaru');
            // find closest enemy to actor
            const closestEnemy = engine.game.engine.actors.filter((actor) => actor.faction === 'OPPONENT').sort((a, b) => {
              return a.distanceTo(actor) - b.distanceTo(actor)
            })[0];

            if (akamaru && closestEnemy) {
              const path = calculateStraightPath(closestEnemy.getPosition(), akamaru.getPosition());
              const targetPos = path.at(-1);

              const move = new Move({
                targetPos,
                game: engine.game,
                actor: akamaru,
                energyCost: 0,
              })

              move.perform()

              const attack = new Attack({
                targetPos,
                game: engine.game,
                actor: akamaru,
                energyCost: 0,
              })

              attack.perform()

              SpatterEmitter({
                game: engine.game,
                fromPosition: akamaru.getPosition(),
                spatterAmount: 0.1,
                spatterRadius: 2,
                animationTimeStep: 0.6,
                transfersBackground: false,
                spatterColors: [HIDDEN_LEAF_COLORS.kiba_alt, HIDDEN_LEAF_COLORS.white],
              }).start()
            }
          }
        }
      }),
      k: () => new AddStatusEffect({
        label: 'Wolf Speed',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
        requiredResources: [ new ChakraResource({ getResourceCost: () => 2 }) ],
        effect: new WolfSpeed({
          lifespan: Constant.ENERGY_THRESHOLD * 10,
          speedBuff: Constant.ENERGY_THRESHOLD * 2,
          damageBuff: 0,
          game: engine.game,
          actor,
        }),
      }),
      t: () => new PreparePlaceActorInDirection({
          label: 'Summon Akamaru',
          game: engine.game,
          actor,
          passThroughEnergyCost: Constant.ENERGY_THRESHOLD * 1,
          passThroughRequiredResources: [
            new ChakraResource({ getResourceCost: () => 4 }),
          ],
          actorClass: JacintoAI,
          actorParameters: {
            name: 'Akamaru',
            renderer: {
              character: 'a',
              color: HIDDEN_LEAF_COLORS.kiba_alt,
              background: HIDDEN_LEAF_COLORS.white,
            },
            durability: 4,
            attackDamage: 1,
            // speed: Constant.ENERGY_THRESHOLD * 6,
            behaviors: [
              // new Behaviors.MoveTowardsEnemy({repeat: 6, maintainDistanceOf: 0, chainOnSuccess: true}),
              new Behaviors.MoveTowardsEnemy({repeat: 6, maintainDistanceOf: 0, chainOnFail: true}),
              new Behaviors.MoveOrAttackTowardsEnemy({repeat: 1, maintainDistanceOf: 0, chainOnSuccess: true, chainOnFail: true}),
              new Behaviors.Wait({repeat: 1}),
            ],
            faction: actor.faction,
            enemyFactions: actor.enemyFactions,
          },
        }),
      i: () => new OpenInventory({
        label: 'Inventory',
        game: engine.game,
        actor,
      }),
      u: () => new OpenDropInventory({
        label: 'Drop Items',
        game: engine.game,
        actor,
      }),
      g: () => new PickupRandomItem({
        label: 'Pickup',
        game: engine.game,
        actor,
      }),
    };
  }
  // instantiate class
  let actor = new Player({
    ...generatePlayerCharacterOptions(basicInfo, engine, keymap),
  })

  // add default items to container
  // const kunais = Array(100).fill('').map(() => Item.directionalKunai(engine, { ...actor.pos }, null, 10));
  // const swords = Array(2).fill('').map(() => Item.sword(engine));
  // actor.container = [
  //   new ContainerSlot({
  //     itemType: kunais[0].name,
  //     items: kunais,
  //   }),
  //   new ContainerSlot({
  //     itemType: swords[0].name,
  //     items: swords,
  //   }),
  // ]

  // const katon = Katon(engine, actor.getPosition());
  // actor.addEquipmentSlot({type: katon.equipmentType})
  // actor.equip(katon.equipmentType, katon);
  return actor;
}

export default function () {
  return {
    basicInfo,
    initialize,
  }
}