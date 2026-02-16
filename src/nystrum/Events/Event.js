class GameEvent {
  constructor({ name = 'eventName', payload = {} }) {
      this.name = name;
      this.payload = payload;
  }
}

export default GameEvent;

