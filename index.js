const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.port || 5000;
const cookieParser = require('cookie-parser');

//express dot env
require('dotenv').config();
app.use(cors({
    origin:["http://localhost:5173","https://metro-mart.netlify.app"]
  }))

  //middleware to read the data from frontend
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://admin2:admin2@cluster0.ecpul2e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

      app.get('/filterOption', async(req,res)=>{
        const result = await productCollection.find().toArray();
        res.send(result);
      })


      app.get('/allProducts', async (req, res) => {
        const { page, size, brandName, searchName, priceRange, sortPrice, categoryName, sortDate } = req.query;

        console.log(req.query);
        const query = {};
        if (searchName) query.name = {$regex: searchName, $options:"i"};
        if (categoryName) query.category = categoryName;
        if (brandName) query.brand = brandName;
        
        if(priceRange) {
           if (priceRange == "Low") query.price = {$lt: 500};
           else if (priceRange == 'Mid') query.price = {$gte:500, $lt:1000};
           else if (priceRange == 'High') query.price = {$gte: 1000};
        }

        const sortOptions = {};
        if (sortPrice == 'LowToHigh') sortOptions.price = 1;
        else if( sortPrice == 'HighToLow') sortOptions.price = -1;

        if (sortDate == 'new') sortOptions.created_at = 1;
        if (sortDate == 'old') sortOptions.created_at = -1;

        const skip = (page - 1) * size;

        // const productsCount = await productCollection.countDocuments(query);
        // const totalPages = Math.ceil(productsCount / parseInt(size))

        const result = await productCollection.find(query).sort(sortOptions).skip(skip)
        .limit(parseInt(size)).toArray();
        res.send(result)
    }); 
    
    





    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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