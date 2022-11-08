const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')
require('dotenv').config()


//middle wire
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@cluster0.rx4i6uo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const servicesCollection = client.db('CloudKitchen').collection('services');
        const AllservicesCollection = client.db('CloudKitchen').collection('Allservices');
        // home page
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query);
            const services = await cursor.limit(3).toArray()
            res.send(services)
        })
        // service routes 
        app.get('/Allservices', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query);
            const AllServices = await cursor.toArray()
            res.send(AllServices)
        })
        // get data by id
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query);
            res.send(service)
        })

    }
    finally {

    }
}
run().catch(error => console.error(error))

app.get('/', (req, res) => {
    res.send('cloud kitchen running..')
})

app.listen(port, () => {
    console.log(`cloud kitchen coming soon${port}`)
})