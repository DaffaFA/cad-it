"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const salary_data_json_1 = __importDefault(require("./salary_data.json"));
const API_KEY = "65cefd4ca2-76396be871-qyr725";
const main = async () => {
    try {
        const response = await axios_1.default.get("http://jsonplaceholder.typicode.com/users");
        let users = response.data.map((user) => {
            let salary = salary_data_json_1.default.array.find((salary) => salary.id == user.id);
            if (!salary)
                return user;
            user.salaryInIDR = salary.salaryInIDR;
            return user;
        });
        let requests = [];
        users.forEach((user) => {
            let request = axios_1.default.get("https://api.fastforex.io/convert", {
                headers: {
                    "x-rapidapi-host": "fixer-fixer-currency-v1.p.rapidapi.com",
                    "x-rapidapi-key": "ebb94f599dmshdb41cf25cf64687p12683cjsn4d5a2712aac7",
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
        let salariesInUSD = await axios_1.default.all(requests);
        let mappedUsers = users.map((user, id) => {
            user.salaryInUSD = salariesInUSD[id].data.result.USD;
            return user;
        });
        console.log(mappedUsers);
    }
    catch (e) {
        console.error(e);
    }
};
main();
//# sourceMappingURL=problem1.js.map