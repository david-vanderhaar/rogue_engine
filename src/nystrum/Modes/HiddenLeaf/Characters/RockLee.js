// import deps
import * as Constant from '../../../constants';
import { Player } from '../../../Entities/index';
import { MultiTargetAttack } from '../../../Actions/MultiTargetAttack';
import { PrepareTackle } from '../../../Actions/PrepareTackle';
import { AddOpenGatesStatusEffect } from '../../../Actions/AddOpenGatesStatusEffect';
import { AddStatusEffect } from '../../../Actions/AddStatusEffect';
import { RemoveWeights } from '../../../Modes/HiddenLeaf/StatusEffects/RemoveWeights';
import { DrunkenFist } from '../../../Modes/HiddenLeaf/StatusEffects/DrunkenFist';
import BlitzerBehaviors from '../../../Entities/AI/Archetypes/BlitzerBehaviors';
import { SOUNDS as HIDDEN_LEAF_SOUNDS } from '../../../Modes/HiddenLeaf/sounds';
import { generateDefaultKeymapActions, generatePlayerCharacterOptions, playRandomSoundFromArray } from '../../../Modes/HiddenLeaf/Characters/Utilities/characterHelper';
import GradientRadialEmitter from '../../../Engine/Particle/Emitters/gradientRadialEmitter';
import { COLORS as HIDDEN_LEAF_COLORS } from '../../../Modes/HiddenLeaf/theme';
import * as Helper from '../../../../helper';

const portrait = `${window.PUBLIC_URL}/hidden_leaf/rock_full_01.png`

const speedRating = 3;
const durabilityRating = 2;
const chakraRating = 0;

const basicInfo = {
  name: 'Rock Lee',
  description: 'A young ninja who can only use taijutsu.',
  renderer: {
    character: 'R',
    color: Constant.THEMES.SOLARIZED.base3,
    background: Constant.THEMES.NARUTO.rock_lee,
    portrait,
    basePortrait: portrait,
    damageFlashPortrait: `${window.PUBLIC_URL}/hidden_leaf/white.png`,
  },
  abilities: [
    {
      name: 'Leaf Whirlwind',
      description: 'A taijutsu technique where the user spins rapidly to attack surrounding enemies.',
    },
    {
      name: 'Flying Lotus',
      description: 'Use your speed to close the distance and attack your enemy.',
    },
    {
      name: 'Inner Gates',
      description: 'How many gates can you open before you die?',
    },
  ],
  speedRating,
  durabilityRating,
  chakraRating,
  speed: speedRating * 200,
  durability: durabilityRating * 3,
  charge: chakraRating * 3,
  chargeMax: chakraRating * 3,
  portrait,
}
  

function initialize (engine) {
  // define keymap
  const keymap = (engine, actor) => {
    return {
      ...generateDefaultKeymapActions(engine, actor),
      l: () => new PrepareTackle({
        label: 'Flying Lotus',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
      }),
      k: () => new AddStatusEffect({
        label: 'Remove Weights',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
        effect: new RemoveWeights({
          lifespan: Constant.ENERGY_THRESHOLD * 10,
          speedBuff: Constant.ENERGY_THRESHOLD * 10,
          damageBuff: -1,
          game: engine.game,
          actor,
        }),
        onSuccess: () => {
          HIDDEN_LEAF_SOUNDS.sand_wall_01.play()
          GradientRadialEmitter({
            game: engine.game,
            fromPosition: actor.getPosition(),
            radius: 3,
            animationTimeStep: 0.8,
            easingFunction: Helper.EASING.easeOut,
            colorGradient: [HIDDEN_LEAF_COLORS.wraps, HIDDEN_LEAF_COLORS.neji_alt],
            backgroundColorGradient: [HIDDEN_LEAF_COLORS.neji_alt, HIDDEN_LEAF_COLORS.wraps],
          }).start()
        }
      }),
      j: () => new AddStatusEffect({
        label: 'Sip Sake',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
        effect: new DrunkenFist({
          lifespan: Constant.ENERGY_THRESHOLD * 30,
          speedBuff: -Constant.ENERGY_THRESHOLD * 2,
          damageBuff: 3,
          game: engine.game,
          actor,
        }),
        onSuccess: () => { HIDDEN_LEAF_SOUNDS.bottle_open.play() }
      }),
      h: () => new MultiTargetAttack({
        label: 'Leaf Whirlwind',
        targetPositions: [
          {
            x: actor.pos.x - 1,
            y: actor.pos.y,
          },
          {
            x: actor.pos.x - 1,
            y: actor.pos.y - 1,
          },
          {
            x: actor.pos.x,
            y: actor.pos.y - 1,
          },
          {
            x: actor.pos.x + 1,
            y: actor.pos.y - 1,
          },
          {
            x: actor.pos.x + 1,
            y: actor.pos.y,
          },
          {
            x: actor.pos.x + 1,
            y: actor.pos.y + 1,
          },
          {
            x: actor.pos.x,
            y: actor.pos.y + 1,
          },
          {
            x: actor.pos.x - 1,
            y: actor.pos.y + 1,
          },
        ],
        game: engine.game,
        actor,
        energyCost: (Constant.ENERGY_THRESHOLD * 2),
        particleTemplate: Constant.PARTICLE_TEMPLATES.leaf,
        onSuccess: () => { HIDDEN_LEAF_SOUNDS.wind_slice.play() },
      }),
      g: () => new AddOpenGatesStatusEffect({
        label: 'Open Inner Gate',
        game: engine.game,
        actor,
        onSuccess: () => {
          playRandomSoundFromArray(
            ['sand_clone_01'],
            { rate: 1.4, volume: 0.4 }
          );
        },
        // requiredResources: [
        //   new ChakraResource({ getResourceCost: () => 2 }),
        // ],
      }),
    };
  }

  // instantiate class
  let actor = new Player({
    ...generatePlayerCharacterOptions(basicInfo, engine, keymap),
  })

  actor.traversableTiles = [];

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

  return actor
}

// a mock for AI behaviors
const behaviors = BlitzerBehaviors(basicInfo);

export default function () {
  return {
    initialize: initialize,
    basicInfo: {behaviors, ...basicInfo},
  }
}
