const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const mongodbUrl = process.env.MONGODB_URI;
  //"mongodb+srv://Muhammad:WuRr5nIhlPGHii8B@cluster0-hebyh.mongodb.net/semicolonacademy?retryWrites=true&w=majority"; // TODO: PUT YOUR VALID MONGODB CONNECTION URL HERE <-

// if (!process.env.MONGODB_URI) {
//   console.log(
//     "\x1b[33m%s\x1b[0m",
//     'Please set the mongodb connection first in -> "server/models/mongo.config.js"\n'
//   );
//   return;
// }
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  console.log(`MongoDB Connected ${conn.connection.host}`);

}
// const db = mongoose.connection;

// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//   console.log("Connected to Database Video Requests");
// });

module.exports = connectDB;
