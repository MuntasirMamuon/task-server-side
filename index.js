require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ovmtlgi.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
    try {
      // await client.connect();
      const taskCollection = client.db("taskCollections").collection("task");
      // ========================================================
      // task delete function start
      // ==========================================
      app.delete("/deleteTask/:id", async (req, res) => {
        const id = req?.params?.id;
        console.log(id);
        if (!id) {
          throw new Error("Invalid Id");
        }
        const query = { _id: new ObjectId(id) };
        console.log(query);
        const result = await taskCollection.deleteOne(query);
        res.send(result);
      });
  
      // ========================================================
      // task delete function end
      // ==========================================
  
      // ========================================================
      // task update status function start
      // ==========================================
      app.patch("/task/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedStatus = req.body;
  
        const updateDoc = {
          $set: {
            status: updatedStatus.status,
          },
        };
        const result = await taskCollection.updateOne(filter, updateDoc);
        res.send(result);
      });
  
      // ========================================================
      // task update status function end
      // ==========================================
  
      // ========================================================
      // task update function start
      // ==========================================
      app.put("/updateTask/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        console.log(filter);
        const options = { upsert: true };
  
        const update = {
          $set: {
            title: req?.body?.title,
            date: req?.body?.date,
            status: req?.body?.status,
            des: req?.body?.des,
          },
        };
  
        const result = await taskCollection.updateOne(filter, update, options);
        console.log(result);
        res.send(result);
      });
  
      // ========================================================
      // task update function end
      // ==========================================
  
      // ========================================================
      // task add function start
      // ==========================================
  
      app.post("/addData", async (req, res) => {
        const data = req.body;
        console.log(data);
        const result = await taskCollection.insertOne(data);
        res.send(result);
      });
  
      // ========================================================
      // task add function end
      // ==========================================
  
      // ========================================================
      // task read function start
      // ==========================================
      app.get("/addData", async (req, res) => {
        const result = await taskCollection.find().toArray();
        res.send(result);
      });
      // ========================================================
      // task read function end
      // ==========================================
      // Connect the client to the server	(optional starting in v4.7)
  
      // Send a ping to confirm a successful connection
      // await client.db("admin").command({ ping: 1 });
  
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    } finally {
      // Ensures that the client will close when you finish/error
      //  await client.close();
    }
  }
  run().catch(console.dir);
  
  app.get("/", (req, res) => {
    res.send("Server is running");
  });
  
  app.listen(port, () => {
    console.log(`Server is  sitting on Port${port}`);
  });
  