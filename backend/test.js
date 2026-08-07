const mongoose = require("mongoose");

const uri =
  "mongodb+srv://2300030055:Indianarmy7@cluster0.7ovxytu.mongodb.net/wcms?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected Successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });