const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ey7s4.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const inventoryCollection = client.db("active-buildings").collection("inventory");

        //get all users info
        app.get('/inventory', async (req, res) => {
            const inventory = await inventoryCollection.find().toArray();
            res.send(inventory)
        });


        //add a inventory
        app.post('/inventory', async (req, res) => {
            const inventory = req.body;
            const result = await inventoryCollection.insertOne(inventory);
            res.send(result);
        });
    }
    finally {
        //   await client.close();
    }
}
run().catch(console.dir);;


app.get('/', (req, res) => {
    res.send('Hello everyone from active builders!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})