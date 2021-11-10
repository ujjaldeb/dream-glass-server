const express = require('express');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.0gtlp.mongodb.net:27017,cluster0-shard-00-01.0gtlp.mongodb.net:27017,cluster0-shard-00-02.0gtlp.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-amsdfs-shard-0&authSource=admin&retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('db connected successfully');
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Dream Glass');
});

app.listen(port, () => {
    console.log(`listening at port: ${port}`);
});