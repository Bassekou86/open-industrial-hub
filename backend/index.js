const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// Simuler plusieurs machines
let machines = [
  { id: 1, name: "Machine-01", status: "RUN", productionCount: 20, cycleTime: 5, totalTime: 115, runTime: 100, availability: 87.0 },
  { id: 2, name: "Machine-02", status: "STOP", productionCount: 15, cycleTime: 6, totalTime: 120, runTime: 80, availability: 67.0 },
  { id: 3, name: "Machine-03", status: "RUN", productionCount: 30, cycleTime: 4, totalTime: 150, runTime: 140, availability: 93.0 },
];

// Route pour récupérer toutes les machines
app.get("/machines", (req, res) => {
  // Mettre à jour certaines valeurs pour simuler l'activité
  machines.forEach(machine => {
    if(machine.status === "RUN"){
      machine.productionCount += 1;
      machine.runTime += machine.cycleTime;
      machine.totalTime += machine.cycleTime;
      machine.availability = ((machine.runTime / machine.totalTime) * 100).toFixed(1);
    }
  });
  res.json(machines);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
