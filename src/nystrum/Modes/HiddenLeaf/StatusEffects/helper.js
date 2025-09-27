import { getTileAtPosition, getRandomInArray } from "../../../../helper";
import { ENERGY_THRESHOLD } from "../../../constants";
import { WalkingOnWater } from "./WalkingOnWater";
import { Burning } from "./Burning";
import { SOUNDS as HIDDEN_LEAF_SOUNDS } from "../../HiddenLeaf/sounds";

export function checkIsWalkingOnWater (engine, actor) {
  if (engine.actorHasStatusEffect(actor.id, 'walking on water')) return;

  const tile = getTileAtPosition(engine.game, actor.getPosition())
  if (!tile) return;

  if (tile.type === 'WATER') {
    const effect = new WalkingOnWater({
      game: engine.game,
      actor,
      stepInterval: ENERGY_THRESHOLD,
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
