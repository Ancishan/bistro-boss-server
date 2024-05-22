const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nhcslav.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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


    const menuCollection = client.db("bistroDb").collection('menu');
    const reviewCollection = client.db("bistroDb").collection('reviews');
    const cartCollection = client.db("bistroDb").collection('carts');

    app.get('/menu', async(req, res) =>{
        const result = await menuCollection.find().toArray();
        res.send(result)
    })
   
    app.get('/reviews', async(req, res) =>{
        const result = await reviewCollection.find().toArray();
        res.send(result)
    })

    // carts collection
// database post krr por jei data save ache . ei bar database theke data backend ana
    app.get('/carts', async(req,res) =>{
      const email = req.query.email
      const query = { email: email};
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    })

    // database e UI(foodCard or addCart) theke data anar jnno step 1 then client side foodCard post krtte hbe
    app.post('/carts', async(req, res) =>{
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem)
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



app.get('/', (req, res) =>{
    res.send('boss is futing')
})

app.listen(port, () =>{
    console.log(`bistro boss port ${port}`)
})

/**
 * naming convetion
 * 
 * app.get('/users)
 * app.get('/users/:id)
 * app.post('/users)
 * app.put('/users)
 * app.patch('/users/:id')
 * */ 