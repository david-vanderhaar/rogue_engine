import * as Constant from '../../constants';
import * as Helper from '../../../helper';
import * as Item from '../../items';
import * as MapHelper from '../../Maps/helper';
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

export class Telekinetic extends Mode {
  constructor({ ...args }) {
    super({ ...args });
    this.tileKey = TILE_KEY
    this.data = {
      level: 0,
      highestLevel: null,
      turnCount: 0,
    };
    this.dataByLevel = [
      {
        enemies: Array(1).fill('addOpponent'),
      },
    ]
  }

  getTournamentOpponent () {
    const tournament = this.meta().tournament;
    const opponent = tournament.getCurrentOpponent();

    return opponent;
  }

  initialize (meta) {
    this['meta'] = meta;
    super.initialize();
    this.createEmptyLevel();
    this.game.initializeMapTiles();
    this.setWaveData();

    // outer walls
    MapHelper.addTileZoneRectUnfilled(
      this.game.tileKey,
      { x: 0, y: 0 },
      this.game.mapHeight,
      this.game.mapWidth,
      'WALL',
      this.game.map,
    );
    
    // inner walls
    const tiers = 4
    for (let index = 1; index <= tiers; index++) {
      MapHelper.addTileZoneRectUnfilled(
        this.game.tileKey,
        { x: index, y: index },
        this.game.mapHeight - (index*2),
        this.game.mapWidth - (index*2),
        'WALL',
        this.game.map,
      );
    }

    // place player start zone
    MapHelper.addTileZone(
      this.game.tileKey,
      { x: 28, y: 9 },
      4,
      4,
      'SAFE',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth,
    );
    this.placePlayersInSafeZone();
    this.placeEnemies()
    this.placeThrowables()

    this.startMissionManager();
  }

