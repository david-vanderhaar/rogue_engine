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
  constructor({ missions = [], onComplete = () => null, onLost = () => null }) {
    this.missions = missions;
    this.completed = [];
    this.onComplete = onComplete;
    this.onLost = onLost;
  }

  allMissionsComplete() {
    return this.missions.length === 0;
  }

  hasLost() {
    // if player dead
    return false;
  }

  process() {
    if (this.allMissionsComplete()) {
      // stop crank engine
      // show win overlay
      // check for input to restart the game
      console.log('all missions complete');
      this.onComplete();
      return;
    } else if (this.hasLost()) {
      // lose overlay
      // check for input to restart the game
      console.log('has lost');
      this.onLost();
      return;
    }

    const currentMission = this.missions[0];
    if (!currentMission.triggered()) {
      currentMission.trigger();
    } else if (currentMission.isCompleted()) {
      currentMission.complete();
      this.completed.push(this.missions.shift());
      console.log('missions remaining: ', this.missions.length);
    }
  }
}