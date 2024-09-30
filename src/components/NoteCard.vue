<script setup lang="ts">
import { Note } from "../store/noteStore";

const props = defineProps<{ note: Note }>();
const emit = defineEmits(["deleteNote"]);

const onDelete = () => {
  emit("deleteNote", props.note.id);
};
</script>

<template>
  <div class="mb-4 p-4 border rounded">
    <h2 class="text-xl font-semibold">{{ note.title }}</h2>
    <ul>
      <li
        v-for="todo in note.todos.slice(0, 3)"
        :key="todo.id"
        class="flex items-center space-x-2"
      >
        <span>{{ todo.text }}</span>
        <span v-if="todo.completed" class="text-green-500">(Выполнено)</span>
      </li>
    </ul>
    <router-link :to="'/note/' + note.id" class="text-blue-500"
      >Редактировать</router-link
    >
    <button @click="onDelete" class="text-red-500 ml-4">Удалить</button>
  </div>
</template>

<style scoped></style>
