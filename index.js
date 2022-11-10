const express = require('express')
const app = express()
// var jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//middle wire
app.use(cors())
app.use(express.json())

// function verifyJwt(req, res, next) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).send({ message: 'unauthorized access' })
//     }
//     const token = authHeader.split(' ')[1]
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//         if (err) {
//             return res.status(403).send({ message: 'Forbidden access' })
//         }
//         req.decoded = decoded;
//         next()
//     });
// }
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@cluster0.rx4i6uo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const servicesCollection = client.db('CloudKitchen').collection('services');
        const allServicesCollection = client.db('CloudKitchen').collection('AllServices');
        const reviewsCollection = client.db('CloudKitchen').collection('reviews')
        // jwt 

        // app.post('/jwt', (req, res) => {
        //     const user = req.body;
        //     const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        //         expiresIn: "2 days"
        //     });
        //     res.send({ token })
        // })
        // home page
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query);
            const services = await cursor.limit(3).toArray()
            res.send(services)
        })
        // service routes 
        app.get('/AllServices', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query);
            const allServices = await cursor.toArray()
            res.send(allServices)
        })
        // get data by id
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query);
            res.send(service)
        })

        //review api
        app.post('/reviews', async (req, res) => {
            // const decoded = req.decoded;
            // if (decoded.email !== req.query.email) {
            //     res.status(403).send({ message: 'forbidden access' })
            // }
            // let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const reviews = req.body;
            const result = await reviewsCollection.insertOne(reviews);
            res.send(result);
        })

        //addServices api
        app.post('/AllServices', async (req, res) => {
            const addService = req.body;
            const result = await allServicesCollection.insertOne(addService);
            res.send(result);
        })

        // get reviews data
        app.get('/reviews', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewsCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })


        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const review = await reviewsCollection.findOne(query);
            res.send(review)
        })
        // Delete reviews data
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewsCollection.deleteOne(query);
            res.send(result);
        })

        // update data
        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const review = req.body;
            console.log(review)
            // const option = {upsert: true}
            // const updateReview = {
            //     $set: {
            //       reviewItem: reviews.review
            //     },
            //   };
            // const result = await reviewsCollection.updateOne(filter, updateReview, options);
            // res.send(result);
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