const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("Mongo URI:", process.env.MONGODB_URI);

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("========== FULL ERROR ==========");
    console.error(error);
    console.error("===============================");
    process.exit(1);
  }
};

module.exports = connectDB;