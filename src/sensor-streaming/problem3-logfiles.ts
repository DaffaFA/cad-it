import fs from "fs";
import csvParser from "csv-parser";
import sensors from "../sensor-aggregation/sensor_data.json";

const main = () => {
  streamLog();
};

const streamLog = () => {
  let result: typeof sensors.array = [];
  fs.createReadStream("output.csv", { autoClose: false })
    .pipe(csvParser())
    .on("data", (data) => {
      result.push(data);
    })
    .on("error", (e) => {
      console.error(e);
    })
    .on("end", () => {
      const rooms = [...new Set(result.map((val) => val.roomArea))];

      let output: any = {};

      rooms.forEach((room) => {
        const roomData = result.filter((sensor) => sensor.roomArea === room);

        output[room] = mapAggregate(roomData);
      });

      console.log(output);
    });

  setTimeout(() => streamLog(), 15000);
};

const mapAggregate = (data: typeof sensors.array) => ({
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

const countMax = (data: number[]) => {
  return Math.max(...data);
};

const countMin = (data: number[]) => {
  return Math.min(...data);
};

const average = (data: number[]) => {
  return data.reduce((prev, curr) => prev + curr) / data.length;
};

const median = (data: number[]) => {
  // sort data from lowest to highest
  data.sort(function (a, b) {
    return a - b;
  });

  var half = Math.floor(data.length / 2);

  // if data length is even return immediately
  if (data.length % 2) return data[half];

  return (data[half - 1] + data[half]) / 2.0;
};

main();
