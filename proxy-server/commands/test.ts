export const commandArguments = {
    date: (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return {success: false, msg: "Bad date"}
        return {success: true, data: date};
    },
    age: (ageStr) => {
        const age = parseInt(ageStr);
        if (isNaN(age)) return {success: false, msg: "Bad age"}
        return {success: true, data: age}
    }
};

export const commandUsage = "\nnode console.js test <date> <age>";

export async function runCommand({date, age}) {
    console.log({date, age})
}
