// ------------ Program -------------
/**
 * parses an Deterministic Finite Automata (DFA) to a Regular Expression using the Transitive Closure Method
 * The reduction library does not always reduce the regex in a correct way
 * @param dfa Deterministic Finite Automata
 * @returns a reduced Regular Expression
 */
export default function generateRegex(dfa) {
  try {
    let r0 = generateR0(dfa);
    let rK = transitiveClosure(dfa, r0);

    //Find final states of dfa with end loops
    for (let i = 0; i < rK.length; i++) {
      if (rK[i][i].includes("$")) {
        continue;
      } else {
        if (1 == dfa.states[i].transitions.length) {
          dfa.states[i].isFinal = true;
        }
      }
    }
    //Final Regular Expresion: from initial state to final state
    let initialState;
    let finalStates = new Array(dfa.states.length);
    let j = 0;
    for (let i = 0; i < dfa.states.length; i++) {
      if (true == dfa.states[i].isInitial) {
        initialState = i;
      }
      if (true == dfa.states[i].isFinal) {
        finalStates[j] = i;
        j++;
      }
    }
    let finalFiltered = finalStates.filter((el) => {
      return el != null && el != "";
    });

    if (0 == finalFiltered.length) {
      console.error({ dfa });
      throw new Error(
        " The DFA does not have a final state. The Regular Expression cannot be determined "
      );
    } else {
      let regex = "(" + rK[initialState][finalFiltered[0]] + ")";
      if (1 < finalFiltered.length) {
        for (let i = 1; i < finalFiltered.length; i++) {
          regex += "+" + "(" + rK[initialState][finalFiltered[i]] + ")";
        }
      }
      var noam = require("noam");
      let reducedRegex = noam.re.string.simplify(regex);
      return reducedRegex;
    }
  } catch (error) {
    throw new Error(" Problem generating the Regular Expression" + error);
  }
}

