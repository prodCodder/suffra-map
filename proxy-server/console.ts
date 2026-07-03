import { ICommandFetchCommandFunction } from "./types.js";
import { fileExists } from "./utils.js";
const currentDirectory = import.meta.dirname;

async function mainExecution() {
    (<any>process).suppressLogging = true;

    const {commandArguments, processPostArgs, commandUsage, runCommand, depth} = await fetchCommandModule();

    const argumentEntries = Object.entries(commandArguments);

    let executionParameters = {};

    for (let index = 0; index < argumentEntries.length; index++) {
        const [argumentKey, validationFunction] = argumentEntries[index];
        const argumentValue = process.argv[index + 2 + depth];
        const {success, msg: message, data: resultData, params: updatedParams} = await validationFunction(argumentValue, executionParameters);
        if (!success) {
            throw new Error(message + "\n\nUsage: " + commandUsage)
        }
        if (updatedParams) {
            executionParameters = updatedParams;
        } else {
            executionParameters[argumentKey] = resultData ?? argumentValue;
        }
    }
    if (processPostArgs) {
        const {success, msg: message, params: finalParams} = await processPostArgs(executionParameters);
        if (!success) {
            throw new Error(message + "\n\nUsage: " + commandUsage)
        }
        if (finalParams) {
            executionParameters = finalParams;
        }
    }

    await runCommand(executionParameters);

    process.exit(0);
}

const fetchCommandModule: ICommandFetchCommandFunction = async (inputArgs = process.argv.slice(2), moduleBase = `${currentDirectory}/commands/`, currentDepth = 1) => {
    let modulePath;

    if (await fileExists(modulePath = `${moduleBase}/index.js`))
        return {...(await import(modulePath)), depth: currentDepth-1};

    if (inputArgs.length === 0)
        throw new Error("Command required but not specified");

    const cmdName = inputArgs.shift();

    if (await fileExists(modulePath = `${moduleBase}/${cmdName}.js`))
        return {...(await import(modulePath)), depth: currentDepth};

    if (!(await fileExists(modulePath = `${moduleBase}/${cmdName}`)))
        throw new Error("The specified command '" + cmdName + "' was not found");

    return fetchCommandModule(inputArgs, moduleBase + cmdName + "/", currentDepth + 1)
}

mainExecution();
