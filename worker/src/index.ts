import { createClient } from "redis";

const client = createClient();

async function processSubmission(submission: string) {
    const { problemId, code, language, userId } = JSON.parse(submission);
    console.log("🚀 ~ processSubmission ~ userId:", userId)
    console.log("🚀 ~ processSubmission ~ language:", language)
    console.log("🚀 ~ processSubmission ~ code:", code)
    console.log("🚀 ~ processSubmission ~ problemId:", problemId)
    
    await new Promise((resolve)=> setTimeout(resolve, 1000));
    console.log(`Finished processing submission for problemId ${problemId}.`);
}

async function startWorker() {
    try {
        await client.connect();
        console.log("Worker connected to Redis.");

        while(true){// It will keep pooling queue
           const submission = await client.brPop('submission', 0);
           console.log("🚀 ~ startWorker ~ submission:", submission)
           await processSubmission(submission.element);
        }
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}
startWorker();