const express = require("express");
// mongoclient
const { MongoClient } = require("mongodb");
// mongo db id
const ObjectId = require("mongodb").ObjectId;

// corros conncetion
const cors = require("cors");

// for env file support
require("dotenv").config();

// our main app
const app = express();

// port define
const port = process.env.PORT || 5000;

// middleware
app.use(cors());

// for data processing
app.use(express.json());

// database uri
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.0gtlp.mongodb.net:27017,cluster0-shard-00-01.0gtlp.mongodb.net:27017,cluster0-shard-00-02.0gtlp.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-amsdfs-shard-0&authSource=admin&retryWrites=true&w=majority`;

// database client object
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//  database connect function
async function run() {
    try {
        await client.connect();
        console.log("Connected database");
        const database = client.db("dreamGlass");
        const userCollection = database.collection("users");
        const productsCollection = database.collection("products");
        const reviewsCollection = database.collection("reviews");
        const ordersCollection = database.collection("orders");

        // User POST API
        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.json(result);
            //console.log("hitting product post api", user);
        });

        // User GET API
        app.get("/users", async (req, res) => {
            const cursor = userCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });

        // User GET API by email
        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            res.json(user);
        });

        // USER Admin Role UPDATE PUT API
        app.put("/users/:email", async (req, res) => {
            const email = req.params.email;
            const data = req.body.role;
            const order = await userCollection.updateOne(
                { email: email },
                { $set: { role: data } },
                { upsert: true }
            );
            res.json(order);
            // console.log("Order put api hit", id, data);
        });

        // Product POST API
        app.post("/products", async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.json(result);
            console.log("hitting product post api", product);
        });

        // Product GET API
        app.get("/products", async (req, res) => {
            const cursor = productsCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });

        // Product GET API BY ID
        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query);
            res.json(result);
        });

        // Product DELETE API
        app.delete("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.deleteOne(query);
            res.json(product);
            //console.log('API hit', id);
        });

        // Reviews POST API
        app.post("/reviews", async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(result);
            //console.log("hitting review post api", review);
        });

        // Reviews GET API
        app.get("/reviews", async (req, res) => {
            const cursor = reviewsCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });

        // Order POST API
        app.post("/orders", async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
            //console.log("hitting order post api", order);
        });

        // Orders GET API
        app.get("/orders", async (req, res) => {
            const cursor = ordersCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });

        // Orders GET API  by user email
        app.get("/orders/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const cursor = ordersCollection.find(query);
            const result = await cursor.toArray();
            res.json(result);
        });

        // Order DELETE API
        app.delete("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const order = await ordersCollection.deleteOne(query);
            res.json(order);
            //console.log('API hit', id);
        });

        // ORDER STATUS UPDATE PUT API
        app.put("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body.status;
            const order = await ordersCollection.updateOne(
                { _id: ObjectId(id) },
                { $set: { status: data } },
                { upsert: true }
            );
            res.json(order);
            // console.log("Order put api hit", id, data);
        });
    } finally {
        //await client.close();
    }
}
run().catch(console.dir);

// ROOT API
app.get("/", (req, res) => {
    res.send("Running Shop Grid Root API on Browser");
});

// console output
app.listen(port, () => {
    console.log("Running Shop Grid Server in console", port);
});
