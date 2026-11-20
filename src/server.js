
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const path = require("path");


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static("src/public"));
app.use("/api/tasks", taskRoutes);


app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.json({
    message: "Swarm MongoDB Application is Running!"
  });
});



const PORT = process.env.PORT || 8080;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
