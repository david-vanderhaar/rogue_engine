// import deps
import * as Constant from '../../../constants';
import * as Helper from '../../../../helper';
import { Player } from '../../../Entities/index';
import { ContainerSlot } from '../../../Entities/Containing';
import {Say} from '../../../Actions/Say';
import {MoveOrAttack} from '../../../Actions/MoveOrAttack';
import {PrepareLooking} from '../../../Actions/PrepareLooking';
import {PrepareDirectionalThrow} from '../../../Actions/PrepareDirectionalThrow';
import {PrepareRangedAttack} from '../../../Actions/PrepareRangedAttack';
import {PrepareCallReinforcements} from '../../../Actions/PrepareCallReinforcements';
import {PrepareAreaStatusEffect} from '../../../Actions/PrepareAreaStatusEffect';
import {OpenAvailableStatusEffects} from '../../../Actions/OpenAvailableStatusEffects';
import {OpenInventory} from '../../../Actions/OpenInventory';
import {OpenEquipment} from '../../../Actions/OpenEquipment';
import {OpenUpgrades} from '../../../Actions/OpenUpgrades';
import {OpenDropInventory} from '../../../Actions/OpenDropInventory';
import {Upgrade} from '../../../Entities/Upgradable';
import {PickupAllItems} from '../../../Actions/PickupAllItems';
import { Ammo } from '../../../Items/Pickups/Ammo';
import {COLORS} from '../../Jacinto/theme';
import * as TALL_GRASS_CONSTANT from '../../TallGrass/theme';
import { Reload } from '../../../Actions/Reload';
import { AddSandSkinStatusEffect } from '../../../Actions/AddSandSkinStatusEffect';
import {UpgradeResource} from '../../../Actions/ActionResources/UpgradeResource';
import { SandSkin } from '../../../StatusEffects/SandSkin';
import { MeleeDamageDebuff } from '../../../StatusEffects/MeleeDamageDebuff';
import { AddStatusEffect } from '../../../Actions/AddStatusEffect';
import { TakeAim } from '../../../StatusEffects/TakeAim';
import { MeleeDamage } from '../../../StatusEffects/MeleeDamage';
import { MoveTargetingCursor } from '../../../Actions/MoveTargetingCursor';
import { MoveTowards } from '../../../Actions/MoveTowards';
import { GoToPreviousKeymap } from '../../../Actions/GoToPreviousKeymap';
import { Lantern } from '../../../Items/Environment/Lantern';
import { Revolver } from '../Items/Weapons/Revolver';
import { Battery } from '../Items/Pickups/Battery';
import { LayGrass } from '../StatusEffects/LayGrass';
import { GlowStick, SuperGlowStick } from '../Items/Pickups/GlowSticks';
import { Grenade } from '../Items/Weapons/Grenade';


