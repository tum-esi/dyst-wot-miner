/*BASED ON parseSD.ts file from system-description project*/
import { SQSD } from "../definitions/defs.d";
import {
  interactionType,
  loopType,
  structureType,
  interactionDir,
} from "../definitions/enums";

// ------------ Program -------------
/**
 * parses a Regular Expression to an tree-like representation
 * @param regex Regular Expression
 * @param interactionList List of all interactions. The structure of each interaction is defined in tracesSchema.json
 * @param traces input traces to detect loopOptions
 * @returns a tree-like object representing the application logic deduced from the input traces
 */
export default function generateMUlogic(regex, interactionList, traces) {
  try {
    let name = "example";
    let root;
    const actions = {};
    const functions = {};
    const properties = {};
    // ########### adapted ###########
    root = parseRecursion(regex, interactionList, traces);
    const outMashupLogic: SQSD.mashupLogic = {
      name,
      root,
      actions,
      functions,
      properties,
    };
    // ########### - ###########
    return outMashupLogic;
  } catch (error) {
    console.error({ regex });
    throw new Error(
      "Problem generating the Mashup logic from the Regular Expression: " +
        regex +
        " " +
        error
    );
  }
}
// ----------------------------------
/**
 * - parses the content of one `regex` to an array of structure elements
 * - each element represents one application logic command
 * - if an element contains further elements (e.g. loop) this function will be called recursively
 * - if an atomic mashup is parsed the functions to parse the interactions will be called
 * - Valid regex have:
 *    - "·" to separate interactions
 *    - "+" always in between parenthesis with the if element in the left and the else element in the right. e.g: (1+(2+3))
 *    - "*" always after a ")", i.e. the loop always has to be encapsulated in parenthesis. e.g. (1+(2+3))*
 *    - The conditions of case are: unknown
 *    - The loop repetitions are detected only if the loop has no nested elements.
 *    - Atomic Mashups have one send interaction and one receive interaction only (Always 3 messages per atomic Mashup)
 *    * Not suported regex structures:
 *    - Nested loops

 *
 */
