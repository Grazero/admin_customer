
<script setup>

    defineProps({
        color_border: String,
        
    })

</script>

<template>
     <textarea :class="`w-full px-4 py-2 border border-gray-300 rounded-lg 
         focus:outline-none focus:ring-2 focus:ring-${color_border==null?'blue':color_border }-500 
         focus:border-${ color_border==null?'blue':color_border}-500 transition duration-150`"></textarea>
</template>