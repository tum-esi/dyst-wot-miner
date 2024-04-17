// ----------------------------------
/**
 * - EXAMPLE ON HOW TO USE THE METHODS CREATED
 */

import generateFA from "./generateFA";
import generateRegex from "./generateRegex";
import generateMUlogic from "./generateMUlogic";

//Input: Traces and interactionList example 1
//messagePairId and timeStamp are not longer relevant, the order of interactions is shown in the traces array
let interactionList = [
  {
    interactionId: 1,
    operation: "readproperty",
    affordance: {
      type: "property",
      name: "waterStatus",
    },
    recipient: {
      type: "thing",
      thingId: "1",
      thingTitle: "VirtualCoffeeMachine",
    },
    messagePairId: 1,
    timeStamp: "2021-02-04T03:04:16.993552107Z",
  },
  {
    interactionId: 2,
    recipient: {
      type: "controller",
    },
    payload: "response",
    messagePairId: 1,
    timeStamp: "2021-02-04T03:04:16.993552107Z",
  },
  {
    interactionId: 3,
    operation: "writeproperty",
    affordance: {
      type: "property",
      name: "string",
    },
    recipient: {
      type: "thing",
      thingId: "2",
      thingTitle: "TestThing",
    },
    messagePairId: 2,
    timeStamp: "2021-02-04T03:04:16.993552107Z",
  },
  {
    interactionId: 4,
    operation: "subscribeevent",
    affordance: {
      type: "event",
      name: "maintenance",
    },
    recipient: {
      type: "thing",
      thingId: "1",
      thingTitle: "VirtualCoffeeMachine",
    },
    messagePairId: 3,
    timeStamp: "2021-02-04T03:04:16.993552107Z",
  },
  {
    interactionId: 5,
    recipient: {
      type: "controller",
    },
    payload: "data-pushed",
    messagePairId: 3,
    timeStamp: "2021-02-04T03:04:16.993552107Z",
  },
  {
    interactionId: 6,
    operation: "writeproperty",
    affordance: {
      type: "property",
      name: "int",
    },
    recipient: {
      type: "thing",
      thingId: "2",
      thingTitle: "TestThing",
    },
    messagePairId: 4,
    timeStamp: "2021-02-04T03:04:16.993552107Z",
  },
  {
    interactionId: 7,
    operation: "subscribeevent",
    affordance: {
      type: "event",
      name: "error",
    },
    recipient: {
      type: "thing",
      thingId: "1",
      thingTitle: "VirtualCoffeeMachine",
    },
    messagePairId: 5,
    timeStamp: "2021-02-04T03:04:16.993552107Z",
  },
  {
    interactionId: 8,
    recipient: {
      type: "controller",
    },
    payload: "data-pushed",
    messagePairId: 5,
    timeStamp: "2021-02-04T03:04:16.993552107Z",
  },
  {
    interactionId: 9,
    operation: "writeproperty",
    affordance: {
      type: "property",
      name: "bool",
    },
    recipient: {
      type: "thing",
      thingId: "2",
      thingTitle: "TestThing",
    },
    messagePairId: 6,
    timeStamp: "2021-02-04T03:04:16.993552107Z",
  },
  {
    interactionId: 10,
    operation: "readproperty",
    affordance: {
      type: "property",
      name: "coffeeStatus",
    },
    recipient: {
      type: "thing",
      thingId: "1",
      thingTitle: "VirtualCoffeeMachine",
    },
    messagePairId: 7,
    timeStamp: "2021-02-04T03:04:16.993552107Z",
  },
  {
    interactionId: 11,
    recipient: {
      type: "controller",
    },
    payload: "response",
    messagePairId: 7,
    timeStamp: "2021-02-04T03:04:16.993552107Z",
  },
  {
    interactionId: 12,
    operation: "writeproperty",
    affordance: {
      type: "property",
      name: "num",
    },
    recipient: {
      type: "thing",
      thingId: "2",
      thingTitle: "TestThing",
    },
    messagePairId: 8,
    timeStamp: "2021-02-04T03:04:16.993552107Z",
  },
];
//Order of interactions in each scenario (2 scenarios)
let traces = [
  [
    { interactionId: 1 },
    { interactionId: 2 },
    { interactionId: 3 },
    { interactionId: 1 },
    { interactionId: 2 },
    { interactionId: 3 },
    { interactionId: 4 },
    { interactionId: 5 },
    { interactionId: 6 },
    { interactionId: 10 },
    { interactionId: 11 },
    { interactionId: 12 },
  ],
  [
    { interactionId: 1 },
    { interactionId: 2 },
    { interactionId: 3 },
    { interactionId: 7 },
    { interactionId: 8 },
    { interactionId: 9 },
    { interactionId: 10 },
    { interactionId: 11 },
    { interactionId: 12 },
  ],
];

//Generate DFA
let dfa = generateFA(traces);
console.log(dfa)
//Generate Regular expression
let regex = generateRegex(dfa);
console.log(regex)
//Generate Mashup Logic
let outMashupLogic = generateMUlogic(regex, interactionList, traces);
console.log(outMashupLogic)