//########### adapted ###########
function parseRecursion(regex, interactionList, traces) {
  let strctProto: SQSD.structureEl[] = [];

  //########### new ###########
  let i = 0;
  let newi;
  let from, to;
  let interact;
  for (i; i < regex.length; i++) {
    //Parse regular expression using tokens
    switch (regex[i]) {
      case "(":
        let subRegex = regex.substring(i);
        let singleCase = subRegex.match(/\([^*][^)*(]*\)(?![^(]*[)])/); ///\([+]*[^)(]*\)(?![^(]*[)])/      \([^*][^)*(]*\)(?![^(]*[)])   ///\(*[^(][^*]+\)(?![^(]*[)*])/
        let loop = subRegex.match(/\([^*][^)*(]*\)[*](?![^(]*[)])/);

        if (!(null == loop) && !(null == singleCase)) {
          let casePosition = subRegex.indexOf(singleCase[0]);
          let loopPosition = subRegex.indexOf(loop[0]);
          if (casePosition >= loopPosition) {
            //loop
            from = 0;
            to = loop[0].length - 1;
            let inLoop = loop[0].slice(from, to);
            addLoopToMUlogic(strctProto, inLoop, interactionList, traces);
            newi = i + to;
          } else {
            //singleCase or squential
            let parethesis = singleCase[0].match(/\(.*\)/);
            let from = 1;
            let to = parethesis[0].length - 1;
            strctProto = parseParenthesis(
              from,
              to,
              parethesis,
              strctProto,
              interactionList,
              traces
            );
            newi = i + to;
          }
        } else if (null == loop && !(null == singleCase)) {
          //singleCase or squential
          let parethesis = singleCase[0].match(/\(.*\)/);
          let from = 1;
          let to = parethesis[0].length - 1;
          strctProto = parseParenthesis(
            from,
            to,
            parethesis,
            strctProto,
            interactionList,
            traces
          );
          newi = i + to;
        } else if (null == loop && null == singleCase) {
          //Nested Structure
          let parethesis = subRegex.match(/\(.*\)/);
          let from = 1;
          let to = parethesis[0].length - 1;
          strctProto = parseParenthesis(
            from,
            to,
            parethesis,
            strctProto,
            interactionList,
            traces
          );
          newi = i + to;
        }
        i = newi;
        break;
      case "1":
        from = i;
        to = getInteractEnd(regex, i);
        interact = regex.slice(from, to);
        addInteractToMUlogic(strctProto, interact, interactionList);
        i = to - 1;
        break;
      case "2":
        from = i;
        to = getInteractEnd(regex, i);
        interact = regex.slice(from, to);
        addInteractToMUlogic(strctProto, interact, interactionList);
        i = to - 1;
        break;
      case "3":
        from = i;
        to = getInteractEnd(regex, i);
        interact = regex.slice(from, to);
        addInteractToMUlogic(strctProto, interact, interactionList);
        i = to - 1;
        break;
      case "4":
        from = i;
        to = getInteractEnd(regex, i);
        interact = regex.slice(from, to);
        addInteractToMUlogic(strctProto, interact, interactionList);
        i = to - 1;
        break;
      case "5":
        from = i;
        to = getInteractEnd(regex, i);
        interact = regex.slice(from, to);
        addInteractToMUlogic(strctProto, interact, interactionList);
        i = to;
        break;
      case "6":
        from = i;
        to = getInteractEnd(regex, i);
        interact = regex.slice(from, to);
        addInteractToMUlogic(strctProto, interact, interactionList);
        i = to - 1;
        break;
      case "7":
        from = i;
        to = getInteractEnd(regex, i);
        interact = regex.slice(from, to);
        addInteractToMUlogic(strctProto, interact, interactionList);
        i = to - 1;
        break;
      case "8":
        from = i;
        to = getInteractEnd(regex, i);
        interact = regex.slice(from, to);
        addInteractToMUlogic(strctProto, interact, interactionList);
        i = to - 1;
        break;
      case "9":
        from = i;
        to = getInteractEnd(regex, i);
        interact = regex.slice(from, to);
        addInteractToMUlogic(strctProto, interact, interactionList);
        i = to - 1;
        break;
      case ")":
        continue;
      case "·":
        continue;
      case "*":
        continue;
      case "+":
        continue;
      default:
        throw new Error("Unexpected symbol in regular expression");
    }
  }
  //########### - ###########
  return strctProto;
}
//########### - ###########

//########### new ###########
//Function: parse nested structure, case structure or sequential structure
function parseParenthesis(
  from,
  to,
  parethesis,
  strctProto,
  interactionList,
  traces
) {
  let inParethesis = parethesis[0].slice(from, to);
  if (inParethesis.includes("+")) {
    let alt = inParethesis.split(/\s*[+](?![^(]*[)])\s*/);
    let ifSide;
    let elseSide;
    if (2 < alt.length) {
      if (inParethesis.endsWith(")")) {
        ifSide = alt[0];
        elseSide = alt[1];
        for (let j = 2; j < alt.length; j++) {
          elseSide += "+" + alt[j];
        }
      } else {
        ifSide = alt[0];
        elseSide = alt[alt.length - 1];
        for (let j = 1; j < alt.length - 1; j++) {
          ifSide += "+" + alt[j];
        }
      }
    } else {
      ifSide = alt[0];
      elseSide = alt[1];
    }
    addCaseToMUlogic(strctProto, ifSide, elseSide, interactionList, traces);
  } else {
    strctProto = parseRecursion(inParethesis, interactionList, traces);
  }
  return strctProto;
}
// ########### - ###########

//########### new ###########
//Function: Add loop element to the application logic
function addLoopToMUlogic(strctProto, loop, interactionList, traces) {
  let count = 0;
  if (!(loop.includes("+") || loop.includes("*"))) {
    let parethesis = loop.match(/\(.*\)/);
    let from = 1;
    let to = parethesis[0].length - 1;
    let inParethesis = parethesis[0].slice(from, to);
    let loopElements = inParethesis.split("·");
    const loopFiltered = loopElements.filter((el) => {
      return el != null && el != "";
    });

    let repetition = 0;
    let repetitionMone = 0;
    traces.forEach((trace) => {
      let loopcount = 0;
      for (let i = 0; i < trace.length - 1; i++) {
        if (loopFiltered[0] == trace[i].interactionId) {
          for (let j = 0; j < loopFiltered.length - 1; j++) {
            if (i + j < trace.length - 1) {
              if (loopFiltered[j] == trace[i + j].interactionId) {
                loopcount++;
              }
            } else {
              continue;
            }
          }
        } else {
          continue;
        }
      }
      repetition = Math.floor(loopcount / (loopFiltered.length - 1));
      if (repetitionMone < repetition && 1 < repetition) {
        count = repetition;
      }
      repetitionMone = repetition;
    });
  }
  strctProto.push({
    type: structureType.loop,
    content: parseRecursion(loop, interactionList, traces),
    loopOpts: {
      type: loopType.logic,
      exCount: count,
    },
  });
}
// ########### - ###########

