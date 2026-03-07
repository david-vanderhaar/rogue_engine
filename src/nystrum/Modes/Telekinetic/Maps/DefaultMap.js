import Mission from "../../../Mission/Mission";

export default function GenerateDefaultMap (mode) {
  mode.createEmptyLevel();
  mode.game.initializeMapTiles();

  mode.addWalls();
  mode.placePlayerAndSafeZone();
  // TODO: get from wave data
  mode.addEnemies(1, 'addRandom')
  mode.placeThrowables()
  // mode.startMissionManager()
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
        timesToComplete: 1,
        // eventToComplete: `${player?.id}:move:tileType:GROUND`,
        eventToComplete: `${player?.id}:move:tileType:FREE_FALL`,
      }),
    ]
  })
}