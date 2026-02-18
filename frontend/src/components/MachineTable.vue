<template>
  <div>
    <!-- Graphique combiné -->
    <canvas id="machineChart" style="width:100%; height:400px;"></canvas>

    <!-- Tableau filtrable -->
    <div style="margin-top: 20px;">
      <label>
        Filtrer par status :
        <select v-model="filterStatus">
          <option value="">Tous</option>
          <option value="RUN">RUN</option>
          <option value="STOP">STOP</option>
          <option value="FAULT">FAULT</option>
        </select>
      </label>
    </div>

    <table v-if="machines.length" border="1" cellpadding="5" cellspacing="0" style="margin-top:10px; width:100%; border-collapse:collapse;">
      <thead>
        <tr>
          <th>Machine</th>
          <th>Status</th>
          <th>Production</th>
          <th>Availability %</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="machine in filteredMachines" :key="machine.id">
          <td>{{ machine.name }}</td>
          <td :style="{ color: machine.status === 'FAULT' ? 'red' : 'black', fontWeight: machine.status === 'FAULT' ? 'bold' : 'normal' }">
            {{ machine.status }}
          </td>
          <td>{{ machine.productionCount }}</td>
          <td>{{ machine.availability }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Debug temporaire -->
    <!-- <pre>{{ machines }}</pre> -->
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const machines = ref([]);
const filterStatus = ref("");
let chart = null;

// WebSocket et Chart.js
onMounted(() => {
  // Init du graphique
  initChart();

  // Connexion WebSocket
  const ws = new WebSocket("ws://localhost:3000");

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    console.log("WS DATA:", data);

    // Met à jour les machines et eventLog
    machines.value = data.machines;

    // Met à jour le graphique
    updateChart();
  };
});

// Initialisation du graphique combiné barres + ligne
function initChart() {
  const canvas = document.getElementById("machineChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          type: "bar",
          label: "Production",
          data: [],
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          yAxisID: "y"
        },
        {
          type: "line",
          label: "Availability %",
          data: [],
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 2,
          fill: false,
          yAxisID: "y1"
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, position: "left" },
        y1: { min: 0, max: 100, position: "right", grid: { drawOnChartArea: false } }
      }
    }
  });
}

// Met à jour le graphique à chaque message
function updateChart() {
  if (!chart) return;

  chart.data.labels = machines.value.map(m => m.name);
  chart.data.datasets[0].data = machines.value.map(m => m.productionCount);
  chart.data.datasets[1].data = machines.value.map(m => Number(m.availability));

  chart.update();
}

// Filtre machines par status
const filteredMachines = computed(() => {
  if (!filterStatus.value) return machines.value;
  return machines.value.filter(m => m.status === filterStatus.value);
});
</script>

<style scoped>
table th {
  background: #f0f0f0;
  text-align: left;
}
</style>
