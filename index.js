const express = require('express');
const {MongoClient} = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000 ;

app.use(cors());
app.use(express.json());

// myMongoDb1
// 2fIoBfbWCFNO9Cf7

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ncoou.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);

async function run(){
    try{
        await client.connect();
        // console.log("database connected");
        const database = client.db('emaJohnData');
        const productCollection = database.collection('products');

        // GET API 
        app.get('/products',async (req,res)=>{
            // console.log(req.query);
            const cursor = productCollection.find({});

            const page = req.query.size;
            const size = parseInt(req.query.size);

            let product;

            const count = await cursor.count();

            if(page){
                
                product = await cursor.skip(page * size).limit(size).toArray();
            }
            else{
                product = await cursor.toArray();
            }
            
            

            res.send({count,product});

        });
    }
    finally{
        // await client.close();
    }
};

run().catch(console.dir);



app.get('/',(req,res)=>{

    res.send('server running successfully');

})

app.listen(port,()=>{
    console.log("server hitting");
})