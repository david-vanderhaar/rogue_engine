import { PickupItem } from "../../Actions/PickupItem";
import { EquipItem } from "../../Actions/EquipItem";
import { ENERGY_THRESHOLD } from '../../constants';
import { coordsToString, getRandomInArray } from '../../../helper';
import { MESSAGE_TYPE } from '../../message';

export const pickupRandom = (engine) => {
  let actor = engine.actors[engine.currentActor];
  let entities = engine.game.map[coordsToString(actor.pos)].entities.filter((e) => e.id !== actor.id);
  if (entities.length > 0) {
    actor.setNextAction(new PickupItem({
      item: getRandomInArray(entities),
      game: engine.game,
      actor,
      energyCost: ENERGY_THRESHOLD
    }));
  }
  else {
    console.log('nothing to pickup.');
  }
};

export const equipRandomFromTile = (engine) => {
  let actor = engine.actors[engine.currentActor];
  let entities = engine.game.map[coordsToString(actor.pos)].entities.filter((e) => e.id !== actor.id);
  if (entities.length > 0) {
    actor.setNextAction(new EquipItem({
      item: getRandomInArray(entities),
      game: engine.game,
      actor,
      energyCost: ENERGY_THRESHOLD
    }));
  }
  else {
    engine.game.addMessage(`nothing to equip.`, MESSAGE_TYPE.ACTION);
  }
};