const express = require("express");
const cors = require("cors");
const { WebSocketServer } = require("ws");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("🚀 Open Industrial Hub Backend is running");
});

let machines = [
  { id: 1, name: "Machine-01", status: "RUN", productionCount: 20, cycleTime: 5, totalTime: 115, runTime: 100, availability: 87.0 },
  { id: 2, name: "Machine-02", status: "STOP", productionCount: 15, cycleTime: 6, totalTime: 120, runTime: 80, availability: 67.0 },
  { id: 3, name: "Machine-03", status: "RUN", productionCount: 30, cycleTime: 4, totalTime: 150, runTime: 140, availability: 93.0 },
];

let eventLog = [];

const PORT = 3000;
const server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// WebSocket server
const wss = new WebSocketServer({ server });

function broadcast(data) {
  wss.clients.forEach(client => {
    if(client.readyState === 1) client.send(JSON.stringify(data));
  });
  console.log("DATA RECEIVED:", data);
}

// Simulation des machines
function updateMachines() {
  machines.forEach(machine => {
    if(machine.status === "RUN") {
      machine.productionCount += 1;
      machine.runTime += machine.cycleTime;
      machine.totalTime += machine.cycleTime;
      machine.availability = ((machine.runTime / machine.totalTime) * 100).toFixed(1);
    }

    // 5% chance de changer de status
    if(Math.random() < 0.05){
      const oldStatus = machine.status;
      const statuses = ["RUN","STOP","FAULT"];
      machine.status = statuses[Math.floor(Math.random() * statuses.length)];
      if(oldStatus !== machine.status){
        eventLog.push({ machine: machine.name, oldStatus, newStatus: machine.status, time: new Date().toLocaleTimeString() });
      }
    }
  });

  broadcast({ machines, eventLog });
}

// Update toutes les 2s
setInterval(updateMachines, 2000);
