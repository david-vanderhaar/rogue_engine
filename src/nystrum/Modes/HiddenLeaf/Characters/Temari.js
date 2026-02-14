// import deps
import * as Constant from '../../../constants';
import { COLORS as HIDDEN_LEAF_COLORS } from '../../../Modes/HiddenLeaf/theme';
import { Player } from '../../../Entities/index';
import { ContainerSlot } from '../../../Entities/Containing';
import {ChakraResource} from '../../../Actions/ActionResources/ChakraResource';
import {PrepareDirectionalThrow} from '../../../Actions/PrepareDirectionalThrow';
import SpatterEmitter from '../../../Engine/Particle/Emitters/spatterEmitter';
import { WindPush } from '../../../Modes/HiddenLeaf/Items/Weapons/WindPush';
import { WindSlice } from '../../../Modes/HiddenLeaf/Items/Weapons/WindSlice';
import { AddStatusEffect } from '../../../Actions/AddStatusEffect';
import { WindBursts } from '../../../Modes/HiddenLeaf/StatusEffects/WindBursts';
import { generateDefaultKeymapActions, generatePlayerCharacterOptions } from '../../../Modes/HiddenLeaf/Characters/Utilities/characterHelper';
import { SOUNDS } from '../sounds';
import BlitzerBehaviors from '../../../Entities/AI/Archetypes/BlitzerBehaviors';
import HitAndRunBehaviors from '../../../Entities/AI/Archetypes/HitAndRunBehaviors';
import { Katon } from '../Items/Weapons/Katon';

const portrait =  `${window.PUBLIC_URL}/hidden_leaf/temari.png`;

const speedRating = 2
const durabilityRating = 1
const chakraRating = 2

const basicInfo = {
  name: 'Temari',
  description: 'The Wind Ninja',
  renderer: {
    character: 'T',
    color: HIDDEN_LEAF_COLORS.temari_alt,
    background: HIDDEN_LEAF_COLORS.temari,
    portrait,
    basePortrait: portrait,
    damageFlashPortrait: `${window.PUBLIC_URL}/hidden_leaf/white.png`,
  },
  abilities: [
    {
      name: 'Wind Release',
      description: 'Summons a gust of wind in the direction of the target and pushes them away.',
    },
    {
      name: 'Wind Bursts',
      description: 'Summons short bursts of wind to speed up your movements and deflect attacks.',
    },
    {
      name: 'Wind Shuriken',
      description: 'Cuts through enemeies at range.',
    },
  ],
  speedRating,
  durabilityRating,
  chakraRating,
  speed: speedRating * 200,
  durability: durabilityRating * 3,
  charge: chakraRating * 3,
  chargeMax: chakraRating * 3,
  attackDamage: 1,
  portrait,
}

function initialize (engine) {

  async function summonSuccess(position, direction) {
    const spatterEmitter = SpatterEmitter({
      game: engine.game,
      fromPosition: position,
      spatterRadius: 5,
      spatterAmount: 0.8,
      spatterDirection: { x: direction[0], y: direction[1] },
      spatterColors: [
        HIDDEN_LEAF_COLORS.wraps,
        HIDDEN_LEAF_COLORS.temari,
      ],
      animationTimeStep: 0.1,
      transfersBackground: false,
      transfersBackgroundOnDestroy: false,
    })
    await spatterEmitter.start()
  }

  // define keymap
  const keymap = (engine, actor) => {
    return {
      ...generateDefaultKeymapActions(engine, actor),
      t: () => new PrepareDirectionalThrow({
        label: 'Wind Release',
        projectileType: 'wind push',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources: [new ChakraResource({ getResourceCost: () => 1 })],
        passThroughOnSuccess: ({direction}) => summonSuccess(actor.getPosition(), direction),
      }),
      f: () => new PrepareDirectionalThrow({
        label: 'Wind Slice',
        projectileType: 'wind slice',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources: [new ChakraResource({ getResourceCost: () => 3 })],
        passThroughOnSuccess: ({direction}) => summonSuccess(actor.getPosition(), direction),
      }),
      l: () => new AddStatusEffect({
        label: 'Wind Bursts',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
        effect: new WindBursts({
          game: engine.game,
          actor,
        }),
        onSuccess: () => SOUNDS.wind_slice.play(),
      }),
    };
  }
  // instantiate class
  let actor = new Player({
    ...generatePlayerCharacterOptions(basicInfo, engine, keymap),
  })

  const windPushes = Array(100).fill('').map(() => WindPush(engine, { ...actor.pos }));
  const windSlices = Array(100).fill('').map(() => WindSlice(engine, { ...actor.pos }, null, 10));
  actor.container = [
    new ContainerSlot({
      itemType: windPushes[0].name,
      items: windPushes,
      hidden: true,
    }),
    new ContainerSlot({
      itemType: windSlices[0].name,
      items: windSlices,
      hidden: true,
    }),
  ]

  return actor;
}

// a mock for AI behaviors
const behaviors = HitAndRunBehaviors(basicInfo);

export default function () {
  return {
    initialize,
    basicInfo: {behaviors, ...basicInfo},
  }
}