const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(express.json());

app.use(
    cors({
        origin: [
            "https://e-commerce-backend-fg1k.onrender.com",
            "https://shopee-246d9.web.app",
            "https://e-commerce-frontend-psi-ten.vercel.app/"
          ], 
      credentials: true,
    })
  );
  
// cookie parser middleware
app.use(cookieParser());

//

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.50gak.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client.db("e-commerce").collection("users");
    const featuredItem = client.db("e-commerce").collection("FeaturedItem");
    const trendingProducts = client
      .db("e-commerce")
      .collection("trendingProducts");
    const categoryPage = client.db("e-commerce").collection("CategoryPage");
    const deals = client.db("e-commerce").collection("deals");
    const newArrivals = client.db("e-commerce").collection("newArrivals");
    const ElectronicsItem = client
      .db("e-commerce")
      .collection("Electronics_Item");
    const electronicsDealsCoolingAc = client
      .db("e-commerce")
      .collection("electronicsDealsCoolingAc");
    const refrigerators = client.db("e-commerce").collection("refrigerators");
    const WashingMachines = client
      .db("e-commerce")
      .collection("WashingMachines");
    const ElectronicsAccessorie = client
      .db("e-commerce")
      .collection("ElectronicsAccessorie");
    const cartItems = client.db("e-commerce").collection("Cart");
    const wishList = client.db("e-commerce").collection("Wishlist");
    const seller = client.db("e-commerce").collection("seller");
    const AllSellerProducts = client.db("e-commerce").collection("AllSellerProducts");
    const userIssue = client.db("e-commerce").collection("userIssue");
    const homeGardenItems = client.db("e-commerce").collection("homeGardenItems");
    const fashionItems = client.db("e-commerce").collection("fashionItems");
    const storePayments = client.db("e-commerce").collection("payment");
    const addresses = client.db("e-commerce").collection("addresses");

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const result = await userCollection.findOne({ email: email });
      res.send(result);
    });
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const result = await userCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
   
    app.patch('/users/:email', async (req, res) => {
        const email = req.params.email;
        const updatedData = req.body;
    
        const filter = { email: email };
        const updateDoc = {
            $set: {}
        };
    
        if (updatedData.name) {
            updateDoc.$set.name = updatedData.name;
        }
    
        if (updatedData.photoURL) {
            updateDoc.$set.photoURL = updatedData.photoURL;
        }
    
        const result = await userCollection.updateOne(filter, updateDoc);
        res.send(result);
    });
    

    app.patch("/users/:id", async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
      
        try {
          const result = await userCollection.updateOne(
            
            { _id: new ObjectId(id) },
            { $set: { status } }
          );
          console.log(result)
          res.send(result);
        } catch (error) {
          res.status(500).send({ error: "Failed to update status" });
        }
      });
      

    app.get("/featuredItems", async (req, res) => {
      const result = await featuredItem.find().toArray();
      res.send(result);
    });
    app.get("/featuredItems/:id", async (req, res) => {
      const id = req.params.id;
      const result = await featuredItem.findOne({ _id: id });

      res.send(result);
    });
    app.get("/trendingProducts", async (req, res) => {
      const result = await trendingProducts.find().toArray();
      res.send(result);
    });
    app.get("/categoryPage", async (req, res) => {
      const result = await categoryPage.find().toArray();
      res.send(result);
    });
    // Create a new product
    app.post("/categoryPage", async (req, res) => {
      try {
        const product = req.body;
        // Basic validation
        if (!product.name || !product.price || !product.category) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        const result = await categoryPage.insertOne(product);
        res.status(201).json({
          success: true,
          message: "Product created successfully",
          data: result,
        });
      } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Failed to create product" });
      }
    });

    // Get single product by ID
    app.get("/categoryPage/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await categoryPage.findOne(query);

        if (!result) {
          return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(result);
      } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Failed to fetch product" });
      }
    });
    // Update a product
    app.patch("/categoryPage/:id", async (req, res) => {
        try {
            const id = req.params.id;
            const updates = req.body;
            const filter = { _id: new ObjectId(id) };
            
            const updateDoc = {
                $set: updates
            };
            
            const result = await categoryPage.updateOne(filter, updateDoc);
            
            if (result.matchedCount === 0) {
                return res.status(404).json({ message: "Product not found" });
            }
            
            res.status(200).json({
                success: true,
                message: "Product updated successfully",
                data: result
            });
        } catch (error) {
            console.error("Error updating product:", error);
            res.status(500).json({ message: "Failed to update product" });
        }
    });

    // Delete a product
    app.delete("/categoryPage/:id", async (req, res) => {
        try {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await categoryPage.deleteOne(query);
            
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "Product not found" });
            }
            
            res.status(200).json({
                success: true,
                message: "Product deleted successfully",
                data: result
            });
        } catch (error) {
            console.error("Error deleting product:", error);
            res.status(500).json({ message: "Failed to delete product" });
        }
    });

    app.get("/deals", async (req, res) => {
      const result = await deals.find().toArray();
      res.send(result);
    });
    app.get("/newArrivals", async (req, res) => {
      const result = await newArrivals.find().toArray();
      res.send(result);
    });
    app.get("/ElectronicsItem", async (req, res) => {
      const result = await ElectronicsItem.find().toArray();
      res.send(result);
    });
    app.get("/ElectronicsItem/:id", async (req, res) => {
      const id = req.params.id;
      console.log("e", id);
      const result = await ElectronicsItem.findOne({ _id: new ObjectId(id) });
      console.log(result);
      res.send(result);
    });

    app.get("/electronicsDealsCoolingAc", async (req, res) => {
      const result = await electronicsDealsCoolingAc.find().toArray();
      res.send(result);
    });
    app.get("/refrigerators", async (req, res) => {
      const result = await refrigerators.find().toArray();
      res.send(result);
    });
    app.get("/WashingMachines", async (req, res) => {
      const result = await WashingMachines.find().toArray();
      res.send(result);
    });
    app.get("/ElectronicsAccessorie", async (req, res) => {
      const result = await ElectronicsAccessorie.find().toArray();
      res.send(result);
    });
