import Mission from "../../../Mission/Mission";
import * as MapHelper from '../../../Maps/helper';
import * as Helper from '../../../../helper';


export default function GenerateDefaultMap (mode) {
  mode.createEmptyLevel();
  mode.game.initializeMapTiles();

  const NUMBER_OF_POOLS = { min: 5, max: 6 }
  const INNER_MAP_DIMENSIONS = {x: 6, mx: 29, y: 5, my: 20}
  const SIZE_OF_POOLS = { min: 4, max: 5 }
  mode.addWalls();

  for (let i = NUMBER_OF_POOLS.min; i < NUMBER_OF_POOLS.max; i++) {
    let size = Helper.getRandomInt(SIZE_OF_POOLS.min, SIZE_OF_POOLS.max);
    let x = Helper.getRandomInt(INNER_MAP_DIMENSIONS.x + 2, INNER_MAP_DIMENSIONS.mx - 2);
    let y = Helper.getRandomInt(INNER_MAP_DIMENSIONS.y + 2, INNER_MAP_DIMENSIONS.my - 2);
    
    MapHelper.addTileZoneFilledCircle(
      { x, y },
      size,
      'WATER',
    );
  }



  mode.placePlayerAndSafeZone();
  // TODO: get from wave data
  // mode.addEnemies(3, 'addRandom')
  mode.addEnemiesByKey(3, 'office_2')
  mode.placeThrowables(30)
  startMissionManager(mode)

  window.addEventListener('keydown', (event) => {
    // on =, go to next
    if (event.key === 'Equals' || event.key === '=') {
      mode.nextLevel();
      // mode.game.initializeGameData();  
    }
  })
}

function startMissionManager(mode) {
  const player = mode.game.getFirstPlayer();

  mode.initializeMissionManager({
    missions: [
      new Mission({
        name: 'Don\'t Fall',
        description: 'Proceed to dark spaced tile, where the floor fell away. See what happens.',
        timesToComplete: 100,
        // eventToComplete: `${player?.id}:move:tileType:GROUND`,
        eventToComplete: `OPPONENT:destroy`,
        // eventToComplete: `${player?.id}:move:tileType:FREE_FALL`,
      }),
    ]
  })
}