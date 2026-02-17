<script setup>
import { ref, onMounted } from "vue";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const machines = ref([]);
const eventLog = ref([]);
const filterStatus = ref("");
let chart = null;

async function fetchMachines() {
  try {
    const res = await fetch("http://localhost:3000/machines");
    const data = await res.json();
    machines.value = data.machines;
    eventLog.value = data.eventLog;

    // Mettre à jour le graphique
    if(chart){
      chart.data.labels = machines.value.map(m => m.name);
      chart.data.datasets[0].data = machines.value.map(m => m.productionCount);
      chart.data.datasets[1].data = machines.value.map(m => m.availability);
      chart.update();
    }
  } catch(err) {
    console.error("Erreur API:", err);
  }
}

onMounted(() => {
  fetchMachines();
  setInterval(fetchMachines, 2000);

  // Init Chart
  const ctx = document.getElementById("machineChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        { label: "Production", data: [], backgroundColor: "blue" },
        { label: "Availability %", data: [], backgroundColor: "green" }
      ]
    },
    options: { responsive: true }
  });
});

const filteredMachines = () => {
  if(!filterStatus.value) return machines.value;
  return machines.value.filter(m => m.status === filterStatus.value);
};
</script>

<template>
  <div>
    <div style="margin-bottom:10px;">
      <label>Status Filter: </label>
      <select v-model="filterStatus">
        <option value="">All</option>
        <option value="RUN">RUN</option>
        <option value="STOP">STOP</option>
        <option value="FAULT">FAULT</option>
      </select>
    </div>

    <canvas id="machineChart" height="150"></canvas>

    <table border="1" cellpadding="6" cellspacing="0" style="margin-top:10px;">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Status</th>
          <th>Production</th>
          <th>Cycle Time</th>
          <th>Total Time</th>
          <th>Run Time</th>
          <th>Availability (%)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="machine in filteredMachines()" :key="machine.id" :style="{ backgroundColor: machine.status==='FAULT'?'#ffcccc':'' }">
          <td>{{ machine.id }}</td>
          <td>{{ machine.name }}</td>
          <td>{{ machine.status }}</td>
          <td>{{ machine.productionCount }}</td>
          <td>{{ machine.cycleTime }}</td>
          <td>{{ machine.totalTime }}</td>
          <td>{{ machine.runTime }}</td>
          <td>{{ machine.availability }}</td>
        </tr>
      </tbody>
    </table>

    <h3>Event Log</h3>
    <ul>
      <li v-for="(log, index) in eventLog" :key="index">
        [{{ log.time }}] {{ log.machine }}: {{ log.oldStatus }} → {{ log.newStatus }}
      </li>
    </ul>
  </div>
</template>
