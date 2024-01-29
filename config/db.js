const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, {
      useNewUrlParser: true,
    });
    console.log(
      "Databse connected successfully."
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};
connectDB().catch(console.dir);

module.exports = connectDB;
