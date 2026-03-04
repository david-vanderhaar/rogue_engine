import * as Constant from '../../constants';
import * as Helper from '../../../helper';
import * as Item from '../../items';
import * as MapHelper from '../../Maps/helper';
import * as EnemyActors from './Actors/Enemies';
import { generate as generateBuilding } from '../../Maps/generator';
import * as CoverGenerator from '../../Maps/coverGenerator';
import { Debris, Bandit, RangedBandit, FireSpread, JacintoAI } from '../../Entities/index';
import * as Behaviors from '../../Entities/AI/Behaviors';
import { MESSAGE_TYPE } from '../../message';
import { Mode } from '../default';
import SOUNDS from '../../sounds';
import { SOUNDS as HIDDEN_LEAF_SOUNDS } from './sounds';
import * as _ from 'lodash';
import { TILE_KEY } from './theme';
import SpatterEmitter from '../../Engine/Particle/Emitters/spatterEmitter';
import { buffAICharacterStats, onDecreaseDurabilitySound } from './Characters/Utilities/characterHelper';
import { GLOBAL_EVENT_BUS } from '../../Events/EventBus';
import MissionManager from '../../Mission/MissionManager';
import Mission from '../../Mission/Mission';
import { SCREENS } from './Screen/constants';
import GenerateDefaultMap from './Maps/DefaultMap';
import GenerateLabMap from './Maps/LabMap';

export class Telekinetic extends Mode {
  constructor({ ...args }) {
    super({ ...args });
    this.tileKey = TILE_KEY
  }

  initialize (meta) {
    this['meta'] = meta;
    super.initialize();

    const level = this.getMetaTournamentLevel();
    this.levelGenerators()[level - 1](this);

    this.applyUpgrades()
  }

  levelGenerators() {
    return [
      GenerateLabMap,
      GenerateDefaultMap,
    ]
  }

  applyUpgrades () {
    const upgrades = this.meta()?.upgrades || []
    console.log(upgrades);
    
    upgrades.forEach((upgrade) => {
      upgrade.activate(this.getPlayer())
    })
  }

  placePlayerAndSafeZone() {
    // place player start zone
    MapHelper.addTileZone(
      this.game.tileKey,
      { x: 28, y: 9 },
      4,
      4,
      'SAFE',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth
    );
    this.placePlayersInSafeZone();
  }

  addWalls(innerWalls = 4) {
    // outer walls
    MapHelper.addTileZoneRectUnfilled(
      this.game.tileKey,
      { x: 0, y: 0 },
      this.game.mapHeight,
      this.game.mapWidth,
      'WALL',
      this.game.map
    );

    // inner walls
    for (let index = 1; index <= innerWalls; index++) {
      MapHelper.addTileZoneRectUnfilled(
        this.game.tileKey,
        { x: index, y: index },
        this.game.mapHeight - (index * 2),
        this.game.mapWidth - (index * 2),
        'WALL',
        this.game.map
      );
    }
  }

  mapCenter() {
    return {x: Math.round(this.game.mapWidth / 2), y: Math.round(this.game.mapHeight / 2)}
  }

  startMissionManager() {
    const player = this.game.getFirstPlayer();
    const opp = this.getFirstEnemyActor();


    const firstMission = new Mission({
      name: 'First Blood',
      description: 'Attack your first opponent.',
      timesToComplete: 1,
      eventToComplete: `${player?.id}:attack:${opp?.id}`,
    })

    const secondMission = new Mission({
      name: 'Second Blood',
      description: 'Attack your first opponent.',
      timesToComplete: 3,
      eventToComplete: `${player?.id}:attack:${opp?.id}`,
    })

    this.initializeMissionManager({
      missions: [
        firstMission,
        secondMission,
        new Mission({
          name: 'Final Blow',
          description: 'Defeat your opponent.',
          timesToComplete: 1,
          eventToComplete: `${opp?.id}:destroy`,
          active: true,
          dependantMissions: [firstMission, secondMission],
        }),
      ],
    })
  }

  createEmptyLevel () {
    for (let i = 0; i < this.game.mapHeight; i ++) {
      for (let j = 0; j < this.game.mapWidth; j ++) {
        const key = `${j},${i}`
        let type = 'GROUND';
        MapHelper.addTileToMap({map: this.game.map, key, tileKey: this.tileKey, tileType: type})
      }
    }
  }

  getPlayers () {
    return this.game.engine.actors.filter((actor) => actor.entityTypes.includes('PLAYING'))
  }

  getPlayer () {
    return this.game.getFirstPlayer();
  }

