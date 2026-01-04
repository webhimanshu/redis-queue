import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));

app.get("/", (req, resp) => {
  resp.json({ msg: "Hello from Server" });
});

app.post("/", async (req, resp) => {
  const { problemId, code, langauge, userId } = req.body;

  try {
    await client.lPush(
      "submission",
      JSON.stringify({ problemId, code, langauge, userId })
    );
    resp.status(200).send("Submission received and stored.");
  } catch (error) {
    console.error("Redis error:", error);
    resp.status(500).send("Failed to store submission.");
  }
});

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to Redis");

    app.listen(3000, () => {
      console.log("Server is running on 3000");
    });
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
}

startServer();
