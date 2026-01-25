import "dotenv/config";
import express, { json, urlencoded } from "express";
import cors from "cors";
import sequelize from "./config/database.js";
import router from "./routes/routes.js";
import "./models/index.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:8081",
  }),
);

app.use(json());
app.use(urlencoded({ extended: true }));

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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
