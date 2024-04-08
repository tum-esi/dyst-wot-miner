import {
  structureType,
  loopType,
  interactionDir,
  interactionType,
} from "./enums";

declare namespace TrSD {
  type structureTransition = {
    source: string;
    destination: string;
    transitionLabel: string;
  };

  type structureIncomingInteraction = {
    stateLabel: number; //State whose incoming Interactions are recorded
    inStateLabel: number; //Incoming state label
    inStatePosition: number; //Position of incoming state in dfa array
  };
}

/*BASED ON: defs.d.ts file from system-description project*/
declare namespace SQSD {
  type mashupLogic = {
    name: string;
    root: structureEl[] | undefined;
    actions: { [k: string]: structureEl[] };
    functions: { [k: string]: structureEl[] };
    properties: { [k: string]: structureEl[] };
  };

  type structureEl =
    | structElWait
    | structElLoop
    | structElCondition
    | structElAtomic
    | structElGet
    | structElSet
    | structElRef;

  type structElWait = {
    type: structureType.wait;
    waitTime: number;
  };

  type structElLoop = {
    type: structureType.loop;
    content: structureEl[];
    loopOpts: loopOptions;
  };

  type loopOptions =
    | {
        type: loopType.timed;
        period: number;
      }
    | {
        type: loopType.logic;
        exCount: number | "forever";
      };

  type structElCondition = {
    type: structureType.case;
    content: structureEl[];
    elseContent?: structureEl[];
    condition: comparison;
  };

  type comparison =
    | {
        type: "var";
        variable: typeGetSet;
        value?: string | number | typeGetSet;
      }
    | {
        type: "not";
        not: comparison;
      }
    | {
        type: "all";
        allOf: comparison[];
      }
    | {
        type: "any";
        anyOf: comparison[];
      }
    | {
        type: "one";
        oneOf: comparison[];
      };

  type structElAtomic = {
    type: structureType.interact;
    receiveIntrcts: interactionReceive[];
    sendIntrcts: interactionSend[];
    breakOnDataPushed: boolean;
  };
  type interactionAll = interactionReceive | interactionSend;
  type interactionReceive = interactionProto & {
    direction: interactionDir.receive;
    type:
      | interactionType.observe
      | interactionType.invoke //No invoke actions as a receive interaction
      | interactionType.read
      | interactionType.subscribe;
    set?: {
      type: "variable" | "property";
      name: string;
    };
  };

  type interactionSend = interactionProto & {
    direction: interactionDir.send;
    type: interactionType.invoke | interactionType.write;
    get?: {
      type: "variable" | "property";
      name: string;
    };
    defaultInput?: typeDefaultInput;
  };
  type interactionProto = {
    to: string;
    name: string;
    formRef?: number;
  };

  type structElGet = {
    type: structureType.get;
    get: typeGetSet;
  };

  type structElSet = {
    type: structureType.set;
    set: typeGetSet;
    get?: typeGetSet;
    defaultInput?: any;
  };

  type structElRef = {
    type: structureType.ref;
    ref: {
      type: "action" | "function";
      name: string;
    };
  };
  type typeGetSet = {
    type: "variable" | "property";
    name: string;
  };

  type typeDefaultInput = boolean | number | string;
  type typeOutput = number | string | { $ref: string };

  type ofWord = { allOf: ifWord[] } | { oneOf: ifWord[] } | { anyOf: ifWord[] };
  type ifWord =
    | ofWord
    | { not: ifWord }
    | { get: { $ref: string }; output?: typeOutput };
}
