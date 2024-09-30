<script setup lang="ts">
import { toRef, ref } from "vue";
import { useNoteStore } from "../store/noteStore";
import NoteCard from "../components/NoteCard.vue";
import ConfirmDialog from "../components/ConfirmDialog.vue";

const noteStore = useNoteStore();
const notes = toRef(noteStore, "notes");

const showConfirmDialog = ref(false);
const noteToDelete = ref<number | null>(null);

const showDeleteConfirm = (id: number) => {
  noteToDelete.value = id;
  showConfirmDialog.value = true;
};

const hideDeleteConfirm = () => {
  showConfirmDialog.value = false;
  noteToDelete.value = null;
};

const deleteNote = () => {
  if (noteToDelete.value !== null) {
    noteStore.deleteNote(noteToDelete.value);

    hideDeleteConfirm();
  }
};
</script>

<template>
  <div class="container mx-auto py-4">
    <h1 class="text-2xl font-bold mb-4">Заметки</h1>
    <router-link
      to="/note/new"
      class="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
    >
      Создать новую заметку
    </router-link>

    <div v-if="notes.length === 0">Нет заметок</div>
    <ul>
      <li v-for="note in notes" :key="note.id">
        <NoteCard :note="note" @deleteNote="showDeleteConfirm(note.id)" />
      </li>
    </ul>

    <ConfirmDialog
      :visible="showConfirmDialog"
      title="Подтвердите удаление"
      message="Вы действительно хотите удалить эту заметку?"
      @confirm="deleteNote"
      @cancel="hideDeleteConfirm"
    />
  </div>
</template>

<style scoped></style>
