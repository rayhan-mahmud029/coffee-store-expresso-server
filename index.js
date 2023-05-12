const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello, Coffee Store Express server running')
})


// middleware
app.use(cors())
app.use(express.json())


// ---------------------
//   MONGODB CODE STARTS HERE

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1o3onh9.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        // create db and set collection
        const database = client.db("coffeeDB");
        const coffeeCollection = database.collection("coffee");

        // read coffee data
        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            result = await cursor.toArray()
            res.send(result)
        })

        // add coffee items
        app.post('/coffee', async (req, res) => {
            const coffee = req.body;
            console.log(coffee);

            // insert a document/coffee item
            const result = await coffeeCollection.insertOne(coffee);
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

//   MONGODB CODE ENDS HERE
// ----------------------


app.listen(port, () => {
    console.log(`The server is running in port: ${port}`);
})