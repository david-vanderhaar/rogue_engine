import uuid from 'uuid/v1';
import {merge} from 'lodash';
import MissionManager from '../Mission/MissionManager';
import Mission from '../Mission/Mission';
import { GLOBAL_EVENT_BUS } from '../Events/EventBus';

export class Mode {
  constructor({
    game = null,
    data = {},
  }) {
    let id = uuid();
    this.id = id;
    this.game = game;
    this.data = data;
    this.missionManager = null;
    this.infoBlocks = {}
    this.progressBars = {}
  }

  initialize() {}

  update() {}

  createOrUpdateInfoBlock(id, value) {
    merge(this.infoBlocks, {[id]: value})
  }

  deleteInfoBlock(id) {
    delete this.infoBlocks[id];
  }

  initializeMissionManager({missions = [], onComplete = () => {}, onLost = () => {}, debug = false}) {
    GLOBAL_EVENT_BUS.all.clear();
    const missionManager = new MissionManager({
      missions,
      onComplete,
      onLost,
    })

    if (debug) {
      // to see all events
      GLOBAL_EVENT_BUS.on('*', (type, event) => {
        console.log(`Event emitted: ${type}`, event);
      });
    }

    this.setMissionManager(missionManager);
  }

  setMissionManager(missionManager) {
    this.missionManager = missionManager;
  }

  getMissionManager() {
    return this.missionManager;
  }
}