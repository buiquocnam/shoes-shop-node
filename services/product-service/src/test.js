const mongoose = require("mongoose");

const uri = "mongodb://root:abc123456@mongodb:27017/cloud?authSource=admin";

mongoose.connect(uri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err))
  .finally(() => mongoose.connection.close());
