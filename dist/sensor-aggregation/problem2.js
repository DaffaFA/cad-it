"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sensor_data_json_1 = __importDefault(require("./sensor_data.json"));
const main = () => {
    const dummyDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const rooms = [...new Set(sensor_data_json_1.default.array.map((val) => val.roomArea))];
    const days = [
        ...new Set(sensor_data_json_1.default.array.map((val) => dummyDays[new Date(val.timestamp).getDay()])),
    ];
    let byRoom = {};
    let byDay = {};
    rooms.forEach((room) => {
        const roomData = sensor_data_json_1.default.array.filter((sensor) => sensor.roomArea == room);
        roomData.sort((a, b) => {
            return a.timestamp - b.timestamp;
        });
        byRoom[room] = mapAggregate(roomData);
    });
    days.sort().forEach((day) => {
        let mappedDay = sensor_data_json_1.default.array.map((sensor) => {
            sensor.day = dummyDays[new Date(sensor.timestamp).getDay()];
            return sensor;
        });
        const dayData = mappedDay.filter((sensor) => sensor.day == day);
        dayData.flat();
        byDay[day] = mapAggregate(dayData);
    });
    console.log({ byDay, byRoom });
};
const mapAggregate = (data) => ({
    humidity: {
        min: countMin(data.map((val) => val.humidity)),
        max: countMax(data.map((val) => val.humidity)),
        median: median(data.map((val) => val.humidity)),
        avg: average(data.map((val) => val.humidity)),
    },
    temperature: {
        min: countMin(data.map((val) => val.temperature)),
        max: countMax(data.map((val) => val.temperature)),
        median: median(data.map((val) => val.temperature)),
        avg: average(data.map((val) => val.temperature)),
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
//# sourceMappingURL=problem2.js.map