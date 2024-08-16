const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

/* middleware */
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.USERPASS}@cluster0.19fl87e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const database = client.db('cardoctorDB');
    const categoriesCollection = database.collection('categoryDB');
    const partsCollection = database.collection('partsDB');
    const servicesCollection = database.collection('serviceDB');

    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );

    /* ROUTES */

    // fetch all categories
    app.get('/categories', async (req, res) => {
      const result = await categoriesCollection.find().toArray();
      res.send(result);
    });

    //fetch all parts
    app.get('/parts', async (req, res) => {
      const result = await partsCollection.find().toArray();
      res.send(result);
    });

    //fetch all services
    app.get('/services', async (req, res) => {
      const result = await servicesCollection.find().toArray();
      res.send(result);
    });

    // fetch top rating data
    app.get('/top-rated', async (req, res) => {
      const topRated = await partsCollection
        .aggregate([{ $sort: { rating: -1 } }])
        .toArray();
      res.send(topRated);
    });
  } catch (err) {
    console.log(err);
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is running');
});
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
