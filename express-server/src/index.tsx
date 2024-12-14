import express from "express";
import { createClient } from "redis";

const app = express();
const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));
client.connect();
app.use(express.json());

app.post("/submit", async (req, res) => {
  const { programId, code, language } = req.body;
  try {
    await client.lPush("messages", JSON.stringify({ programId, code, language }));
    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    res.json({ success: false, message: "Failed to send message" });
  }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
    });
