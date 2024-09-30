<template>
  <div class="flex items-center space-x-2 mb-2">
    <input
      type="checkbox"
      :checked="modelValue.completed"
      @change="onCheckboxChange"
      class="form-checkbox"
    />
    <input
      type="text"
      :value="modelValue.text"
      @input="onInputChange"
      class="flex-grow p-2 border rounded"
    />
    <button @click="deleteTodo" class="text-red-500">Удалить</button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: { text: string; completed: boolean };
}>();
const emit = defineEmits(["update:modelValue", "delete", "beforeChange"]);

// Отправляем событие перед изменением
const onInputChange = (event: Event) => {
  emit("beforeChange");
  emit("update:modelValue", {
    ...props.modelValue,
    text: (event.target as HTMLInputElement).value,
  });
};

const onCheckboxChange = (event: Event) => {
  emit("beforeChange");
  emit("update:modelValue", {
    ...props.modelValue,
    completed: (event.target as HTMLInputElement).checked,
  });
};

const deleteTodo = () => {
  emit("beforeChange");
  emit("delete");
};
</script>
