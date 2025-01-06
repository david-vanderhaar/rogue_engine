import { getTileAtPosition } from "../../../../helper";
import { ENERGY_THRESHOLD } from "../../../constants";
import { WalkingOnWater } from "./WalkingOnWater";

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