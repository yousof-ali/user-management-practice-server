const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())






const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.lewcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    
    const userCollections = client.db('UserDB').collection("user");

    app.post('/user',async(req,res) => {
        const user = req.body
        const result = await userCollections.insertOne(user);
        res.send(result);
    })
    
    app.get('/users',async(req,res) => {
      const users = userCollections.find();
      const convert = await users.toArray();
      res.send(convert);
    })

    app.get('/user/:id',async(req,res) => {
         const id = req.params.id
         const query = {_id : new ObjectId(id)}
         console.log(id);
         const singleUser = await userCollections.findOne(query);
         res.send(singleUser);
    })

    app.put('/edit/:id',async(req,res) => {
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const option = {upsert:true}
      const updateContent = req.body
      console.log(updateContent);

      const edit = {
        $set:{
          name:updateContent.name,
          email:updateContent.email,
          gender:updateContent.gender,
          status:updateContent.status
        }
      }
      const result = await userCollections.updateOne(query,edit,option);

      res.send(result);
      
    })


    app.delete('/delete/:id',async(req,res) => {
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await userCollections.deleteOne(query);
      res.send(result);
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




app.get("/" , (req,res) => {
    res.send("User management practice server is running")
})

app.listen(port,() => {
    console.log(`user-management server is runnint on port ${port}`)
})