const portrait =  `${window.PUBLIC_URL}/hidden_leaf/kiba.png`;
const basicInfo = {
  name: 'Someone',
  description: 'Wolf Pack!',
  renderer: {
    character: 'K',
    color: TALL_GRASS_CONSTANT.COLORS.accent,
    background: TALL_GRASS_CONSTANT.COLORS.main,
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

function initialize(engine) {
  // define keymap
  const keymap = (engine, actor) => {

    function updateLookedAt() {
      const targets = Helper.getEntitiesByPosition({
        game: engine.game,
        position: actor.getPosition()
      })

      const targetExcludingSelf = targets.filter((target) => target.id !== actor.id) 
      engine.game.entityLog.setLookedAt(targetExcludingSelf)
    }

    function stepOnGrass () {
      const entities = Helper.getEntitiesByPositionByAttr({
        game: engine.game,
        position: actor.getPosition(),
        attr: 'name',
        value: 'tall grass', 
      })
      
      
      entities.forEach((entity) => {
        const effect = new LayGrass({
          game: engine.game,
          actor: entity,
          lifespan: Constant.ENERGY_THRESHOLD * 3,
          stepInterval: Constant.ENERGY_THRESHOLD
        })
        engine.addStatusEffect(effect);
      })
    }

    function handleMoveSuccess() {
      stepOnGrass()
      updateLookedAt()
    }

    return {
      Escape: () => new Say({
        label: 'Stay',
        message: 'standing still...',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
      }),
      e: () => new Say({
        label: 'Lantern Light +',
        message: 'you use the hand crank. the light burns brighter.',
        game: engine.game,
        actor,
        energyCost: Math.ceil(actor.speed / 100 / 2) * Constant.ENERGY_THRESHOLD,
        // energyCost: Constant.ENERGY_THRESHOLD * ,
        onSuccess: () => {
          lantern.incrementLightRange()
        },
      }),
      q: () => new AddStatusEffect({
        label: 'Steady Nerves',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD * 2,
        onSuccess: () => actor.setFear(0),
        effect: new TakeAim({
          buffValue: 10,
          game: engine.game,
          actor,
        }),
      }),
      // q: () => new Say({
      //   label: 'Dim',
      //   message: 'you crank the knob left. the light dims.',
      //   game: engine.game,
      //   actor,
      //   energyCost: Constant.ENERGY_THRESHOLD,
      //   onSuccess: () => {
      //     lantern.lightRange -= 1
      //   },
      // }),
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
          onSuccess: handleMoveSuccess,
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
          onSuccess: handleMoveSuccess,
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
          onSuccess: handleMoveSuccess,
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
          onSuccess: handleMoveSuccess,
        });
      },
      g: () => new PickupAllItems({
        label: 'Pickup',
        game: engine.game,
        actor,
      }),
      o: () => new OpenDropInventory({
        label: 'Drop Items',
        game: engine.game,
        actor,
      }),
      l: () => new PrepareLooking({
        label: 'Look',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources: [],
      }),
      f: () => new PrepareRangedAttack({
        label: 'Fire Weapon',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources: [],
      }),
      r: () => new Reload({
        label: 'Reload',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
      }),
      i: () => new OpenInventory({
        label: 'Inventory',
        game: engine.game,
        actor,
      }),
      p: () => new OpenEquipment({
        label: 'Equipment',
        game: engine.game,
        actor,
      }),
      t: () => new PrepareDirectionalThrow({ // add glow stick throwable?
        label: 'Grenade',
        projectileType: 'grenade',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
      }),
      mouseOver: (mousePosition) => {
        return new MoveTargetingCursor({
          hidden: true,
          actor: actor,
          game: engine.game,
          targetPos: mousePosition,
        })
      },
      mouseLeftButton: (mousePosition) => {
        return new MoveTowards({
          hidden: true,
          actor,
          game: engine.game,
          targetPos: mousePosition,
        })
      },
      mouseRightButton: (mousePosition) => {
        return new GoToPreviousKeymap({
          hidden: true,
          actor,
          game: engine.game,
        })
      },
    };
  }

  // instantiate class
  const durability = 5;
  let actor = new Player({
    pos: { x: 0, y: 7 },
    renderer: {
      sprite: '',
      character: '@',
      color: TALL_GRASS_CONSTANT.COLORS.white,
      background: TALL_GRASS_CONSTANT.COLORS.brown_sugar,
    },
    lightPassable: true,
    name: 'field agent',
    baseDescription: 'you, a C.C.C member stationed in the Layoria region.',
    speed: Constant.ENERGY_THRESHOLD * 3,
    durability,
    baseRangedAccuracy: 0,
    baseRangedDamage: 0,
    attackDamage: 1,
    equipment: Constant.EQUIPMENT_LAYOUTS.human(),
    game: engine.game,
    presentingUI: true,
    faction: 'PEOPLE',
    enemyFactions: ['MONSTER'],
    maxFearPoints: 10,
    initializeKeymap: keymap,
  })

  // add default items to container
  const primary = Revolver(engine, actor.getPosition());
  const lantern = Lantern({engine, lightRange: 6})
  const ammo = Helper.duplicate(4, () => Ammo(engine))
  const grenades = Array(1).fill('').map(() => Grenade(engine, actor.getPosition()));
  const glowSticks = Array(1).fill('').map(() => GlowStick(engine, actor.getPosition()))
  // const glowSticks = Array(1).fill('').map(() => SuperGlowStick(engine, actor.getPosition()))
  const batteries = Array(1).fill('').map(() => Battery());
  actor.container = [
    new ContainerSlot({
      itemType: ammo[0].name,
      items: ammo,
    }),
    new ContainerSlot({
      itemType: grenades[0].name,
      items: grenades,
    }),
    new ContainerSlot({
      itemType: batteries[0].name,
      items: batteries,
    }),
    new ContainerSlot({
      itemType: glowSticks[0].name,
      items: glowSticks,
    }),
  ]

  actor.equip(primary.equipmentType, primary);
  actor.equip(lantern.equipmentType, lantern);

  return actor;
}

export default function () {
  return {
    basicInfo,
    initialize,
  }
}