  startMissionManager() {
    const player = this.game.getFirstPlayer();
    const opp = this.getOpponentActor();


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

  getOpponentActor() {
    return this.game.engine.actors.find((actor) => actor.name === this.getTournamentOpponent().name)
  }

  updateUI() {
    // this.updatePlayerAP();
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

  updatePlayerAP() {
    _.each(this.getPlayers(), (player, index) => {
      const currentBlips = Math.floor(player.energy / 100);
      const maxBlips = Math.floor(player.speed / 100);
      const arr = [
        ...Array(currentBlips).fill(''),
        ...Array(maxBlips - currentBlips).fill('_'),
      ];
      this.createOrUpdateInfoBlock(`playerSpeed${player.id}`, { text: `${player.name} | AP: ${arr.join(' ')}` })
      // this.createOrUpdateInfoBlock(`playerSpeed`, { text: `AP: ${player.energy}/${player.speed}` })
    })
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
      this.setWaveData();
      this.game.initializeGameData();
    }
  }

  onLose() {
    if (!this.data['hasLost']) {
      this.game.onLose();
      this.createOrUpdateInfoBlock('hasLost', {text: `${this.meta().tournament.player.name} is down! Good luck next year.`})
      this.createOrUpdateInfoBlock('hasLost_enter', {text: 'Press Enter to see your final score.'})
      this.addOnEnterListener(this.game.toLose);
    }
    this.data['hasLost'] = true;
  }

  onWin() {
    if (!this.data['hasWon']) {
      this.game.onWin();
      this.addFireWorks();
      this.createOrUpdateInfoBlock('hasWon', {text: `${this.game.getFirstPlayer().name} has won the Chunin Tournament!`})
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

  addSingleCelebratoryDebris () {
    const position = Helper.getRandomPos(this.game.map).coordinates;
    this.addCelebratoryDebris(position);
  }

  addCelebratoryDebris (position) {
    SpatterEmitter({
      game: this.game,
      fromPosition: position,
      spatterAmount: .3,
      spatterRadius: 10,
      transfersBackground: false,
      spatterColors: ['#e9d679', '#673ab7', '#3fc072', '#e16264', '#67a1d7'],
    }).start()
  }

  addFireWorks () {
    // pick a range of random positions
    // then add celebratory debris to each on a timer
    const positions = Array(30).fill(null).map(() => Helper.getRandomPos(this.game.map).coordinates);

    positions.forEach((position) => {
      setTimeout(() => {
        this.addCelebratoryDebris(position);
      }, Helper.getRandomInt(0, 10000))
    })
  }
  
  //Extras
  nextLevel () {
    const metaData = this.meta()
    const tournament = metaData.tournament;
    const updatedTournament = tournament.advanceOneRound()
    metaData.tournament = updatedTournament;

    this.meta(metaData)
    this.game.game.setActiveScreen('Tournament');
  }

  getMetaTournamentLevel() {
    return this.meta().tournament.currentRound;
  }

  setWaveData () {
    const nextLevelData = this.dataByLevel[0];
    this.data = {...this.data, ...nextLevelData}
  }

  levelComplete () {
    return this.getMissionManager().allMissionsComplete();
    // return this.game.engine.actors.length === 1; 
  }

  hasWon () {
    const level = this.getMetaTournamentLevel()
    const maxLevel = this.meta().tournament.bracket.length - 1;
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

  addOpponent (pos) {
    let players = this.getPlayers()
    let targetEntity = players[0]
    // tournament opponent stats
    let stats = null;

    // TODO: fix, this.meta() is not a function error
    try {
      stats = this.getTournamentOpponent().basicInfo;
      stats = buffAICharacterStats(stats);
    } catch (error) {
      console.log(error);
    }
    // let entity = new stats.entityClass({
    // let entity = new Bandit({
    let entity = new JacintoAI({
      targetEntity,
      pos,
      renderer: stats.renderer,
      name: stats.name,
      game: this.game,
      actions: [],
      attackDamage: stats.attackDamage,
      durability: stats.durability,
      // durability: 100,
      speed: stats.speed,
      charge: 20,
      faction: 'OPPONENT',
      enemyFactions: ['PLAYER'],
      // onDecreaseDurability: () => onDecreaseDurabilitySound(),
      meleeSounds: [
        HIDDEN_LEAF_SOUNDS.punch_01,
        HIDDEN_LEAF_SOUNDS.punch_02,
        HIDDEN_LEAF_SOUNDS.punch_03,
        HIDDEN_LEAF_SOUNDS.punch_04,
        HIDDEN_LEAF_SOUNDS.punch_05,
        HIDDEN_LEAF_SOUNDS.punch_06,
        HIDDEN_LEAF_SOUNDS.punch_07,
        HIDDEN_LEAF_SOUNDS.punch_08,
      ],
      behaviors: stats?.behaviors || [
        new Behaviors.MoveTowardsEnemy({
          repeat: stats.speed/Constant.ENERGY_THRESHOLD,
          maintainDistanceOf: -1, // causes to move and attack in same turn if close enough
          chainOnFail: true
        }),
        new Behaviors.MoveAwayFromEnemy({
          repeat: stats.speed/Constant.ENERGY_THRESHOLD,
          maintainDistanceOf: 4, // causes to move and attack in same turn if close enough
          // chainOnFail: false,
        }),
      ],
      // directional projectile destruction breaks engine
      getProjectile: ({ pos, targetPos, direction, range }) => Item.directionalKunai(this.game.engine, { ...pos }, direction, range)
      // getProjectile: ({ pos, targetPos, direction, range }) => Item.kunai(game.engine, { ...pos }, { ...targetPos })
    })

    if (stats?.createEquipment) {
      stats.createEquipment(entity);
    }

    if (this.game.placeActorOnMap(entity)) {
      this.game.engine.addActor(entity);
      // this.game.draw();
    };
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

  placeEnemies () {
    let groundTiles = Object.keys(this.game.map).filter((key) => this.game.map[key].type === 'GROUND')
    this.data.enemies.forEach((enemyName) => {
      let pos = Helper.getRandomInArray(groundTiles);
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this[enemyName]({ x: posXY[0], y: posXY[1] });
    })
  }

  placeThrowables (number = 50) {
    let groundTiles = Object.keys(this.game.map).filter((key) => this.game.map[key].type === 'GROUND')
    for (let i = 0; i < number; i++) {
      let pos = Helper.getRandomInArray(groundTiles);
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      let throwable = Item.directionalBottle(this.game.engine, {x: posXY[0], y: posXY[1]} , null, 10)
      this.game.placeActorOnMap(throwable)
    }
  }

}
