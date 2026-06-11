require('dotenv').config();

const PORT = process.env.PORT;
const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

const run = async () => {
    try {
        await client.connect();
        const db = await client.db(process.env.DB_NAME);
        const jobsCollection = await db.collection(process.env.JOBS_COLLECTION);
        const applicationsCollection = await db.collection(process.env.APPLICATIONS_COLLECTION);

        app.get('/jobs', async (req, res) => {
            const cursor = jobsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobsCollection.findOne(query);
            res.send(result);
        });

        app.post('/api/jobs/applications', async (req, res) => {
            const newApplication = req.body;
            const result = await applicationsCollection.insertOne(newApplication);
            res.send(result);
        });

        app.get('/applications', async (req, res)=>{
            const cursor = applicationsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

    } finally {
        // await client.close();
    }
};

run().catch(console.dir);
app.listen(PORT, (req, res) => {
    console.log('running...!');
});