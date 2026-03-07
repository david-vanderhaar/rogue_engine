import { getTileAtPosition, getRandomInArray } from "../../../../helper";
import { ENERGY_THRESHOLD } from "../../../constants";
import { WalkingOnWater } from "./WalkingOnWater";
import { Burning } from "./Burning";
import { SOUNDS as HIDDEN_LEAF_SOUNDS } from "../../HiddenLeaf/sounds";
import Falling from "../../../StatusEffects/Falling";
import { ChakraBleed } from "./ChakraBleed";


export function checkIsWalkingOnWater (engine, actor, bleedStatusEffectClass = ChakraBleed) {
  if (engine.actorHasStatusEffect(actor.id, 'walking on water')) return;

  const tile = getTileAtPosition(engine.game, actor.getPosition())
  if (!tile) return;

  if (tile.type === 'WATER') {
    const effect = new WalkingOnWater({
      game: engine.game,
      actor,
      stepInterval: ENERGY_THRESHOLD,
      bleedStatusEffectClass,
    })
    engine.addStatusEffect(effect);
  }
}

export function checkIsWalkingOnFire (engine, actor) {
  if (engine.actorHasStatusEffect(actor.id, 'burning')) return;

  const tile = getTileAtPosition(engine.game, actor.getPosition())
  if (!tile) return;

  if (tile.type === 'BURNT') {
    const effect = new Burning({
      game: engine.game,
      actor,
      stepInterval: ENERGY_THRESHOLD,
    })
    engine.addStatusEffect(effect);
  }
}

export function checkIsWalkingOnFreeFall (engine, actor) {
  if (engine.actorHasStatusEffect(actor.id, 'falling')) return;

  const tile = getTileAtPosition(engine.game, actor.getPosition())
  if (!tile) return;

  if (tile.type === 'FREE_FALL') {
    const effect = new Falling({
      game: engine.game,
      actor,
      stepInterval: ENERGY_THRESHOLD,
    })
    engine.addStatusEffect(effect);
  }
}
