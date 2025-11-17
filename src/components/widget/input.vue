<script setup>
   import { computed } from 'vue';

    const props = defineProps({
        type: { type: String, default: 'text' },
        txt_placeholder: { type: String, default: '' },
        modelValue: { type: String, default: '' }, 
        disabled: { type: Boolean, default: false } 
    });

    const emit = defineEmits(['update:modelValue']);

    const handleInput = (event) => {
        emit('update:modelValue', event.target.value);
    }

</script>

<template>
    <input :type="props.type"  
    :value="modelValue" 
    @input="handleInput"
     :placeholder="props.txt_placeholder" 
     :disabled="disabled"
   :class="`w-full px-4 py-2 border border-gray-300 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:border-blue-500 transition duration-150
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`" />
</template>