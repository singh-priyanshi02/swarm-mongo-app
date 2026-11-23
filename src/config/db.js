
const mongoose = require("mongoose");
const fs = require("fs");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI ||
      (process.env.MONGODB_URI_FILE
        ? fs.readFileSync(process.env.MONGODB_URI_FILE, "utf8").trim()
        : null);

    if (!mongoURI) {
      throw new Error("MongoDB URI is missing");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB Atlas Connected Successfully!");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
