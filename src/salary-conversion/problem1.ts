import axios, { AxiosResponse } from "axios";
import salaryData from "./salary_data.json";

interface userData {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: [Object];
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  salaryInIDR?: number;
  salaryInUSD?: number;
}

const API_KEY = "65cefd4ca2-76396be871-qyr725";

const main = async () => {
  try {
    const response = await axios.get<userData[]>(
      "http://jsonplaceholder.typicode.com/users"
    );

    // combine salaries data with json from request
    let users = response.data.map((user) => {
      let salary = salaryData.array.find((salary) => salary.id == user.id);

      if (!salary) return user;

      user.salaryInIDR = salary.salaryInIDR;

      return user;
    });

    let requests: Promise<AxiosResponse<any>>[] = [];

    users.forEach((user) => {
      let request = axios.get("https://api.fastforex.io/convert", {
        headers: {
          "x-rapidapi-host": "fixer-fixer-currency-v1.p.rapidapi.com",
          "x-rapidapi-key":
            "ebb94f599dmshdb41cf25cf64687p12683cjsn4d5a2712aac7",
        },
        params: {
          api_key: API_KEY,
          from: "IDR",
          to: "USD",
          amount: user.salaryInIDR,
        },
      });

      requests.push(request);
    });

    let salariesInUSD = await axios.all(requests);

    let mappedUsers = users.map((user, id) => {
      user.salaryInUSD = salariesInUSD[id].data.result.USD;

      return user;
    });

    console.log(mappedUsers);
  } catch (e) {
    console.error(e);
  }
};

main();
