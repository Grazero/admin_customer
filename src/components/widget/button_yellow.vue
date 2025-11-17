
<template>

  <button class="bg-yellow-500 hover:bg-yellow-700  font-bold py-2 px-4 rounded">
    <span class="text-black"> {{ msg }}</span>
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