//Function: Creation of a Regular Expresion using the Transitive Closure Method
function transitiveClosure(dfa, r0) {
  let rK = createArray(dfa.states.length, dfa.states.length);
  let rKmOne = JSON.parse(JSON.stringify(r0));
  for (let k = 1; k < dfa.states.length; k++) {
    for (let i = 0; i < dfa.states.length; i++) {
      for (let j = 0; j < dfa.states.length; j++) {
        rK[i][j] =
          "[(" +
          rKmOne[i][j] +
          ")]+[(" +
          rKmOne[i][k] +
          ")(" +
          rKmOne[k][k] +
          ")*(" +
          rKmOne[k][j] +
          ")]";
      }
    }
    reduceRegex(rK);
    rKmOne = JSON.parse(JSON.stringify(rK));
  }
  return rK;
}
//Function: Creation of R0
function generateR0(dfa) {
  let r0 = createArray(dfa.states.length, dfa.states.length);
  for (let i = 0; i < dfa.states.length; i++) {
    for (let j = 0; j < dfa.states.length; j++) {
      if (i == j) {
        r0[i][j] = "$";
      } else {
        r0[i][j] = "o";
      }
      let hasTransition = hastransition(
        dfa,
        dfa.states[i].label,
        dfa.states[j].label
      );
      if (hasTransition && "o" == r0[i][j]) {
        let symbol = gettransition(
          dfa,
          dfa.states[i].label,
          dfa.states[j].label
        );
        r0[i][j] = symbol;
      } else if (hasTransition && "o" != r0[i][j]) {
        let symbol = gettransition(
          dfa,
          dfa.states[i].label,
          dfa.states[j].label
        );
        r0[i][j] += "+" + symbol;
      }
    }
  }
  return r0;
}
//Function: Check if two states have a transition between them
function hastransition(dfa, labelSource, labelDestination) {
  for (let k = 0; k < dfa.states.length; k++) {
    if (dfa.states[k].label == labelSource) {
      for (let l = 0; l < dfa.states[k].transitions.length; l++) {
        if (dfa.states[k].transitions[l].to == labelDestination) {
          return true;
        }
      }
    }
  }
  return false;
}
//Function: Get the symbol of the transitions between two events
function gettransition(dfa, labelSource, labelDestination) {
  let foundTransition;
  for (let k = 0; k < dfa.states.length; k++) {
    if (dfa.states[k].label == labelSource) {
      if (1 == dfa.states[k].transitions.length) {
        foundTransition = dfa.states[k].transitions[0].symbol;
        return foundTransition;
      } else {
        for (let l = 0; l < dfa.states[k].transitions.length; l++) {
          if (dfa.states[k].transitions[l].to == labelDestination) {
            if (undefined == foundTransition) {
              foundTransition = dfa.states[k].transitions[l].symbol;
            } else {
              foundTransition +=
                "·" + "+" + "·" + dfa.states[k].transitions[l].symbol;
            }
          }
        }
        return foundTransition;
      }
    }
  }
  return null;
}
//Function: Reduce Regular expression
function reduceRegex(rK) {
  var noam = require("noam");
  for (let i = 0; i < rK.length; i++) {
    for (let j = 0; j < rK[i].length; j++) {
      let redexToReduce = rK[i][j];
      let regexSides = redexToReduce.match(/[^[\]]+(?=])/g);
      let regexLeft = regexSides[0];
      let regexRight = regexSides[1];
      let newRegex = regexLeft + "+" + regexRight;
      if (regexLeft.includes("o") && regexRight.includes("o")) {
        newRegex = "(o)";
      }
      if (regexLeft.includes("o")) {
        newRegex = regexRight;
      }
      if (regexRight.includes("o")) {
        newRegex = regexLeft;
      }
      let reducedRegex = noam.re.string.simplify(newRegex);
      let correctRegex = correctSyntax(reducedRegex);
      rK[i][j] = correctRegex;
    }
  }
}
//Function: Correct the syntax of the reduced expression
function correctSyntax(regex) {
  for (let i = 0; i < regex.length; i++) {
    let type = checkElemtType(regex[i]);
    let leftElement;
    let rightElement;
    leftElement = checkElemtType(regex[i - 1]);
    rightElement = checkElemtType(regex[i + 1]);
    if ("operator" == type || "other" == type) {
      continue;
    } else if ("number" == type) {
      if ("operator" == leftElement && "number" == rightElement) {
        regex = [regex.slice(0, i), "·", regex.slice(i)].join("");
      } else if ("number" == leftElement && "operator" == rightElement) {
        regex = [regex.slice(0, i + 1), "·", regex.slice(i + 1)].join("");
      } else if ("separator" == leftElement && "operator" == rightElement) {
        regex = [regex.slice(0, i + 1), "·", regex.slice(i + 1)].join("");
      } else if ("operator" == leftElement && "separator" == rightElement) {
        regex = [regex.slice(0, i), "·", regex.slice(i)].join("");
      } else {
        continue;
      }
    } else {
      if ("separator" == leftElement && "separator" == rightElement) {
        regex = [regex.slice(0, i), regex.slice(i + 1)].join("");
      } else if ("number" == leftElement && "separator" == rightElement) {
        regex = [regex.slice(0, i), regex.slice(i + 1)].join("");
      } else if ("separator" == leftElement && "number" == rightElement) {
        regex = [regex.slice(0, i), regex.slice(i + 1)].join("");
      } else if ("separator" == leftElement && "operator" == rightElement) {
        regex = [regex.slice(0, i), regex.slice(i + 1)].join("");
      } else {
        continue;
      }
    }
  }
  return regex;
}
// ##############################################
// ----------- helper functions ------------
// ##############################################
function checkElemtType(element) {
  let type;
  switch (element) {
    case "$":
      type = "other";
      break;
    case "o":
      type = "other";
      break;
    case "(":
      type = "operator";
      break;
    case ")":
      type = "operator";
      break;
    case "·":
      type = "separator";
      break;
    case "*":
      type = "operator";
      break;
    case "+":
      type = "operator";
      break;
    case "0":
      type = "number";
      break;
    case "1":
      type = "number";
      break;
    case "2":
      type = "number";
      break;
    case "3":
      type = "number";
      break;
    case "4":
      type = "number";
      break;
    case "5":
      type = "number";
      break;
    case "6":
      type = "number";
      break;
    case "7":
      type = "number";
      break;
    case "8":
      type = "number";
      break;
    case "9":
      type = "number";
      break;
    case undefined:
      type = "undefined";
      break;
    default:
      throw new Error("Unexpected symbol in regular expression");
  }
  return type;
}
function createArray(l1, l2) {
  let arr = new Array(l1),
    i,
    j;
  for (i = 0; i < l2; i++) {
    arr[i] = new Array(l1);
  }
  return arr;
}
