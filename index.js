const user = "mobileWizardUser";
const password = "qFyWTEg2fLKImH5P";


const express = require('express');
const cors = require('cors');
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://mobileWizardUser:qFyWTEg2fLKImH5P@cluster0.rmad3ac.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1});
async function run() {
    try {
        const usersCollection = client.db('mobileWizard').collection('users');
        const productCollection = client.db('mobileWizard').collection('products');

        app.post('/users', async (req, res) => {
            const user = req.body;
            // TODO: make sure you do not enter duplicate user email
            // only insert users if the user doesn't exist in the database
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email: email};
            const user = await usersCollection.findOne(query);
            res.send(user);
        });

        app.get('/users/role/:role', async (req, res) => {
            const role = req.params.role;
            const query = {role: role};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
        });

        app.post('/products', async (req, res) => {
            const newproduct = req.body;
            const result = await productCollection.insertOne(newproduct);
            res.send(result);
        });

        app.get('/products/:email', async (req, res) => {
            const email = req.params.email;
            const query = {selleremail: email};
            const result = await productCollection.find(query).toArray();
            res.send(result);
        });

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(filter);
            res.send(result);
        });

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
                $set: {
                    advertised: true,
                }
            };

            const result = await productCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = {category: id};
            const result = await productCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/advertised', async (req, res) => {
            const query = {advertised: true};
            const result = await productCollection.find(query).toArray();
            console.log(result);
            res.send(result);
        });


    }
    finally {

    }

}
run().catch(console.log);

app.get('/', async (req, res) => {
    res.send('mobile wizard server is running');
});

app.listen(port, () => console.log(`mobile wizard server is running on ${port}`));
