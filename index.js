const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(express.json());
app.use(cors());


// use info :::
// useName: arnotes
// password: 1hFN9IuVuHcXgw62

const uri =
  "mongodb+srv://arnotes:1hFN9IuVuHcXgw62@notestracker.3xpsmly.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});



async function run() {
  try {
    await client.connect();
    const notesCollection = client.db("notesTake").collection("notes");



    //get api to read all notes ::
    //Api : http://localhost:5000/notes
    app.get('/notes', async(req, res) => {
     
      const q = req.query;
      console.log(q)

      const cursor = notesCollection.find( q)
      const result = await cursor.toArray() 
      res.send(result)
    })





    // create notesTaker:::
    //Api : http://localhost:5000/note
    /* 
    body{
    "userName": "abdul Karim",
    "textData": "designer"
}
    */ 
    app.post('/note', async(req, res) => {
      const data = req.body;
      console.log(data)

      const result = await notesCollection.insertOne(data)
      res.send(result)
    })
   




    //update notesTaker ::::
    //Api: http://localhost:5000/note/6436f1a1790508c89adb3110
    app.put('/note/:id', async(req, res) => {
      const id = req.params.id
      const data = req.body
      console.log(data)
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          userName: data.userName,
           textData: data.textData
        },
      };
      const result = await notesCollection.updateOne(filter, updateDoc, options);
      res.send(result)
  
      // console.log('form put methoad',id)

    })





    // delete noteTaker:::
    //Api url ; http://localhost:5000/note/6436f1a1790508c89adb3110
    app.delete('/note/:id', async(req, res) => {
      const id = req.params.id
      const filter = {_id: new ObjectId(id)};
      const result = notesCollection.deleteOne(filter)
      res.send(result)
    })




  } finally {
  }
}

run().catch(console.dir);







// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//     console.log("connected")

// //   client.close();
// });

app.get("/", (req, res) => {
  res.send("Welcome Note");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
