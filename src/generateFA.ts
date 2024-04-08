import { TrSD } from "../definitions/defs";

// ------------ Program -------------
/**
 * parses the input traces to a Deterministic Finite Automata (DFA)
 * @param traces. An array containing one array per execution escenario (trace)
 * @returns a reduced DFA
 */

export default function generateFA(traces) {
  let transitions: TrSD.structureTransition[] = [];
  var nfa = require("nfa-to-dfa");
  nfa.create("dfa");

  //Create states
  nfa.addState("·0·").initial();
  traces.forEach((trace) => {
    trace.forEach((interaction) => {
      let interactionId = "·" + interaction.interactionId + "·";
      nfa.addState(interactionId.toString());
    });
  });

  //Add transitions
  traces.forEach((trace) => {
    addInitialtransition(trace, nfa, transitions);
    addAlltransitions(trace, nfa, transitions);
  });

  //generate dfa from nfa
  let dfa = nfa.toDfa().toString();
  addFinalStateLabel(dfa);

  try {
    let dfareduced = reducedfa(dfa);
    return dfareduced;
  } catch (error) {
    console.error({ dfa });
    throw new Error("The dfa cannot be reduced " + error);
  }
}

//Function: Add transition from init state to first interaction of each trace
function addInitialtransition(
  trace,
  nfa,
  transitions: TrSD.structureTransition[]
) {
  let src = "·0·";
  let dst = "·" + trace[0].interactionId + "·";
  let label = "·" + trace[0].interactionId + "·";
  let initTransition: TrSD.structureTransition = {
    source: src,
    destination: dst,
    transitionLabel: label,
  };
  if (
    !transitions.some(
      (transition) =>
        JSON.stringify(transition) == JSON.stringify(initTransition)
    )
  ) {
    transitions.push(initTransition);
    nfa.addState(src).initial().goTo(dst, label);
  }
}
//Function: Add all the transitions
function addAlltransitions(
  trace,
  nfa,
  transitions: TrSD.structureTransition[]
) {
  for (let i = 0; i < trace.length; i++) {
    if (i + 1 < trace.length) {
      let src = "·" + trace[i].interactionId + "·";
      let dst = "·" + trace[i + 1].interactionId + "·";
      let label = "·" + trace[i + 1].interactionId + "·";
      let newTransition: TrSD.structureTransition = {
        source: src,
        destination: dst,
        transitionLabel: label,
      };
      if (
        transitions.some(
          (transition) =>
            JSON.stringify(transition) == JSON.stringify(newTransition)
        )
      ) {
        continue;
      }
      transitions.push(newTransition);
      nfa.addState(src).goTo(dst, label);
    }
  }
}
//Function: Add final state label
function addFinalStateLabel(dfa) {
  for (let i = 0; i < dfa.states.length; i++) {
    if (0 == dfa.states[i].transitions.length) {
      dfa.states[i].isFinal = true;
    }
  }
}
//Function: reduce dfa before creating a Regular expresion
function reducedfa(dfa) {
  for (let i = 0; i < dfa.states.length; i++) {
    let inInteractionsList = createIncomingList(dfa);
    for (let j = i; j < inInteractionsList.length; j++) {
      let inInteractionsListSingle = inInteractionsList[j].filter(
        (item) => item
      );
      let numberInInteractions = inInteractionsListSingle.length;
      let numerOutInteractions = dfa.states[i].transitions.length;
      if (0 == numberInInteractions) {
        continue;
      }
      let instateLabel = inInteractionsListSingle[0].inStateLabel;
      let stateDfaLabel = dfa.states[i].label;
      let stateListLabel = inInteractionsListSingle[0].stateLabel;

      if (!(stateDfaLabel == stateListLabel)) {
        continue;
      }
      if (1 == numberInInteractions && 1 == numerOutInteractions) {
        if (instateLabel == dfa.states[i].transitions[0].to) {
          continue;
        }
        let inStatePosition = inInteractionsListSingle[0].inStatePosition;
        for (
          let k = 0;
          k < dfa.states[inStatePosition].transitions.length;
          k++
        ) {
          let transitionK = dfa.states[inStatePosition].transitions[k];
          if (stateListLabel == transitionK.to) {
            let symbol = dfa.states[i].transitions[0].symbol[0];
            let newSymbol = symbol.substring(1);
            transitionK.symbol[0] += newSymbol;
            transitionK.to = dfa.states[i].transitions[0].to;
            dfa.states.splice(i, 1);
          }
        }
        i = 0;
        j = 0;
      }
    }
  }
  return dfa;
}
//Function: Create a list with the incoming transitions of each state
function createIncomingList(dfa) {
  let inCounter = new Array(dfa.states.length);
  let inInteractionsList = createArray(dfa.states.length, dfa.states.length);
  for (let i = 0; i < dfa.states.length; i++) {
    inCounter[i] = 0;
    for (let j = 0; j < dfa.states.length; j++) {
      for (let k = 0; k < dfa.states[j].transitions.length; k++) {
        if (dfa.states[i].label == dfa.states[j].transitions[k].to) {
          let incomingInteractions: TrSD.structureIncomingInteraction = {
            stateLabel: dfa.states[i].label,
            inStateLabel: dfa.states[j].label,
            inStatePosition: j,
          };
          inInteractionsList[i][inCounter[i]] = incomingInteractions;
          inCounter[i]++;
        }
      }
    }
  }
  return inInteractionsList;
}
// ##############################################
// ----------- helper functions ------------
// ##############################################
function createArray(l1, l2) {
  let arr = new Array(l1),
    i,
    j;
  for (i = 0; i < l2; i++) {
    arr[i] = new Array(l1);
  }
  return arr;
}
