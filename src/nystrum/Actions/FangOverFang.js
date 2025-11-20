import { calculateStraightPath, getPositionInDirection } from "../../helper";
import SpatterEmitter from "../Engine/Particle/Emitters/spatterEmitter";
import { Attack } from "./Attack";
import { Move } from "./Move";
import { PrepareDirectionalAction } from "./PrepareDirectionalAction";
import { TackleByRange } from "./TackleByRange";
import { COLORS as HIDDEN_LEAF_COLORS } from "../Modes/HiddenLeaf/theme";
import gradientRadialEmitter from "../Engine/Particle/Emitters/gradientRadialEmitter";


export class FangOverFang extends PrepareDirectionalAction {
  constructor({ additionalFangDamage = 3, fangRange = 8, ...args }) {
    super({ ...args });
    this.label = 'Fang Over Fang'
    this.actionLabel = 'Fang Over Fang'
    this.actionClass = TackleByRange
    this.additionalFangDamage = additionalFangDamage;
    this.fangRange = fangRange;
    this.positionsByDirection = this.positionsByDirection;
    this.actionParams = this.generateActionParams();
  }

  perform() {
    return super.perform();
  }

  positionsByDirection(actor, direction) {
    const pos = actor.getPosition();
    return Array(this.fangRange).fill('').map((none, distance) => {
      if (distance > 0) {
        return getPositionInDirection(pos, direction.map((dir) => dir * (distance)))
      } else {
        return null;
      }
    }).filter((pos) => pos !== null);
  }

  generateActionParams() {
    return {
      additionalDamage: this.additionalFangDamage,
      range: this.fangRange,
      onAfter: () => {
        if (this.actor.energy <= 0) {
          gradientRadialEmitter({
            game: this.game,
            fromPosition: this.actor.getPosition(),
            radius: 2,
            // wolf gray, white, and kiba red
            colorGradient: [HIDDEN_LEAF_COLORS.kiba, HIDDEN_LEAF_COLORS.kiba_alt, HIDDEN_LEAF_COLORS.white],
            backgroundColorGradient: [HIDDEN_LEAF_COLORS.white, HIDDEN_LEAF_COLORS.kiba, HIDDEN_LEAF_COLORS.kiba_alt],
          }).start()
        }

        SpatterEmitter({
          game: this.game,
          fromPosition: this.actor.getPosition(),
          spatterAmount: 0.1,
          spatterRadius: 2,
          animationTimeStep: 0.6,
          transfersBackground: false,
          spatterColors: [HIDDEN_LEAF_COLORS.kiba_alt, HIDDEN_LEAF_COLORS.white],
        }).start()

        // find Akamaru in engine.actors
        // if found, move Akamaru to actor's position
        const akamaru = this.game.engine.actors.find((actor) => actor.name === 'Akamaru');
        // find closest enemy to actor
        const closestEnemy = this.game.engine.actors.filter((actor) => actor.faction === 'OPPONENT').sort((a, b) => {
          return a.distanceTo(this.actor) - b.distanceTo(this.actor)
        })[0];

        if (akamaru && closestEnemy) {
          const path = calculateStraightPath(closestEnemy.getPosition(), akamaru.getPosition());
          const targetPos = path.at(-1);
          const move = new Move({
            targetPos,
            game: this.game,
            actor: akamaru,
            energyCost: 0,
          })

          move.perform()

          const attack = new Attack({
            targetPos,
            game: this.game,
            actor: akamaru,
            energyCost: 0,
          })

          attack.perform()

          SpatterEmitter({
            game: this.game,
            fromPosition: akamaru.getPosition(),
            spatterAmount: 0.1,
            spatterRadius: 2,
            animationTimeStep: 0.6,
            transfersBackground: false,
            spatterColors: [HIDDEN_LEAF_COLORS.kiba_alt, HIDDEN_LEAF_COLORS.white],
          }).start()
        }
      }
    }
  }
}