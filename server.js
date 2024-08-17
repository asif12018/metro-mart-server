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

      app.get('/filterOption', async(req,res)=>{
        const result = await productCollection.find().toArray();
        res.send(result);
      })

      app.get('/allProducts', async (req, res) => {
        const { page, size, brand, search, priceRange, sort, category } = req.query;
    
        const query = {};
    
        // // Filter by brand
        // if (brand) {
        //     query.brand = brand;
        // }
    
        // // Filter by search term in product name or description
        // if (search) {
        //     query.$or = [
        //         { name: { $regex: search, $options: 'i' } }, // Case-insensitive search
        //         { description: { $regex: search, $options: 'i' } }
        //     ];
        // }
    
        // // Filter by category
        // if (category) {
        //     query.category = category;
        // }
    
        // // Filter by price range
        // if (priceRange) {
        //     if (priceRange === 'Low Price') {
        //         query.price = { $lt: 500 };
        //     } else if (priceRange === 'Mid Price') {
        //         query.price = { $gte: 500, $lte: 1000 };
        //     } else if (priceRange === 'High Price') {
        //         query.price = { $gt: 1000 };
        //     }
        // }
    
        // // Sort by price
        // let sortOrder = {};
        // if (sort) {
        //     if (sort === 'High to Low') {
        //         sortOrder.price = -1;
        //     } else if (sort === 'Low to High') {
        //         sortOrder.price = 1;
        //     }
        // }
    
        // const result = await productCollection.find(query)
        //     .sort(sortOrder)
        //     .skip((parseInt(page) - 1) * parseInt(size))
        //     .limit(parseInt(size))
        //     .toArray();

        if (search) query.productName = { $regex: search, $options: "i" };
        if (category) query.category = category;
        if (brand) query.brand = brand;
        if (priceRange) {
          if (priceRange === "low") query.price = { $lt: 500 };
          else if (priceRange === "medium") query.price = { $gte: 500, $lt: 1000 };
          else if (priceRange === "high") query.price = { $gte: 1000 };
        }

        const result = await productCollection
        .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
    
        res.send(result);
    });
    





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