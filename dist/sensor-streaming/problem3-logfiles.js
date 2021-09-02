"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const main = () => {
    let result = [];
    fs_1.default.createReadStream("output.csv", { autoClose: false })
        .pipe(csv_parser_1.default())
        .on("data", (data) => {
        result.push(data);
    })
        .on("error", (e) => {
        console.error(e);
    })
        .on("end", () => {
        const rooms = [...new Set(result.map((val) => val.roomArea))];
        let output = {};
        rooms.forEach((room) => {
            const roomData = result.filter((sensor) => sensor.roomArea === room);
            output[room] = mapAggregate(roomData);
        });
        streamLog(output);
    });
};
const streamLog = (output) => {
    console.log(output);
    setTimeout(() => streamLog(output), 15000);
};
const mapAggregate = (data) => ({
    humidity: {
        min: countMin(data.map((val) => +val.humidity)),
        max: countMax(data.map((val) => +val.humidity)),
        median: median(data.map((val) => +val.humidity)),
        avg: average(data.map((val) => +val.humidity)),
    },
    temperature: {
        min: countMin(data.map((val) => +val.temperature)),
        max: countMax(data.map((val) => +val.temperature)),
        median: median(data.map((val) => +val.temperature)),
        avg: average(data.map((val) => +val.temperature)),
    },
});
const countMax = (data) => {
    return Math.max(...data);
};
const countMin = (data) => {
    return Math.min(...data);
};
const average = (data) => {
    return data.reduce((prev, curr) => prev + curr) / data.length;
};
const median = (data) => {
    data.sort(function (a, b) {
        return a - b;
    });
    var half = Math.floor(data.length / 2);
    if (data.length % 2)
        return data[half];
    return (data[half - 1] + data[half]) / 2.0;
};
main();
//# sourceMappingURL=problem3-logfiles.js.map