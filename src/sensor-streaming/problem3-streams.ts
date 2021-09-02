import fs from "fs";

let id = 0;

const main = () => {
  const output = fs.createWriteStream("output.csv", {
    encoding: "utf-8",
  });

  output.write("temperature,humidity,roomArea,id,timestamp");

  pushData(output);
};

const pushData = (writer: fs.WriteStream) => {
  for (let i = 0; i <= 5; i++) {
    let data = generateData(i);

    console.log("writing: ", data);
    writer.write("\n" + data);
  }

  setInterval(() => pushData(writer), 2000);
};

const generateData = (roomArea: number) => {
  id++;
  return `${getRandomNumber(17, 27)},${getRandomNumber(
    80,
    99
  )},roomArea${roomArea},${id},${new Date().getTime()}`;
};

const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

main();
