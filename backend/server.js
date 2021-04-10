import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouters.js";
import orderRouter from "./routers/orderRouter.js";

//const Razorpay = require("razorpay");
//import Razorpay from "razorpay";

dotenv.config();
const app = express();
app.use(express.json()); // to parse json with the body of post request
app.use(express.urlencoded({ extended: true })); // to parse json with the body of post request

mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

//const key_id = "rzp_test_aEKLjl6zuBJKqc";
//const key_secret = "BVAYmBxWLIksNU3W5FDYSM9G";
//const instance = new Razorpay({ key_id, key_secret });
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.get("/api/config/paypal", (req, res) => {
  res.send(
    /*`${process.env.PAYPAL_CLIENT_ID}`||*/ "AQgOTn_VAsGZgoZyVgcBEpuOPnN20gzkbGw36f7h2KnnRfD3A34O5YP4QydTLefxyJMEZFclGolpBEmQ"
  );
});

app.get("/", (req, res) => {
  res.send("server is ready");
});
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
