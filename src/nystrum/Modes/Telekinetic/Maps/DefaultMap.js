export default function GenerateDefaultMap (mode) {
    mode.createEmptyLevel();
    mode.game.initializeMapTiles();

    mode.addWalls();
    mode.placePlayerAndSafeZone();
    // TODO: get from wave data
    mode.addEnemies(1, 'addRandom')
    mode.placeThrowables()
}