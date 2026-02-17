<script setup>
import { ref, onMounted } from "vue";

const machines = ref([]);
const filterStatus = ref(""); // Pour filtrer par status

async function fetchMachines() {
  try {
    const res = await fetch("http://localhost:3000/machines");
    machines.value = await res.json();
  } catch (err) {
    console.error("Erreur API:", err);
  }
}

onMounted(() => {
  fetchMachines();
  setInterval(fetchMachines, 2000); // Rafraîchissement toutes les 2 secondes
});

// Computed pour filtrer les machines
const filteredMachines = () => {
  if (!filterStatus.value) return machines.value;
  return machines.value.filter(m => m.status === filterStatus.value);
};
</script>

<template>
  <div style="padding: 20px;">
    <h2>Machines Dashboard</h2>

    <div style="margin-bottom: 10px;">
      <label>Status Filter: </label>
      <select v-model="filterStatus">
        <option value="">All</option>
        <option value="RUN">RUN</option>
        <option value="STOP">STOP</option>
        <option value="FAULT">FAULT</option>
      </select>
    </div>

    <table border="1" cellpadding="6" cellspacing="0">
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
        <tr v-for="machine in filteredMachines()" :key="machine.id">
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
  </div>
</template>