  getEnemyActors() {
    return this.getPlayer().getEnemies()
  }

  getFirstEnemyActor() {
    const actors = this.getEnemyActors()
    if (actors.length) return actors.at(0)
    else return null
  }

  updateUI() {
    this.updateMissionUI();
  }

  updateMissionUI() {
    const missionManager = this.getMissionManager();
    const activeMissions = missionManager.getActiveMissions();
    this.createOrUpdateInfoBlock(
      'missions',
      {
        text: `${activeMissions.map(this.createMissionText).join("\n")}`,
      }
    )

    if (activeMissions.length === 0) {
      this.deleteInfoBlock('missions');
    }
  }

  createMissionText(mission) {
    const timesCompleted = mission.timesCompleted;
    const timesToComplete = mission.timesToComplete;
    return `${mission.name} - ${mission.description} | Progress: ${timesCompleted}/${timesToComplete}`;
  }

  update () {
    super.update();
    this.getMissionManager().process();
    this.updateUI();
    if (this.hasLost()) {
      this.onLose()
    } else if (this.hasWon()) {
      this.onWin()
    } else if (this.levelComplete()) {
      this.nextLevel();
      this.game.initializeGameData();
    }
  }

  onLose() {
    if (!this.data['hasLost']) {
      this.game.onLose();
      this.createOrUpdateInfoBlock('hasLost', {text: `${this.meta().tournament.player.name} is no more.`})
      this.createOrUpdateInfoBlock('hasLost_enter', {text: 'Press Enter to see your final score.'})
      this.addOnEnterListener(this.game.toLose);
    }
    this.data['hasLost'] = true;
  }

  onWin() {
    if (!this.data['hasWon']) {
      this.game.onWin();
      this.createOrUpdateInfoBlock('hasWon', {text: `${this.game.getFirstPlayer().name} has escaped the Corpo Hell. Live on and prosper.`})
      this.createOrUpdateInfoBlock('hasWon_enter', {text: 'Press Enter to see your final score.'})
      this.addOnEnterListener(this.game.toWin);
    }
    this.data['hasWon'] = true;
  }

  addOnEnterListener(callback) {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        // this.game.backToTitle()
        callback && callback();
        this.meta({})
        window.removeEventListener('keydown', handleKeyPress);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
  }

  //Extras
  nextLevel () {
    const metaData = this.meta()
    const tournament = metaData.tournament;
    tournament.currentRound += 1
    metaData.tournament = tournament;
    
    this.meta(metaData)
    this.game.setActiveScreen(SCREENS.ABILITY_SELECT);
  }

  getMetaTournamentLevel() {
    return this.meta().tournament.currentRound;
  }

  levelComplete () {
    return this.getMissionManager().allMissionsComplete();
    // return this.game.engine.actors.length === 1; 
  }

  hasWon () {
    const level = this.getMetaTournamentLevel()
    const maxLevel = this.levelGenerators().length
    // const maxLevel = this.meta().tournament.maxRounds;
    return this.levelComplete() && (level >= maxLevel);
  }

  hasLost () {
    let players = this.getPlayers()
    if (!players.length) return true;
    else if (players.length) {
      if (players[0].durability <= 0) {
        return true;
      }
    }
    return false;
  }

  placePlayersInSafeZone () {
    let players = this.getPlayers()
    const keys = Object.keys(this.game.map).filter((key) => this.game.map[key].type == 'SAFE');
    players.forEach((player) => {
      const key = keys.shift();
      if (key) {
        const position = {
          x: parseInt(key.split(',')[0]),
          y: parseInt(key.split(',')[1]),
        }
        player.move(position)
      }
    })
  }

  addEnemies(amount = 1, functionName = 'addRandom') {
    Helper.range(amount).forEach((index) => {
      let groundTiles = Object.keys(this.game.map).filter((key) => this.game.map[key].type === 'GROUND')
      let pos = Helper.getRandomInArray(groundTiles)
      return EnemyActors[functionName](
        this, 
        Helper.stringCoordsToObject(pos)
      )
    })
      
  }

  placeThrowables (number = 3) {
    let groundTiles = Object.keys(this.game.map).filter((key) => this.game.map[key].type === 'GROUND')
    for (let i = 0; i < number; i++) {
      let pos = Helper.getRandomInArray(groundTiles);
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      let throwable = Item.directionalBottle(this.game.engine, {x: posXY[0], y: posXY[1]} , null, 10)
      this.game.placeActorOnMap(throwable)
    }
  }

}
