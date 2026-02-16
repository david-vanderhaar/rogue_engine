import mitt from "mitt";
const GLOBAL_EVENT_BUS = mitt();

// GLOBAL_EVENT_BUS.on('*', (type, event) => {
//   console.log(`Event emitted: ${type}`, event);
// });

export {GLOBAL_EVENT_BUS};