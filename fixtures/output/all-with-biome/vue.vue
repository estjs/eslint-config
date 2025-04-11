<template>
  <div class="font-200 text-12 text-red-500 text-center z-100 left-0 top-0 absolute">
    <h1>
      {{ greeting }}
    </h1>
    <button @click="incrementCounter">Click me!</button>
    <p>Counter: {{ counter }}</p>
  </div>
</template>

<script setup>
// Define reactive data and props
import { ref } from 'vue';

const greeting = ref('Hello, Vue 3!' + 1);
let counter = ref(0);
let doubled = computed(() => counter.value * 2);

// Define a function
const incrementCounter = () => {
  counter.value++;
};

let _zero = doubled + counter.value;
</script>
