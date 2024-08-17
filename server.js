const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.port || 5000;
const cookieParser = require('cookie-parser');

//express dot env
require('dotenv').config();
app.use(cors({
    origin:["http://localhost:5173"]
  }))

  //middleware to read the data from frontend
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_NAME}@cluster0.ecpul2e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
      const productCollection = client.db('ProductsDB').collection('product');
      

      app.get('/productsCount', async(req,res)=>{
        const count = await productCollection.estimatedDocumentCount();
        res.send({count})
      })

      app.get('/allProducts',async(req,res)=>{
        // const result = await productCollection.find().toArray();
        const {page, size} = req.query
        const result = await productCollection.find()
        .skip((parseInt(page) - 1) * parseInt(size))
        .limit(parseInt(size))
        .toArray();
        res.send(result);
      })





    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
















app.get('/', (req, res) => {
    res.send('server is running')
  })
  
  app.listen(port, () => {
    console.log(`Server is running on Port: ${port}`);
  })