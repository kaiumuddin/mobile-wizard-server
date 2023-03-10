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


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rmad3ac.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1});
async function run() {
    try {
        const usersCollection = client.db('mobileWizard').collection('users');
        const productCollection = client.db('mobileWizard').collection('products');

        // create new user
        app.post('/users', async (req, res) => {
            const user = req.body;

            const query = {email: user.email};
            const found = await usersCollection.findOne(query);

            if (!found) {
                const result = await usersCollection.insertOne(user);
                res.send(result);
            }

            res.send(found);

        });

        // find a user
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email: email};
            const user = await usersCollection.findOne(query);
            res.send(user);
        });

        // find a user role
        app.get('/users/role/:role', async (req, res) => {
            const role = req.params.role;
            const query = {role: role};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });

        // delete a user
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
        });

        // create a product
        app.post('/products', async (req, res) => {
            const newproduct = req.body;
            const result = await productCollection.insertOne(newproduct);
            res.send(result);
        });

        // products by seller
        app.get('/products/:email', async (req, res) => {
            const email = req.params.email;
            const query = {selleremail: email};
            const result = await productCollection.find(query).toArray();
            res.send(result);
        });

        // delete a product by seller
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(filter);
            res.send(result);
        });

        // update advertise
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

        // product by category
        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = {category: id};
            const result = await productCollection.find(query).toArray();
            res.send(result);
        });

        // advertise items
        app.get('/advertised', async (req, res) => {
            const query = {advertised: true};
            const result = await productCollection.find(query).toArray();
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
