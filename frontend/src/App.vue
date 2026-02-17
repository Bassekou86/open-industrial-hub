<template>
  <div style="font-family: Arial; padding: 20px;">
    <h1>Open Industrial Hub - Dashboard</h1>
    <!-- On insère notre composant MachineTable -->
    <MachineTable />
  </div>
</template>

<script setup>
// On importe le composant MachineTable
import MachineTable from "./components/MachineTable.vue";
</script>

<style>
h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}
</style>
