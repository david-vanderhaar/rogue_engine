import GameEvent from "../Events/Event";
import {GLOBAL_EVENT_BUS} from "../Events/EventBus";

export default class Mission {
  constructor({
      name = 'Mission Name',
      description = 'Mission Description',
      wasTriggered = false,
      onTriggerEvents = [
        new GameEvent({name: 'missionTriggered', payload: { message: 'Here we go!' }})
      ],
      onCompleteEvents = [
        new GameEvent({name: 'missionCompleted', payload: { message: 'we\'re all done here!' }})
      ],
      eventToComplete = 'mission',
      timesToComplete = 1,
      timesCompleted = 0,
    }) {
    this.name = name;
    this.description = description;
    this.wasTriggered = wasTriggered;
    this.onTriggerEvents = onTriggerEvents;
    this.onCompleteEvents = onCompleteEvents;
    this.eventToComplete = eventToComplete;
    this.timesToComplete = timesToComplete;
    this.timesCompleted = timesCompleted;
  }

  trigger() {
    this.wasTriggered = true;
    this.onTriggerEvents.forEach(event => {
      // Emit each trigger event using the global event bus
      GLOBAL_EVENT_BUS.emit(event.name, event.payload);
    });
    // Listen for the event that will complete this mission
    GLOBAL_EVENT_BUS.on(this.eventToComplete, this.incrementTimesCompleted.bind(this));
  }

  triggered() {
    return this.wasTriggered;
  }

  complete() {
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
