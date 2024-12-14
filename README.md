Redis is a versatile, open-source, in-memory data store often used for caching, databases, and queues. Here's how Redis can be implemented for core operations and as a queue system.

---

### **Core Redis Commands**

#### **SET/GET/DEL**

Basic commands to store, retrieve, and delete data:

* **Set Data:**
    
    ```bash
    SET mykey "Hello"
    ```
    
* **Get Data:**
    
    ```bash
    GET mykey
    ```
    
    **Delete Data:**
    
    ```bash
    DEL mykey
    ```
    

#### **HSET/HGET/HDEL (Hashes)**

Hash commands store fields and values under a single key:

```bash
HSET user:100 name "John Doe" email "user@example.com" age "30"  
HGET user:100 name  
HGET user:100 email
```

---

### **Redis as a Queue**

Redis excels as a lightweight queue system. For example, platforms like LeetCode handle asynchronous processing using queues.

#### **Pushing to a Queue**

Pushes items to the left (head) of the queue:

```bash
LPUSH problems 1  
LPUSH problems 2
```

#### **Popping from a Queue**

Pops items from the right (tail) of the queue:

```bash
RPOP problems
```

#### **Blocked Pop (BRPOP)**

Blocks the operation until data is available or the timeout is reached:

* **Indefinite Block:**
    
    ```bash
    BRPOP problems 0
    ```
    
* **Timeout Block:**
    
    ```bash
    BRPOP problems 30
    ```
    

---

### **Backend Server Implementation: LeetCode Queue Architecture**

![image](https://github.com/user-attachments/assets/3c295331-3671-4559-a843-afee41056b44)

Below is an example of a Node.js server using Redis to queue data:

#### **Backend Code**

```javascript
javascriptCopy codeimport express from "express";  
import { createClient } from "redis";  

const app = express();  
const client = createClient();  

client.on("error", (err) => console.log("Redis Client Error", err));  
client.connect();  

app.use(express.json());  

app.post("/submit", async (req, res) => {  
  const { name, email, message } = req.body;  
  try {  
    await client.lPush("messages", JSON.stringify({ name, email, message }));  
    res.json({ success: true, message: "Message sent successfully" });  
  } catch (error) {  
    res.json({ success: false, message: "Failed to send message" });  
  }  
});  

app.listen(3001, () => {  
  console.log("Server is running on port 3001");  
});
```

#### **Worker Code**

A worker continuously monitors the queue and processes tasks:

```javascript
javascriptCopy codeimport { createClient } from "redis";  

const client = createClient();  

async function main() {  
  await client.connect().then(() => {  
    console.log("Connected to Redis");  
  }).catch((err) => {  
    console.error("Redis connection error:", err);  
  });  

  while (true) {  
    const result = await client.brPop("messages", 0);  
    // Simulate task execution (e.g., running user code in Docker)  
    console.log("Message received: ", result);  

    await new Promise((resolve) => setTimeout(resolve, 1000));  
  }  
}  
main();
```

---

### **How It Works**

* **Primary Backend:** Accepts user requests (e.g., via POST) and queues data in Redis.
    
    e.g., See how the message is queued so that it can be assigned to a worker.
    
* [See how its work]("https://www.youtube.com/watch?v=excgBz0L9_Y")
    
* **Worker Nodes:** Monitor the queue and process tasks in parallel. Redis handles load balancing among workers.
    
* **Fault Tolerance:** If workers go down, Redis ensures queued data persists. Once workers recover, they resume processing seamlessly.
    
* [See how its work]("https://youtu.be/fKeVlBkHY5c")
    

Redis provides scalability and resilience, making it ideal for asynchronous processing scenarios like LeetCode submissions or video transcoding.

# **Pub subs**

Publish-subscribe (pub-sub) is a messaging pattern where messages are sent to a topic without knowing who, if anyone, will receive them, and subscribers listen for messages on topics they are interested in without knowing the source. This separation of publishers and subscribers enables highly scalable and flexible communication systems.

![image](https://github.com/user-attachments/assets/c8983c87-275c-499f-b20b-3b41a3675295)

**Subscribe to a topic**

For example, to subscribe to a topic named `problems_done`, you would use:

```bash
SUBSCRIBE problems_done
```

**Publishing to a topic**

For example, to publish the message `{id: 1, ans: 'TLE'}` to the `problems_done` topic, you would use

```bash
PUBLISH problems_done "{id: 1, ans: 'TLE'}"
```

Code for Node.js Implementation of Pub/Sub

```javascript
async function processSubmission(messages:string) {
  const {programId, code, language} = JSON.parse(messages);

  console.log(`Received message from ${programId} <${code}>: ${language}`);
  // here we can run the user code on docker container  

  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("Message processed");
  client.publish("ProblemDone", JSON.stringify({ programId, code, language, status: "TLE" }));
}
processSubmission(result.element);
```

Output:

![image](https://github.com/user-attachments/assets/8c775ea9-cff2-479a-a6a8-d1a99233a344)

## Full architecture of what we implemented here

![image](https://github.com/user-attachments/assets/c80d5b7b-c067-45d6-a212-c22e881344b6)

Its versatility makes Redis an excellent choice for building fault-tolerant, high-performance systems. Whether you're processing LeetCode submissions or building scalable microservices, Redis is a tool worth mastering.
