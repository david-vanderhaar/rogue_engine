import { CoverWall, Trap } from '../../../../Entities';
import { COLORS } from '../../theme'
import * as MapHelper from '../../../../Maps/helper';
import * as Helper from '../../../../../helper';

export function Foxhole(pos, game, size = 2) {
  placeFoxholeTiles(pos, size);
  placeBerms(game, pos, size);
}

function placeBerms(game, pos, size) {
  // get circle of tiles around pos
  Helper.getPointsOnCircumference(pos.x, pos.y, size).forEach((point) => {
    // create berm
    // place berm actor
    let berm = new CoverWall({
      pos: point,
      passable: true,
      renderer: {
        character: Helper.getRandomInArray([' ', '', '~']),
        sprite: '',
        color: COLORS.sand_2,
        background: COLORS.sand_1,
      },
      name: 'berm',
      game,
      durability: 1,
      accuracyModifer: -0.3,
      damageModifer: 0,
    })

    game.placeActorOnMap(berm)
  })
}

function placeFoxholeTiles(pos, size) {
  // add a random number of blobs of random size of GROUND
  // using addTileZone
  MapHelper.addTileZoneFilledCircle(
    pos,
    size + 1,
    'GROUND_SAND_HOLE_EDGE',
  );
  MapHelper.addTileZoneFilledCircle(
    pos,
    size,
    'GROUND_SAND_HOLE',
  );
}
