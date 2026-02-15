import BehaviorChain from "./BehaviorChain";
import * as Behaviors from '../Behaviors';
import SpatterEmitter from '../../../Engine/Particle/Emitters/spatterEmitter';
import { WindSlice } from '../../../Modes/HiddenLeaf/Items/Weapons/WindSlice';
import { COLORS as HIDDEN_LEAF_COLORS } from '../../../Modes/HiddenLeaf/theme';
import { CLONE_PATTERNS } from "../../../constants";

export default class FollowAndThrowProjectile extends BehaviorChain {
  constructor({ ...args }) {
    super(args);
  }

  behaviors() {
    return [
      new Behaviors.MoveTowardsEnemy({
        repeat: 4,
        maintainDistanceOf: 6,
        chainOnFail: true
      }),
      // TODO: add normal clover shape telegraph for throwing projectile
      // new Behaviors.TelegraphPathTowards({
      //   repeat: 1,
      //   attribute: 'faction',
      //   attributeValue: 'PLAYER',
      //   targetRange: 8,
      //   detectionRange: 20,
      //   // attackPattern: Constant.CLONE_PATTERNS.clover,
      //   // chainOnSuccess: true
      // }),
      // new Behaviors.TelegraphPattern({
      //   repeat: 1,
      //   attackPattern: CLONE_PATTERNS.clover,
      //   chainOnSuccess: true
      // }),
      // new Behaviors.ExecutePlaceActor({
      //   repeat: 1,
      //   getItem: (engine, position) => WindSlice(engine, position, null, 6),
      //   extraActionParams: {
      //     onSuccess: ({actor}) => {
      //         const spatterEmitter = SpatterEmitter({
      //         game: actor.game,
      //         fromPosition: actor.getPosition(),
      //         spatterRadius: 2,
      //         spatterAmount: 0.8,
      //         spatterDirection: { x: 0, y: 0 },
      //         spatterColors: [
      //           HIDDEN_LEAF_COLORS.wraps,
      //           HIDDEN_LEAF_COLORS.temari,
      //         ],
      //         animationTimeStep: 0.1,
      //         transfersBackground: false,
      //         transfersBackgroundOnDestroy: false,
      //       })
      //       spatterEmitter.start()
      //     }
      //   }
      // }),
      new Behaviors.TelegraphPattern({
        repeat: 1,
        attackPattern: CLONE_PATTERNS.point_west,
        chainOnSuccess: true
      }),
      new Behaviors.ExecutePlaceActor({
        chainOnSuccess: true,
        repeat: 1,
        getItem: (engine, position) => WindSlice(engine, position, [-1, 0], 6),
        extraActionParams: {
          onSuccess: ({actor}) => {
              const spatterEmitter = SpatterEmitter({
              game: actor.game,
              fromPosition: actor.getPosition(),
              spatterRadius: 2,
              spatterAmount: 0.8,
              spatterDirection: { x: 0, y: 0 },
              spatterColors: [
                HIDDEN_LEAF_COLORS.wraps,
                HIDDEN_LEAF_COLORS.temari,
              ],
              animationTimeStep: 0.1,
              transfersBackground: false,
              transfersBackgroundOnDestroy: false,
            })
            spatterEmitter.start()
          }
        }
      }),
      new Behaviors.TelegraphPattern({
        repeat: 1,
        attackPattern: CLONE_PATTERNS.point_north,
        chainOnSuccess: true
      }),
      new Behaviors.ExecutePlaceActor({
        chainOnSuccess: true,
        repeat: 1,
        getItem: (engine, position) => WindSlice(engine, position, [0, -1], 6),
        extraActionParams: {
          onSuccess: ({actor}) => {
              const spatterEmitter = SpatterEmitter({
              game: actor.game,
              fromPosition: actor.getPosition(),
              spatterRadius: 2,
              spatterAmount: 0.8,
              spatterDirection: { x: 0, y: 0 },
              spatterColors: [
                HIDDEN_LEAF_COLORS.wraps,
                HIDDEN_LEAF_COLORS.temari,
              ],
              animationTimeStep: 0.1,
              transfersBackground: false,
              transfersBackgroundOnDestroy: false,
            })
            spatterEmitter.start()
          }
        }
      }),
      new Behaviors.TelegraphPattern({
        repeat: 1,
        attackPattern: CLONE_PATTERNS.point_south,
        chainOnSuccess: true
      }),
      new Behaviors.ExecutePlaceActor({
        chainOnSuccess: true,
        repeat: 1,
        getItem: (engine, position) => WindSlice(engine, position, [0, 1], 6),
        extraActionParams: {
          onSuccess: ({actor}) => {
              const spatterEmitter = SpatterEmitter({
              game: actor.game,
              fromPosition: actor.getPosition(),
              spatterRadius: 2,
              spatterAmount: 0.8,
              spatterDirection: { x: 0, y: 0 },
              spatterColors: [
                HIDDEN_LEAF_COLORS.wraps,
                HIDDEN_LEAF_COLORS.temari,
              ],
              animationTimeStep: 0.1,
              transfersBackground: false,
              transfersBackgroundOnDestroy: false,
            })
            spatterEmitter.start()
          }
        }
      }),
      new Behaviors.TelegraphPattern({
        repeat: 1,
        attackPattern: CLONE_PATTERNS.point_east,
        chainOnSuccess: true
      }),
      new Behaviors.ExecutePlaceActor({
        chainOnSuccess: true,
        repeat: 1,
        getItem: (engine, position) => WindSlice(engine, position, [1, 0], 6),
        extraActionParams: {
          onSuccess: ({actor}) => {
              const spatterEmitter = SpatterEmitter({
              game: actor.game,
              fromPosition: actor.getPosition(),
              spatterRadius: 2,
              spatterAmount: 0.8,
              spatterDirection: { x: 0, y: 0 },
              spatterColors: [
                HIDDEN_LEAF_COLORS.wraps,
                HIDDEN_LEAF_COLORS.temari,
              ],
              animationTimeStep: 0.1,
              transfersBackground: false,
              transfersBackgroundOnDestroy: false,
            })
            spatterEmitter.start()
          }
        }
      }),
      // execute place item
      new Behaviors.MoveAwayFromEnemy({
        repeat: 4,
        maintainDistanceOf: 6,
        chainOnFail: true
      }),
    ];
  }
}
