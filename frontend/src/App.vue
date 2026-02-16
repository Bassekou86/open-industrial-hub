<script setup>
import { ref, onMounted } from "vue";

const machine = ref(null);

onMounted(async () => {
  const res = await fetch("http://localhost:3000/machines");
  machine.value = await res.json();
});
</script>

<template>
  <div>
    <h1>Open Industrial Hub</h1>
    <div v-if="machine">
      <p><strong>Name:</strong> {{ machine.name }}</p>
      <p><strong>Status:</strong> {{ machine.status }}</p>
      <p><strong>Production:</strong> {{ machine.productionCount }}</p>
      <p><strong>Availability:</strong> {{ machine.availability }}%</p>
    </div>
  </div>
</template>
