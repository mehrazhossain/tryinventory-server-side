const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// database connectivity and so on
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uovn6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client
      .db('tryinventory-db')
      .collection('product');

    await client.connect();
    const blogCollection = client.db('tryinventory-db').collection('blog');

    // POST API
    app.post('/manage-inventory/add-new-item', async (req, res) => {
      const newProduct = req.body;
      console.log('adding new product', newProduct);

      const result = await productCollection.insertOne(newProduct);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result);
    });

    // POST API for Blogs
    app.post('/blog/add-blog', async (req, res) => {
      const newBlog = req.body;

      const result = await blogCollection.insertOne(newBlog);
      res.send(result);
    });

    // GET API for Blogs
    app.get('/blog', async (req, res) => {
      const cursor = blogCollection.find();
      const blogs = await cursor.toArray();
      res.send(blogs);
    });

    // GET API
    app.get('/product', async (req, res) => {
      const cursor = productCollection.find();
      const products = await cursor.toArray();
      res.send(products);
    });

    // GET API for Email based find
    app.get('/user/product', async (req, res) => {
      const email = req.query.email;
      const query = { email };
      const cursor = productCollection.find(query);
      const userProducts = await cursor.toArray();
      res.send(userProducts);
    });
    console.log('testing product collection for heroku server');

    // get a blog using id
    app.get('/blog/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const blog = await blogCollection.findOne(query);
      res.send(blog);
    });

    // get a product using id
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });

    // update product
    app.put('/product/:id', async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          name: updatedProduct.name,
          supplier: updatedProduct.supplier,
          image: updatedProduct.image,
          price: updatedProduct.price,
          quantity: updatedProduct.quantity,
          description: updatedProduct.description,
          sold: updatedProduct.sold,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    // delete a product
    app.delete('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Welcome to TryInventory server');
});

app.listen(port, () => {
  console.log('Server running on port', port);
});
