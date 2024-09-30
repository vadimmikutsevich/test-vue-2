<script setup lang="ts">
const { message } = defineProps<{
  visible: boolean;
  title: string;
  message: string;
}>();

const emit = defineEmits(["confirm", "cancel"]);

const confirm = () => {
  emit("confirm");
};

const cancel = () => {
  emit("cancel");
};
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
  >
    <div class="bg-white p-6 rounded shadow-lg w-1/3">
      <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
      <p class="mb-4">{{ message }}</p>
      <div class="flex justify-end space-x-4">
        <button
          @click="cancel"
          class="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Отмена
        </button>
        <button
          @click="confirm"
          class="px-4 py-2 bg-red-500 text-white rounded"
        >
          Подтвердить
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
