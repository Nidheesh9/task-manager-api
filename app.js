import "dotenv/config";
import express from "express";
import cors from "cors";
import sequelize from "./config/database.js";
import router from "./routes/index.js";
import "./models/index.js";
import config from "./config/index.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:8081",
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  res.json({ message: "Welcome to my application." });
});

// DB connection
sequelize
  .authenticate()
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB error:", err));

// create tables (DEV ONLY)
await sequelize.sync();

app.use("/api", router);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}.`);
});
