"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
function processSubmission(messages) {
    return __awaiter(this, void 0, void 0, function* () {
        const { programId, code, language } = JSON.parse(messages);
        console.log(`Received message from ${programId} <${code}>: ${language}`);
        // here we can run the user code on docker container  
        yield new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Message processed");
        client.publish("ProblemDone", JSON.stringify({ programId, code, language, status: "TLE" }));
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect().then(() => {
            console.log("Connected to Redis");
        }).catch((err) => {
            console.error("Redis connection error:", err);
        });
        while (true) {
            const result = yield client.brPop("messages", 0);
            //run the user code on docker container
            yield processSubmission(result.element);
            yield new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Message received: ", result);
        }
    });
}
main();
