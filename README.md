# WoTMiner

A project to improve the verification of Mashups in the Web of Things. We provide conversion functions to convert a collection of traces into System Description.

### Abbreviations

- Web of Things (WoT)
- Deterministic Finite Automata (DFA)
- Regular Expression (Regex)
- Sequence Diagram (SeqD)
- Thing Description (TD)
- System Description (SD)

## HowTo

To use this project via the command line follow the commands of the remainder of this section.

Each transformation can be used individually by using the corresponding source code file (see `./src`). Their usage can be learned by looking at the example in `./src/test.ts` and the comments in each file. The allowed transformations are:

- From traces to DFA (`./src/generateFA.ts`)
- From DFA to Regex (`./src/generateRegex.ts`)
- From Regex to Mashup Logic (`./src/generateMULogic.ts`)
- From Mashup Logic to SeqD (library: "system-description"(https://github.com/tum-esi/wot-system-description.git), method: (`./src/generateSeqD.ts`))
- From SeqD to SD (library: "system-description"(https://github.com/tum-esi/wot-system-description.git), method: (`./src/generateSD.ts`))

To start using this project:

- Make sure you have Nodejs and NPM installed.
- If you are executing the code generation or conversion for the first time use `npm run build` to create the executable JavaScript files first.

The input traces must have the following format:

- An array containing the scenario traces (each trace is an array). The elements of the trace are the **interactionIds** defined in the file: `./definitions/nteractionSchema.json`. This array shows the order in which each interaction has ocurred during the execution, e.g. if there is a loop of the interaction with **interactionId = 1** this value appears several times.

- An array containing each unique interaction only once in order ( **interactionId** assigned). Each element of the array is an object that follows the definition in: `./definitions/nteractionSchema.json`. In the example before, the interaction with **interactionId = 1** apperas only once.

Having two arrays allows us to separate the behavior of the system from the definition of the interactions which reduces the size of the input data and facilitates it processing.

For more information please check the examples in: `./examples/-dir.`

## Directory overview

- `./definitions/`-dir, contains everything that has is more definition than source code, e.g. typescript definitions, JSON-Schema, ...
- `./dist/`-dir, contains transpiled JavaScript files.
- `./examples/`-dir, contains complete examples from traces to SDs and all the intermediate transformations.
- `./evaluation/`-dir, contains five systems analyzed during the evaluation of the approach.
- `./src/`-dir, contains the typescript source files.
