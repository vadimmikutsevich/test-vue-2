<template>
  <div>
    <label for="note-title" class="block text-lg font-semibold mb-2"
      >Заголовок заметки</label
    >
    <input
      id="note-title"
      type="text"
      :value="modelValue"
      @input="onInputChange"
      class="w-full p-2 border rounded"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ modelValue: string }>();
const emit = defineEmits(["update:modelValue", "beforeChange"]);

// Отправляем событие перед изменением
const onInputChange = (event: Event) => {
  emit("beforeChange");
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};
</script>
