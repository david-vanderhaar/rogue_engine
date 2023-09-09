import { getRandomInArray } from '../../../../../helper';
import { Trap } from '../../../../Entities';
import { DamageOnContact } from '../../../../StatusEffects/DamageOnContact';
import { HealOnContact } from '../../../../StatusEffects/HealOnContact';
import { COLORS } from '../../theme';

export const Brambles = (engine, pos, attackDamage = 1, useCount = 1) => {
  const trap = new Trap({
    game: engine.game,
    name: 'bramble bush',
    passable: true,
    lightPassable: false,
    pos,
    renderer: {
      character: getRandomInArray(["'", '.', '"', ',']),
      sprite: '',
      background: COLORS.sunset,
      color: COLORS.ebony,
    },
    enemyFactions: ['PEOPLE'],
  });

  const effect = new DamageOnContact({
    actor: trap,
    game: engine.game,
    damage: attackDamage,
    useCount,
    messageOnDamage: `brambles, beware. does ${attackDamage} damage.`,
    messageType: {
      color: COLORS.sunset,
      backgroundColor: COLORS.ebony,
    },
  })
  engine.addStatusEffect(effect);
  return trap
}

export const Berries = (engine, pos, healAmount = 1, useCount = 1) => {
  const trap = new Trap({
    game: engine.game,
    name: 'berry bush',
    baseDescriptor: 'hmm, berries. these weren\'t listed in the C.C.C. survial guide.',
    passable: true,
    lightPassable: false,
    pos,
    renderer: {
      character: getRandomInArray(["'", '.', '"', ',']),
      sprite: '',
      background: COLORS.sunset,
      color: COLORS.blue,
    },
    enemyFactions: ['PEOPLE'],
  });

  const effect = new HealOnContact({
    actor: trap,
    game: engine.game,
    value: healAmount,
    useCount,
    messageOnDamage: `you feel an intense surge of energy.`,
    messageType: {
      color: COLORS.sunset,
      backgroundColor: COLORS.blue,
    },
  })
  engine.addStatusEffect(effect);
  return trap
}