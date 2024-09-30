<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNoteStore } from "../store/noteStore";
import NoteTitleInput from "../components/NoteTitleInput.vue";
import TodoItemInput from "../components/TodoItemInput.vue";
import ConfirmDialog from "../components/ConfirmDialog.vue";

const route = useRoute();
const router = useRouter();
const noteStore = useNoteStore();

const isNewNote = !route.params.id || route.params.id === "new";
const noteId = isNewNote ? Date.now() : Number(route.params.id);

const localNote = ref({
  id: noteId,
  title: "",
  todos: [] as { id: number; text: string; completed: boolean }[],
});

watch(
  () => localNote,
  (val) => console.log({ val })
);

if (!isNewNote) {
  const existingNote = noteStore.notes.find((note) => note.id === noteId);
  if (existingNote) {
    localNote.value = { ...existingNote };
  }
}

const undoStack = ref<
  {
    id: number;
    title: string;
    todos: { id: number; text: string; completed: boolean }[];
  }[]
>([]);
const redoStack = ref<
  {
    id: number;
    title: string;
    todos: { id: number; text: string; completed: boolean }[];
  }[]
>([]);

const showConfirmDialog = ref(false);
const showDeleteConfirmDialog = ref(false);

const showCancelConfirm = () => {
  showConfirmDialog.value = true;
};

const hideCancelConfirm = () => {
  showConfirmDialog.value = false;
};

const cancelEditing = () => {
  if (!isNewNote) {
    const originalNote = noteStore.notes.find((note) => note.id === noteId);
    if (originalNote) {
      localNote.value = { ...originalNote };
    }
  }
  router.push("/");
};

const showDeleteConfirm = () => {
  showDeleteConfirmDialog.value = true;
};

const hideDeleteConfirm = () => {
  showDeleteConfirmDialog.value = false;
};

const deleteNote = () => {
  noteStore.deleteNote(noteId);
  router.push("/");
};

const saveStateToUndoStack = () => {
  undoStack.value.push(JSON.parse(JSON.stringify(localNote.value)));
  redoStack.value = [];
};

const undo = () => {
  if (undoStack.value.length > 0) {
    redoStack.value.push(JSON.parse(JSON.stringify(localNote.value)));
    const previousState = undoStack.value.pop();
    if (previousState) {
      Object.assign(localNote.value, previousState);
    }
  }
};

const redo = () => {
  if (redoStack.value.length > 0) {
    undoStack.value.push(JSON.parse(JSON.stringify(localNote.value)));
    const nextState = redoStack.value.pop();
    if (nextState) {
      Object.assign(localNote.value, nextState);
    }
  }
};

const addNewTodo = () => {
  saveStateToUndoStack();
  const newTodo = {
    id: Date.now(),
    text: "",
    completed: false,
  };
  localNote.value.todos.push(newTodo);
};

const deleteTodo = (index: number) => {
  saveStateToUndoStack();
  localNote.value.todos.splice(index, 1);
};

const saveNote = () => {
  if (isNewNote) {
    noteStore.addNote({ ...localNote.value });
  } else {
    noteStore.updateNote(noteId, { ...localNote.value });
  }
  router.push("/");
};

onMounted(() => {
  undoStack.value.push(JSON.parse(JSON.stringify(localNote.value)));
});
</script>

<template>
  <div class="container mx-auto py-4 px-4">
    <h1 class="text-2xl font-bold mb-4">
      {{ isNewNote ? "Создание заметки" : "Редактирование заметки" }}
    </h1>

    <NoteTitleInput
      v-model="localNote.title"
      @beforeChange="saveStateToUndoStack"
    />

    <h2 class="text-lg font-semibold mt-4 mb-2">Список задач</h2>
    <div v-for="(todo, index) in localNote.todos" :key="todo.id">
      <TodoItemInput
        v-model="localNote.todos[index]"
        @beforeChange="saveStateToUndoStack"
        @delete="deleteTodo(index)"
      />
    </div>

    <button
      @click="addNewTodo"
      class="bg-green-500 text-white px-4 py-2 rounded mt-4"
    >
      Добавить задачу
    </button>

    <div class="flex flex-col space-y-4 mt-6">
      <div class="flex items-center gap-x-4">
        <button
          @click="saveNote"
          class="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Сохранить
        </button>
        <button
          @click="showCancelConfirm"
          class="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Отменить
        </button>
        <button
          v-if="!isNewNote"
          @click="showDeleteConfirm"
          class="bg-red-500 text-white px-4 py-2 rounded"
        >
          Удалить
        </button>
      </div>

      <!-- Undo/Redo Buttons -->
      <div class="flex items-center gap-x-4">
        <button
          @click="undo"
          :disabled="undoStack.length === 0"
          class="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Отменить внесенное изменение
        </button>
        <button
          @click="redo"
          :disabled="redoStack.length === 0"
          class="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Повторить отмененное изменение
        </button>
      </div>
    </div>

    <ConfirmDialog
      :visible="showConfirmDialog"
      title="Подтвердите отмену"
      message="Вы действительно хотите отменить изменения?"
      @confirm="cancelEditing"
      @cancel="hideCancelConfirm"
    />

    <ConfirmDialog
      :visible="showDeleteConfirmDialog"
      title="Подтвердите удаление"
      message="Вы действительно хотите удалить эту заметку?"
      @confirm="deleteNote"
      @cancel="hideDeleteConfirm"
    />
  </div>
</template>

<style scoped></style>
