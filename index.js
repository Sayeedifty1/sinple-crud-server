const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// TODO: Middleware

app.use(cors());
// TODO: express.json() to get the req.body, without this the body will be undefined
app.use(express.json());

// Sayeed
// qMPi88ougTx1jWjq



const uri = "mongodb+srv://Sayeed:qMPi88ougTx1jWjq@cluster0.nsyuaxc.mongodb.net/?retryWrites=true&w=majority";

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
        await client.connect();


        //! from node mognodb Crud
        const database = client.db("usersDB");
        const UserCollection = database.collection("users");


        app.get('/users', async (req, res) => {
            const cursor = UserCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const user = await UserCollection.findOne(query);
            res.send(user);
        })

        // TODO: Posting new json
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log('new user', user);
            const result = await UserCollection.insertOne(user);
            res.send(result);
        });
        // TODO: Updating a user
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            console.log(id, user);

            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedUser = {
                $set: {
                    name: user.name,
                    email: user.email
                }
            }

            const result = await UserCollection.updateOne(filter, updatedUser, options);
            res.send(result);

        })

        // TODO: for deleting a user
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log('delete from db', id);
            // ! if new don't give new there will be error
            const query = { _id: new ObjectId(id) }
            const result = await UserCollection.deleteOne(query);
            res.send(result);
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




app.get('/', (req, res) => {
    res.send('simple CRUD is running');
})
app.listen(port, () => {
    console.log(`simple CRUD is running on port: ${port}`);
})