//########### new ###########
//Function: Add case element to the application logic
function addCaseToMUlogic(
  strctProto,
  ifSide,
  elseSide,
  interactionList,
  traces
) {
  //The condition in this work is considered to be an unknown variable
  const provCondition = {
    get: {
      $ref: "#/variables/unknown",
    },
  };

  const structIfconv = (inS: SQSD.ifWord) => {
    let outS: SQSD.comparison;
    const cprops = Object.keys(inS);
    const checkC = function (str: string | string[]) {
      if (typeof str === "string") {
        return cprops.every((prop) => prop === str);
      } else {
        return cprops.every((prop) => str.some((strEl) => prop === strEl));
      }
    };

    if (checkC("not")) {
      inS = inS as { not };
      outS = { type: "not", not: structIfconv(inS.not) };
    } else if (checkC("allOf")) {
      inS = inS as { allOf };
      outS = {
        type: "all",
        allOf: inS.allOf.map((el) => structIfconv(el)),
      };
    } else if (checkC("oneOf")) {
      inS = inS as { oneOf };
      outS = {
        type: "one",
        oneOf: inS.oneOf.map((el) => structIfconv(el)),
      };
    } else if (checkC("anyOf")) {
      inS = inS as { anyOf };
      outS = {
        type: "any",
        anyOf: inS.anyOf.map((el) => structIfconv(el)),
      };
    } else if (checkC(["get", "output"])) {
      inS = inS as { get; output };
      let value;

      if (typeof inS.output === "object") {
        value = parseVarRef(inS.output);
      } else if (
        typeof inS.output === "number" ||
        typeof inS.output === "string"
      ) {
        value = inS.output;
      }
      const variable = parseVarRef(inS.get);
      outS = { type: "var", variable, value };
    } else {
      throw new Error("strange if: " + cprops);
    }
    return outS;
  };
  const condition = structIfconv(provCondition);
  strctProto.push({
    type: structureType.case,
    content: parseRecursion(ifSide, interactionList, traces),
    elseContent: elseSide
      ? parseRecursion(elseSide, interactionList, traces)
      : undefined,
    condition,
  });
}
// ########### - ###########

//########### new ###########
//Function: Add interact element to the application logic
function addInteractToMUlogic(strctProto, interact, interactionList) {
  let pathInteractions = interact.split("·");
  let interactReceive;
  let interactSend;

  const interactFiltered = pathInteractions.filter((el) => {
    return el != null && el != "";
  });

  //Atomic Mashups are limited to one send and one receive interaction: 3 messages
  let messagesInAtomicMU = 3;
  let i, j;
  let singleInteract;
  for (i = 0, j = interactFiltered.length; i < j; i += messagesInAtomicMU) {
    singleInteract = interactFiltered.slice(i, i + messagesInAtomicMU);
    for (let k = 0; k < singleInteract.length; k++) {
      let interactionNumber = parseInt(singleInteract[k], 10);
      let intPositionInList = interactionNumber - 1;
      if (!interactionList[intPositionInList].hasOwnProperty("operation")) {
        continue;
      }
      switch (interactionList[intPositionInList].operation) {
        case "subscribeevent":
          interactReceive = RecPathToIntrct(interactionList[intPositionInList]);
          break;
        case "observeproperty":
          interactReceive = RecPathToIntrct(interactionList[intPositionInList]);
          break;
        case "readproperty":
          interactReceive = RecPathToIntrct(interactionList[intPositionInList]);
          break;
        case "writeproperty":
          interactSend = SendPathToIntrct(interactionList[intPositionInList]);
          break;
        case "invokeaction":
          interactSend = SendPathToIntrct(interactionList[intPositionInList]);
          break;
        default:
          throw new Error("Error while creating the element: interact");
      }
    }
    strctProto.push({
      type: structureType.interact,
      receiveIntrcts: interactReceive,
      sendIntrcts: interactSend,
      breakOnDataPushed: false,
    });
  }
  return strctProto;
}
// ########### - ###########

