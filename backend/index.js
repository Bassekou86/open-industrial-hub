const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

let machines = [
  { id: 1, name: "Machine-01", status: "RUN", productionCount: 20, cycleTime: 5, totalTime: 115, runTime: 100, availability: 87.0 },
  { id: 2, name: "Machine-02", status: "STOP", productionCount: 15, cycleTime: 6, totalTime: 120, runTime: 80, availability: 67.0 },
  { id: 3, name: "Machine-03", status: "RUN", productionCount: 30, cycleTime: 4, totalTime: 150, runTime: 140, availability: 93.0 },
];

// Log simple des événements
let eventLog = [];

app.get("/machines", (req, res) => {
  machines.forEach(machine => {
    // Simuler activité
    if(machine.status === "RUN"){
      machine.productionCount += 1;
      machine.runTime += machine.cycleTime;
      machine.totalTime += machine.cycleTime;
      machine.availability = ((machine.runTime / machine.totalTime) * 100).toFixed(1);
    }

    // Simuler changement aléatoire de status
    if(Math.random() < 0.05){ // 5% chance de changer de status
      const oldStatus = machine.status;
      const statuses = ["RUN","STOP","FAULT"];
      machine.status = statuses[Math.floor(Math.random() * statuses.length)];
      if(oldStatus !== machine.status){
        eventLog.push({ machine: machine.name, oldStatus, newStatus: machine.status, time: new Date().toLocaleTimeString() });
      }
    }
  });
  res.json({ machines, eventLog });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
