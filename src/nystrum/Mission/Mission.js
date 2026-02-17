import uuid from 'uuid/v1';
import GameEvent from "../Events/Event";
import {GLOBAL_EVENT_BUS} from "../Events/EventBus";

export default class Mission {
  constructor({
      name = 'Mission Name',
      description = 'Mission Description',
      wasTriggered = false,
      active = false,
      onTriggerEvents = [
        new GameEvent({name: 'missionTriggered', payload: { message: 'Here we go!' }})
      ],
      onCompleteEvents = [
        new GameEvent({name: 'missionCompleted', payload: { message: 'we\'re all done here!' }})
      ],
      eventToComplete = 'mission',
      timesToComplete = 1,
      timesCompleted = 0,
      dependantMissions = [],
    }) {
    this.id = uuid();
    this.name = name;
    this.description = description;
    this.wasTriggered = wasTriggered;
    this.active = active;
    this.onTriggerEvents = onTriggerEvents;
    this.onCompleteEvents = onCompleteEvents;
    this.eventToComplete = eventToComplete;
    this.timesToComplete = timesToComplete;
    this.timesCompleted = timesCompleted;
    this.dependantMissions = dependantMissions;
  }

  getActive() {
    return this.active;
  }

  trigger() {
    this.active = true;
    this.wasTriggered = true;
    this.onTriggerEvents.forEach(event => {
      // Emit each trigger event using the global event bus
      GLOBAL_EVENT_BUS.emit(event.name, event.payload);
    });
    // Listen for the event that will complete this mission
    GLOBAL_EVENT_BUS.on(this.eventToComplete, this.incrementTimesCompleted.bind(this));

    console.log('Mission triggered: ', this.name);
  }

  triggered() {
    return this.wasTriggered;
  }

  complete() {
    this.active = false;
    // Stop listening for the event that completes this mission
    GLOBAL_EVENT_BUS.off(this.eventToComplete, this.incrementTimesCompleted.bind(this));
    // Emit each completion event using the global event bus
    this.onCompleteEvents.forEach(event => {
      GLOBAL_EVENT_BUS.emit(event.name, event.payload);
    });

    console.log('Mission complete: ', this.name);
  }

  isCompleted() {
    return this.timesCompleted >= this.timesToComplete;
  }

  incrementTimesCompleted() {
    this.timesCompleted += 1;
  }
}
