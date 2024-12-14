import { createClient } from "redis";

const client = createClient();

async function processSubmission(messages:string) {
  const {programId, code, language} = JSON.parse(messages);

  console.log(`Received message from ${programId} <${code}>: ${language}`);
  // here we can run the user code on docker container  

  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("Message processed");
  client.publish("ProblemDone", JSON.stringify({ programId, code, language, status: "TLE" }));
}
async function main() {
    await client.connect().then(() => {
        console.log("Connected to Redis");
      }).catch((err) => {
        console.error("Redis connection error:", err);
      });
    while (true) {
        const result = await client.brPop("messages", 0);
        //run the user code on docker container
        await processSubmission(result.element);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("Message received: ", result);
    }
}
main();

