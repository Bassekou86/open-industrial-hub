let machine = {
  id: 1,
  name: "Machine-01",
  status: "RUN",       // RUN, STOP, FAULT
  productionCount: 0,
  cycleTime: 5,         // secondes
  totalTime: 0,
  runTime: 0
};

// Changement d'état aléatoire toutes les 5 secondes
setInterval(() => {
  machine.totalTime += machine.cycleTime;

  // Status probabiliste
  const rand = Math.random();
  if (rand < 0.80) {
    machine.status = "RUN";
    machine.productionCount++;
    machine.runTime += machine.cycleTime;
  } else if (rand < 0.95) {
    machine.status = "STOP";
  } else {
    machine.status = "FAULT";
  }
}, machine.cycleTime * 1000);

// Calcul de l'Availability en %
Object.defineProperty(machine, "availability", {
  get() {
    if (machine.totalTime === 0) return 100;
    return ((machine.runTime / machine.totalTime) * 100).toFixed(1);
  },
  enumerable: true
});

module.exports = machine;
