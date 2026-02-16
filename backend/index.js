const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Open Industrial Hub API is running");
});

const machine = require("./src/simulator/machineSimulator");

app.get("/machines", (req, res) => {
  res.json(machine);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
