// import deps
import * as Constant from '../constants';
import { COLORS as HIDDEN_LEAF_COLORS } from '../Modes/HiddenLeaf/theme';
import { Player } from '../Entities/index';
import { ContainerSlot } from '../Entities/Containing';
import {ChakraResource} from '../Actions/ActionResources/ChakraResource';
import {Say} from '../Actions/Say';
import {MoveOrAttack} from '../Actions/MoveOrAttack';
import {PrepareDirectionalThrow} from '../Actions/PrepareDirectionalThrow';
import {OpenInventory} from '../Actions/OpenInventory';
import {OpenDropInventory} from '../Actions/OpenDropInventory';
import {PickupRandomItem} from '../Actions/PickupRandomItem';
import { checkIsWalkingOnWater, checkIsWalkingOnFire } from '../Modes/HiddenLeaf/StatusEffects/helper';
import { ExplodingTag } from '../Modes/HiddenLeaf/Items/Weapons/ExplodingTag';
import { PrepareSubstitution } from '../Actions/PrepareSubstitution';
import { PrepareRangedAction } from '../Actions/PrepareRangedAction';
import { AddStatusEffectAtPosition } from '../Actions/AddStatusEffectAtPosition';
import GradientPathEmitter from '../Engine/Particle/Emitters/gradientPathEmitter';
import ShadowHold from '../StatusEffects/ShadowHold';

const portrait =  `${window.PUBLIC_URL}/hidden_leaf/shikamaru.png`;
const basicInfo = {
  name: 'Shikamaru',
  description: 'The master strategist',
  renderer: {
    character: 'S',
    color: HIDDEN_LEAF_COLORS.shikamaru_alt,
    background: HIDDEN_LEAF_COLORS.shikamaru,
    portrait,
    basePortrait: portrait,
    damageFlashPortrait: `${window.PUBLIC_URL}/hidden_leaf/white.png`,
  },
  abilities: [
    {
      name: 'Sub. Jutsu',
      description: 'You were never there.',
    },
    {
      name: 'Exploding Tags',
      description: 'Throws an exploding tag in the direction of the target.',
    },
    {
      name: 'Shadow Hold',
      description: 'Bind your opponent with the Nara Clan\'s jutsu.',
    },
  ],
  speedRating: 2,
  durabilityRating: 1,
  chakraRating: 2,
  speed: 500,
  durability: 4,
  charge: 7,
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
        return new MoveOrAttack({
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
        return new MoveOrAttack({
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
        return new MoveOrAttack({
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
        return new MoveOrAttack({
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
      l: () => new PrepareRangedAction({
        label: 'Shadow Hold',
        game: engine.game,
        actor,
        range: 5,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources: [],
        keymapTriggerString: 'l',
        // cursorShape: Constant.CLONE_PATTERNS.smallSquare,
        actionClass: AddStatusEffectAtPosition,
        actionParams: {
          effect: new ShadowHold({ game: engine.game, turnsStunned: 3 }),
          label: 'Shadow Hold',
          onSuccess: () => {
            GradientPathEmitter({
              game: engine.game,
              fromPosition: actor.getPosition(),
              targetPositions: actor.getCursorPositions(),
              animationTimeStep: 0.8,
              // animationTimeStep: 0.1,
              // transfersBackground: true,
              backgroundColorGradient: [HIDDEN_LEAF_COLORS.black, HIDDEN_LEAF_COLORS.black],
              character: '',
            }).start()
          }
        }
      }),
      f: () => new PrepareDirectionalThrow({
        label: 'Exploding Tag',
        projectileType: 'exploding tag',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
      }),
      r: () => new PrepareSubstitution({
        label: 'Substitution',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources: [new ChakraResource({ getResourceCost: () => 1 })]
      }),
      i: () => new OpenInventory({
        label: 'Inventory',
        game: engine.game,
        actor,
      }),
      // o: () => new OpenEquipment({
      //   label: 'Equipment',
      //   game: engine.game,
      //   actor,
      // }),
      u: () => new OpenDropInventory({
        label: 'Drop Items',
        game: engine.game,
        actor,
      }),
      g: () => new PickupRandomItem({
        label: 'Pickup',
        game: engine.game,
        actor,
        attemptEquip: true,
      }),
      // h: () => null,
    };
  }
  // instantiate class
  let actor = new Player({
    pos: { x: 23, y: 7 },
    renderer: basicInfo.renderer,
    name: 'Shikamaru',
    faction: 'SHIKAMARU',
    // enemyFactions: ['ALL'],
    enemyFactions: ['OPPONENT'],
    faction: 'PLAYER',
    traversableTiles: ['WATER'],
    actions: [],
    speed: basicInfo.speed,
    durability: basicInfo.durability,
    charge: basicInfo.charge,
    game: engine.game,
    presentingUI: true,
    initializeKeymap: keymap,
  })

  // add default items to container
  // const swords = Array(2).fill('').map(() => Item.sword(engine));
  const tags = Array(2).fill('').map(() => ExplodingTag(engine, { ...actor.pos }));
  actor.container = [
    new ContainerSlot({
      itemType: tags[0].name,
      items: tags,
    }),
  ]

  return actor;
}

export default function () {
  return {
    basicInfo,
    initialize,
  }
}