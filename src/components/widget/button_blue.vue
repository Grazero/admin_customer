
<template>

  <button class="bg-blue-500 hover:bg-blue-700  font-bold py-2 px-4 rounded">
    <span class="text-white"> {{ msg }}</span>
  </button>
</template>
<script setup>


import { computed } from 'vue';

const props = defineProps({

  msg: {
    type: String,
    default: ""
  },

})


</script>