//########### new ###########
//Function: Get the last element of the interact
function getInteractEnd(regex, i) {
  let subRegex = regex.substring(i);
  let idxInitBracket, to;
  idxInitBracket = subRegex.indexOf("(");
  if (-1 == idxInitBracket) {
    to = regex.length;
  } else {
    to = i + idxInitBracket;
  }
  return to;
}
// ########### - ###########

/**
 * Parses receiving interactions to internal representation
 * @param interactionReceive JSON-Array containing receiving interactions
 */
//########### adapted ###########
function RecPathToIntrct(interactionReceive) {
  const intrctProto: SQSD.interactionReceive[] = [];
  const direction = interactionDir.receive;
  let set;
  let type;

  // get interaction target (->Thing)
  const to = interactionReceive.recipient.thingTitle;
  const name = interactionReceive.affordance.name;
  if (to === undefined || name === undefined) {
    throw new Error("cannot det receive intrct path");
  }
  //Set is undifined in this work
  set = undefined;

  if (interactionReceive.operation === "subscribeevent") {
    type = interactionType.subscribe;
  } else if (interactionReceive.operation === "invokeaction") {
    type = interactionType.invoke;
  } else if (interactionReceive.operation === "observeproperty") {
    type = interactionType.observe;
  } else if (interactionReceive.operation === "readproperty") {
    type = interactionType.read;
  } else {
    throw new Error("wrong receive op " + interactionReceive.op);
  }
  intrctProto.push({ direction, type, to, name, set });

  return intrctProto;
}
//########### - ###########

/**
 * Parses sending interactions to internal representation
 * @param interactionSend JSON-Array containing sending interactions
 */
//########### adapted ###########
function SendPathToIntrct(interactionSend) {
  const intrctProto: SQSD.interactionSend[] = [];
  const direction = interactionDir.send;
  let type;
  let get;
  let defaultInput;

  const to = interactionSend.recipient.thingTitle;
  const name = interactionSend.affordance.name;
  if (to === undefined || name === undefined) {
    throw new Error("cannot det receive intrct path");
  }

  //Get and defaultInput are undefined in this work
  get = undefined;
  defaultInput = undefined;

  if (interactionSend.operation === "invokeaction") {
    type = interactionType.invoke;
  } else if (interactionSend.operation === "writeproperty") {
    type = interactionType.write;
  } else {
    throw new Error("wrong send op " + interactionSend.op);
  }
  intrctProto.push({ direction, type, to, name, get, defaultInput });

  return intrctProto;
}
//########### - ###########

/**
 * parses the reference string given to internal representation
 * for a variable or property based on {name, type}
 * @param arg object that contains property $ref with a reference string
 */
function parseVarRef(arg: { $ref: string }) {
  const hIndex = arg.$ref.split("/").slice(1).shift();
  if (!hIndex) {
    throw new Error("case -> var/prop fail");
  }

  let type;
  if (hIndex === "variables") {
    type = "variable";
  } else if (hIndex === "properties") {
    type = "property";
  } else {
    throw new Error();
  }
  const name = arg.$ref.split("/").pop();
  if (name === undefined) {
    throw new Error("cannot get property name");
  }
  return { name, type };
}
function parseActRef(arg: { $ref: string }) {
  const hIndex = arg.$ref.split("/").slice(1).shift();
  if (!hIndex) {
    throw new Error("case -> act/func fail");
  }

  let type;
  if (hIndex === "functions") {
    type = "function";
  } else if (hIndex === "actions") {
    type = "action";
  } else {
    throw new Error("actRef neither f nor a");
  }
  // remove /path at end of string and get action/function name
  const name = arg.$ref.split("/").slice(0, -1).pop();
  if (name === undefined) {
    throw new Error("cannot get action name");
  }
  return { name, type };
}
