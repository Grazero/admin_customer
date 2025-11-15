<script setup>


defineProps({
  msg: String,
  bg_color: String,
  range_color: String,
  txt_color: String,

})


</script>

<template>
     <button_custom :class="`bg-${bg_color}-${range_color} hover:bg-${bg_color}-700  font-bold py-2 px-4 rounded`">
      <span :class="`text-${txt_color}`">{{ msg }}</span>
     </button_custom>
</template>


