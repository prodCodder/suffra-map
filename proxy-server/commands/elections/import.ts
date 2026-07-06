import { IEElectionTypes } from "../../models/elections.model.js";

export const commandArguments = {
    name: (name) => {
        if (name === undefined || name.length === 0) 
            return {success: false, msg: "Please mention a name"}
        return {success: true, data: name};
    },
    type: (type) => {
        if (IEElectionTypes[type] === undefined) 
            return {
                success: false, 
                msg: "Bad type, please mention : "+Object.keys(IEElectionTypes).join(" or ")
            }
        return { success: true, data: type }
    },
    round_date: (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime()))
            return { success: false, msg: "Bad round date" }
        return { success: true, data: date }
    },
    mapper: (mapper) => {
        return { success: true, data: mapper }
    },
    files: (files) => {
        return { success: true, data: files.split(",").map(file => file.trim()) }
    }
};

export const commandUsage = (
    "\nnpm run cmd elections import <name> <type> <round_date> <mapper> <files>"+
    "\n"+
    "\n\t - name: The name of the election (e.g. \"Elections présidentielles française 2022\")"+
    "\n\t - type: The type of the election, must be one of "+Object.keys(IEElectionTypes).map(type => `"${type}"`).join(", ")+
    "\n\t - round date: The round of the election datas we want to import (e.g. 2022-04-10)"+
    "\n\t - mapper: The mapper to use to parse data elections (e.g. ministere_interieur_officiel)"+
    "\n\t - files: List of files to import, which will be given to the mapper (e.g. resultats-definitifs-par-bureau-de-vote.xlsx,liste-des-candidats.xlsx)"+
    "\n\n"+
    "Example: npm run cmd elections import \"Elections Legislatives 2024\" parliamentary 2026-06-30 ministere_interieur_officiel resultats-definitifs-par-bureau-de-vote.xlsx"
);

export async function runCommand(args) {
    console.log(args)
}
