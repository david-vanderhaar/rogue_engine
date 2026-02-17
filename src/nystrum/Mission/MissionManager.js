// The MissionManager keeps track of the current missions, completed missions, 
// and handles the logic for when all missions are completed or when the player has lost.

// each individual mission is listening for a specific event a certain number of times
// once the event has been triggerd X number of times, the mission is complete
// when the mission is complete, it emits all of the onCompleteEvents for that mission, 
// and then the MissionManager moves on to the next mission in the list

// when the next mission is triggered, it emits all of the onTriggerEvents for that mission
// and starts listening for the eventToComplete event

// TODO come p with Event language that can handle:
// - actor peroforming an action (Attack, Move, etc)
// - actor performing an action on another actor (Attack Goblin, Heal Self, etc)
// - method run on specific actor
// - method run on type of actor

export default class MissionManager {
  constructor({ missions = [], onComplete = () => null }) {
    this.missions = missions;
    this.completed = [];
    this.onComplete = onComplete;
  }

  getAllMissions() {
    return [...this.missions, ...this.completed];
  }

  getNotStartedMissions() {
    return this.missions.filter(mission => !mission.getActive());
  }
  
  getActiveMissions() {
    return this.missions.filter(mission => mission.getActive());
  }

  getCompletedMissions() {
    return this.completed;
  }

  allMissionsComplete() {
    return this.missions.length === 0;
  }

  process() {
    if (this.allMissionsComplete()) {
      // stop crank engine
      // show win overlay
      // check for input to restart the game
      console.log('all missions complete');
      this.onComplete();
      return;
    }

    // this.processCurrentMission_v1();
    this.processCurrentMission_v2();
  }

  processCurrentMission_v1() {
    const currentMission = this.missions[0];
    if (!currentMission.triggered()) {
      currentMission.trigger();
    } else if (currentMission.isCompleted()) {
      currentMission.complete();
      this.completed.push(this.missions.shift());
      console.log('missions remaining: ', this.missions.length);
    }
  }

  processCurrentMission_v2() {
    const activeMissions = this.currentMissions();
    activeMissions.forEach(mission => {
      if (!mission.triggered()) {
        this.triggerMission(mission);
      } else if (mission.isCompleted()) {
        this.completeMission(mission);
        console.log('missions remaining: ', this.missions.length);
      }
    })
  }

  currentMissions() {
    // get all active missions, plus the first mission in the list
    // then filter out any duplicates
    if (this.missions.length > 0) {
      const activeMissions = this.missions.filter(mission => mission.getActive());
      if (activeMissions.find(m => m.id === this.missions[0].id)) {
        return activeMissions;
      } else {
        return [this.missions[0], ...activeMissions];
      }
    } else {
      return [];
    }
  }

  triggerMission(mission) {
    mission.trigger();
  }

  completeMission(mission) {
    mission.complete();
    this.completed.push(mission);
    this.missions = this.missions.filter(m => m !== mission);
    
    if (mission.dependantMissions.length > 0) {
      mission.dependantMissions.forEach(dependant => {
        const depMission = this.missions.find(m => m.id === dependant.id);
        if (depMission) {
          this.completeMission(depMission);
        }
      });
    }
  }
}