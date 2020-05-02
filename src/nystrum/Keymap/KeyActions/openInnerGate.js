import * as StatusEffect from '../../statusEffects';
import { AddStatusEffect } from "../../Actions/AddStatusEffect";

export const openInnerGate = (engine) => {
  let currentActor = engine.actors[engine.currentActor];
  let nextGate = currentActor.setNextGate();
  if (nextGate) {
    let effect = new StatusEffect.Base({
      game: engine.game,
      actor: currentActor,
      name: nextGate.name,
      lifespan: -1,
      stepInterval: 100,
      allowDuplicates: false,
      onStart: () => {
        currentActor.speed += nextGate.speedBuff;
        currentActor.energy += nextGate.speedBuff;
        currentActor.attackDamage += nextGate.damageBuff;
        currentActor.renderer.character = nextGate.character;
        console.log(`${currentActor.name} opened the ${nextGate.name}.`);
        currentActor.decreaseDurability(nextGate.durabilityDebuff);
        currentActor.decreaseDurability(0);
        console.log(`${currentActor.name} suffers ${nextGate.durabilityDebuff} damage from physical stress.`)
        let nextGateToLabel = currentActor.getNextGate();
        if (nextGateToLabel) {
          currentActor.keymap.o.label = nextGateToLabel.name;
        } else {
          delete currentActor.keymap.g;
        }
      },
    });
    currentActor.setNextAction(new AddStatusEffect({
      effect,
      actor: currentActor,
      game: engine.game,
      processDelay: 25,
      particleTemplate: {
        renderer: {
          color: '#3cc2bb',
          background: '#24fe88',
          character: '#'
        }
      }
    }));
  }
}