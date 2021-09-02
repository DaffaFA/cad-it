import sensors from "./sensor_data.json";

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
  const rooms = [...new Set(sensors.array.map((val) => val.roomArea))];
  const days = [
    ...new Set(
      sensors.array.map((val) => dummyDays[new Date(val.timestamp).getDay()])
    ),
  ];

  let byRoom: any = {};
  let byDay: any = {};

  rooms.forEach((room) => {
    const roomData = sensors.array.filter((sensor) => sensor.roomArea == room);

    roomData.sort((a, b) => {
      return a.timestamp - b.timestamp;
    });

    byRoom[room] = mapAggregate(roomData);
  });

  days.sort().forEach((day) => {
    let mappedDay = sensors.array.map(
      (sensor: typeof sensors.array[0] & { day?: string }) => {
        sensor.day = dummyDays[new Date(sensor.timestamp).getDay()];
        return sensor;
      }
    );

    const dayData = mappedDay.filter((sensor) => sensor.day == day);

    dayData.flat();

    byDay[day] = mapAggregate(dayData);
  });

  console.log({ byDay, byRoom });
};

const mapAggregate = (data: typeof sensors.array) => ({
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
