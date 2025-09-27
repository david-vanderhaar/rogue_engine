// import deps
import * as Item from '../items';
import * as Constant from '../constants';
import { Player } from '../Entities/index';
import { ContainerSlot } from '../Entities/Containing';
import {ChakraResource} from '../Actions/ActionResources/ChakraResource';
import {Say} from '../Actions/Say';
import {MoveOrAttack} from '../Actions/MoveOrAttack';
import {PrepareSandWall} from '../Actions/SandWall';
import {PrepareDirectionalThrow} from '../Actions/PrepareDirectionalThrow';
import {PrepareSubstitution} from '../Actions/PrepareSubstitution';
import {SandPulse} from '../Actions/SandPulse';
import {AddSandSkinStatusEffect} from '../Actions/AddSandSkinStatusEffect';
import {OpenInventory} from '../Actions/OpenInventory';
import {OpenEquipment} from '../Actions/OpenEquipment';
import {OpenDropInventory} from '../Actions/OpenDropInventory';
import {CloneSelf} from '../Actions/CloneSelf';
import {PickupRandomItem} from '../Actions/PickupRandomItem';
import { checkIsWalkingOnFire, checkIsWalkingOnWater, playStepSoundByTile } from '../Modes/HiddenLeaf/StatusEffects/helper';

const portrait =  `${window.PUBLIC_URL}/hidden_leaf/gaara_full_01.png`;

const basicInfo = {
  name: 'Gaara',
  description: 'Some say he is a demon.',
  renderer: {
    character: 'G',
    color: Constant.THEMES.SOLARIZED.base2,
    background: Constant.THEMES.NARUTO.gaara,
    portrait,
    basePortrait: portrait,
    damageFlashPortrait: `${window.PUBLIC_URL}/hidden_leaf/white.png`,
  },
  abilities: [
    {
      name: 'Sand Wall',
      description: 'A technique where the user creates a wall of sand to protect themselves.',
    },
    {
      name: 'Sand Pulse',
      description: 'A technique where the user sends a wave of sand out in all directions.',
    },
    {
      name: 'Sand Skin',
      description: 'A technique where the user covers themselves in sand to protect themselves.',
    },
  ],
  speedRating: 1,
  durabilityRating: 3,
  chakraRating: 2,
  speed: 300,
  durability: 10,
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
        return new MoveOrAttack({
          hidden: true,
          targetPos: { x: newX, y: newY },
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD,
          onAfter: () => onAfterMoveOrAttack(engine, actor),
          onSuccess: () => playStepSoundByTile(actor),
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
          onSuccess: () => playStepSoundByTile(actor),
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
          onSuccess: () => playStepSoundByTile(actor),
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
          onSuccess: () => playStepSoundByTile(actor),
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
      l: () => new PrepareSandWall({
        label: 'Sand Wall',
        game: engine.game,
        actor,
        sandWallRequiredResources: [new ChakraResource({ getResourceCost: () => 1 })]
      }),
      r: () => new PrepareSubstitution({
        label: 'Substitution',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources: [new ChakraResource({ getResourceCost: () => 1 })]
      }),
      k: () => new SandPulse({
        label: 'Sand Pulse',
        game: engine.game,
        actor,
      }),
      h: () => new AddSandSkinStatusEffect({
        label: 'Sand Skin',
        game: engine.game,
        actor,
        requiredResources: [
          new ChakraResource({ getResourceCost: () => 2 }),
        ],
      }),
      c: () => new CloneSelf({
        label: 'Sand Clone',
        game: engine.game,
        actor,
        cloneArgs: [
          {
            attribute: 'renderer',
            value: { ...actor.renderer, background: '#A89078' }
          },
          {
            attribute: 'ignoredKeys',
            value: ['g'],
          },
        ],
        requiredResources: [
          new ChakraResource({ getResourceCost: () => 4 }),
        ],
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
      }),
      // t: () => new PrepareDirectionalThrow({
      //   label: 'Throw',
      //   game: engine.game,
      //   actor,
      //   passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
      // })
    };
  }
  // instantiate class
  let actor = new Player({
    pos: { x: 23, y: 7 },
    renderer: basicInfo.renderer,
    name: 'Gaara',
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

  return actor;
}

export default function () {
  return {
    basicInfo,
    initialize,
  }
}