//cart
    app.post("/cartItems", async (req, res) => {
  try {
    const cartItem = req.body;

    const query = {
      productId: cartItem.productId,
      email: cartItem.email, // Check if THIS user already added
    };

    const existingItem = await cartItems.findOne(query);

    if (existingItem) {
      return res.status(409).json({ message: "Item already in your cart" });
    }

    const result = await cartItems.insertOne(cartItem);
    res.status(201).json({ message: "Item added to cart", data: result });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get("/cartItems", async (req, res) => {
      const result = await cartItems.find().toArray();
      res.send(result);
    });

    app.get("/cartItems/:email", async (req, res) => {
      const email = req.params.email;
      const result = await cartItems.find({ email }).toArray();
      res.send(result);
    });
    app.delete("/cartItems/:id", async (req, res) => {
      const id = req.params.id;
      const result = await cartItems.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    app.delete("/cartItems/:email",async(req,res)=>{
        const email = req.params.email;
        const result = await cartItems.deleteOne({email:email})
        res.send(result)
    })

    //

    app.post("/wishList", async (req, res) => {
      const { productId, email } = req.body;

      const query = { productId, email };

      const existingItem = await wishList.findOne(query);

      if (existingItem) {
        return res.status(409).json({ message: "Item already in wishlist" });
      }

      const wishListItem = { productId, email }; // ✅ Now it's defined
      const result = await wishList.insertOne(wishListItem);
      res.status(201).json(result);
    });
    app.get("/wishList/:email", async (req, res) => {
      const email = req.params.email;
      const result = await wishList.find({ email }).toArray();
      res.send(result);
    });
    // DELETE a specific item from wishList by user email and productId
app.delete('/wishList/:email/:productId', async (req, res) => {
    const { email, productId } = req.params;
    
    try {
      const result = await wishList.deleteOne({
        email: email,
        productId: productId,
      });
  
      if (result.deletedCount > 0) {
        res.status(200).send({ message: "Item removed from wishlist" });
      } else {
        res.status(404).send({ message: "Item not found in wishlist" });
      }
    } catch (error) {
      console.error("Failed to remove item from wishlist:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });
  
    


    app.post("/seller", async (req, res) => {
      const { sellerData } = req.body;
      const result = await seller.insertOne(sellerData);
      res.status(201).json(result);
    });
    app.get("/seller/:email", async (req, res) => {
      const email = req.params.email;
      const result = await seller.find({ email }).toArray();
      res.send(result);
    });
    app.get("/seller",async(req,res)=>{
        const result = await seller.find().toArray();
        res.send(result);
    })
    app.patch("/seller/:id", async (req, res) => {
        const id = req.params.id;
        const { status } = req.body;
        const result = await seller.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status } }
        );
        res.send(result);
      });
  
      app.delete("/seller/:id", async (req, res) => {
        try {
          const id = req.params.id;
          const result = await seller.deleteOne({ _id: new ObjectId(id) });
          
          if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Seller request not found" });
          }
          
          res.status(200).json({
            success: true,
            message: "Seller request deleted successfully",
            data: result
          });
        } catch (error) {
          console.error("Error deleting seller request:", error);
          res.status(500).json({ message: "Failed to delete seller request" });
        }
      });

      app.post("/sellerProducts", async (req, res) => {
        const product = req.body;
        const result = await AllSellerProducts.insertOne(product);
        res.send(result);
      });
      app.get("/sellerProducts", async (req, res) => {
        const result = await AllSellerProducts.find().toArray();
        res.send(result);
      })
      app.get("/sellerProducts/:email", async (req, res) => {
        const email = req.params.email;
        const result = await AllSellerProducts.find({ email }).toArray();
        res.send(result);
        });
      app.delete("/sellerProducts/:id", async (req, res) => {
        const id = req.params.id;
        const result = await AllSellerProducts.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      });


      app.patch('/sellerProducts/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const updatedData = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: updatedData,
            };
            const result = await AllSellerProducts.updateOne(filter, updateDoc);
            res.send(result);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Something went wrong' });
        }
    });
    app.post("/userIssue", async (req, res) => {
      const issue = req.body;
      const result = await userIssue.insertOne(issue);
      res.send(result);
    });
    app.get("/userIssue", async (req, res) => {
      const result = await userIssue.find().toArray();
      res.send(result);
    })

    //homeGardenItems
    app.get("/homeGardenItems", async (req, res) => {
      const result = await homeGardenItems.find().toArray();
      res.send(result);
    })

    //fashionItems
    app.get("/fashionItems", async (req, res) => {
      const result = await fashionItems.find().toArray();
      res.send(result);
    })
    app.post("/fashionItems", async (req, res) => {
      const fashionItem = req.body;
      const result = await fashionItems.insertOne(fashionItem);
      res.send(result);
    });

  //payment
  // Create Payment Intent
  app.post('/create-payment-intent', async (req, res) => {
    try {
      const { price } = req.body;
      const amount = parseInt(price * 100); // Stripe uses cents
      console.log(amount)
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
      });
      
      res.send({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      console.error('Error creating payment intent:', err); // Log error details
      res.status(500).send({ error: err.message });
    }
  });
  
  app.post("/save-payment", async (req, res) => {
    try {
      const paymentData = req.body;
      console.log(paymentData)
      const result = await storePayments.insertOne(paymentData);
      res.status(201).json({ message: "Payment saved successfully", result });
    } catch (error) {
      res.status(500).json({ error: "Failed to save payment" });
    }
    });
    app.delete("/save-payment/:id", async (req, res) => {
        const id = req.params.id;
        const result = await storePayments.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
    });
    
  
    app.get('/payment/:email', async (req, res) => {
      const query = { email: req.params.email };
      try {
          // Use find() if expecting multiple documents
          const result = await storePayments.find(query).toArray(); 
          res.send(result);
      } catch (error) {
          console.error("Error fetching payment data:", error);
          res.status(500).send({ error: "Failed to fetch payment data" });
      }
  });
    app.get('/allPayment', async (req, res) => {
      try {
          // Use find() if expecting multiple documents
          const result = await storePayments.find().toArray(); 
          res.send(result);
      } catch (error) {
          console.error("Error fetching payment data:", error);
          res.status(500).send({ error: "Failed to fetch payment data" });
      }
  });

  //addresses

// Address Endpoints

// Create a new address
app.post('/addresses', async (req, res) => {
    try {
      const { email, userId, ...addressData } = req.body;
  
      // If setting as default, unset any existing default address
      if (addressData.isDefault) {
        await addresses.updateMany(
          { userId },
          { $set: { isDefault: false } }
        );
      }
  
      const newAddress = {
        email,
        userId,
        ...addressData,
        createdAt: new Date()
      };
  
      const result = await addresses.insertOne(newAddress);
      
      // Create 2dsphere index if it doesn't exist
      try {
        await addresses.createIndex({ location: '2dsphere' });
      } catch (indexError) {
        console.log('Index already exists or error creating index:', indexError);
      }
  
      res.status(201).json({ ...newAddress, _id: result.insertedId });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Get all addresses for a user
  app.get('/addresses/:email', async (req, res) => {
    try {
      const userAddresses = await addresses
        .find({ email: req.params.email })
        .sort({ isDefault: -1, createdAt: -1 })
        .toArray();
      
      res.json(userAddresses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Update an address
  app.put('/addresses/:id', async (req, res) => {
    try {
      const { userId, ...updateData } = req.body;
  
      // If setting as default, unset any existing default address
      if (updateData.isDefault) {
        await addresses.updateMany(
          { userId },
          { $set: { isDefault: false } }
        );
      }
  
      const result = await addresses.findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
  
      if (!result.value) {
        return res.status(404).json({ message: 'Address not found' });
      }
  
      res.json(result.value);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete an address
  app.delete('/addresses/:id', async (req, res) => {
    try {
        const result = await addresses.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        // Check deletedCount instead of value
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.json({ message: 'Address deleted successfully', deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
  
  // Set default address
  app.patch('/addresses/:id/set-default', async (req, res) => {
    try {
      // First find the address to get the userId
      const address = await addresses.findOne({
        _id: new ObjectId(req.params.id)
      });
  
      if (!address) {
        return res.status(404).json({ message: 'Address not found' });
      }
  
      // Unset all other default addresses
      await addresses.updateMany(
        { userId: address.userId },
        { $set: { isDefault: false } }
      );
  
      // Set this address as default
      const result = await addresses.findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: { isDefault: true } },
        { returnDocument: 'after' }
      );
  
      res.json(result.value);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });







    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//

app.get("/", (req, res) => {
  res.send("Hello from my server");
});

app.listen(port, () => {
  console.log("My simple server is running at", port);
});
