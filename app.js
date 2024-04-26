import express from "express";
import mongoose from "mongoose";
import router from "./routes/user-routes.cjs";
import blogRouter from "./routes/blog-routes.cjs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", router);
app.use("/api/blog", blogRouter);

mongoose
  .connect(
    "mongodb://brother:Rvuk2Ozwg27pReDe@ac-sgjve7j-shard-00-00.t9yrb0z.mongodb.net:27017,ac-sgjve7j-shard-00-01.t9yrb0z.mongodb.net:27017,ac-sgjve7j-shard-00-02.t9yrb0z.mongodb.net:27017/?ssl=true&replicaSet=atlas-1ln52v-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => app.listen(5000))
  .then(() => console.log("Connected to database and listening on port 5000"))
  .catch((err) => console.log(err));
