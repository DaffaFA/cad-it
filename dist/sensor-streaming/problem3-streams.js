"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
let id = 0;
const main = () => {
    const output = fs_1.default.createWriteStream("output.csv", {
        encoding: "utf-8",
    });
    output.write("temperature,humidity,roomArea,id,timestamp");
    pushData(output);
};
const pushData = (writer) => {
    for (let i = 0; i <= 5; i++) {
        let data = generateData(i);
        console.log("writing: ", data);
        writer.write("\n" + data);
    }
    setInterval(() => pushData(writer), 2000);
};
const generateData = (roomArea) => {
    id++;
    return `${getRandomNumber(17, 27)},${getRandomNumber(80, 99)},roomArea${roomArea},${id},${new Date().getTime()}`;
};
const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
};
main();
//# sourceMappingURL=problem3-streams.js.map