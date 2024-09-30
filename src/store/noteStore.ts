import { defineStore } from "pinia";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface Note {
  id: number;
  title: string;
  todos: Todo[];
}

export const useNoteStore = defineStore("noteStore", {
  state: () => ({
    notes: JSON.parse(localStorage.getItem("notes") || "[]") as Note[],
  }),

  actions: {
    saveNotesToLocalStorage() {
      localStorage.setItem("notes", JSON.stringify(this.notes));
    },

    addNote(note: Note) {
      this.notes.push(note);
      this.saveNotesToLocalStorage();
    },

    updateNote(id: number, updatedNote: Note) {
      const index = this.notes.findIndex((note) => note.id === id);
      if (index !== -1) {
        this.notes[index] = updatedNote;
        this.saveNotesToLocalStorage();
      }
    },

    deleteNote(id: number) {
      this.notes = this.notes.filter((note) => note.id !== id);
      this.saveNotesToLocalStorage();
    },

    addTodoToNote(noteId: number, todoText: string) {
      const note = this.notes.find((n) => n.id === noteId);
      if (note) {
        const newTodo: Todo = {
          id: Date.now(),
          text: todoText,
          completed: false,
        };
        note.todos.push(newTodo);
        this.saveNotesToLocalStorage();
      }
    },

    toggleTodo(noteId: number, todoId: number) {
      const note = this.notes.find((n) => n.id === noteId);
      if (note) {
        const todo = note.todos.find((t) => t.id === todoId);
        if (todo) {
          todo.completed = !todo.completed;
          this.saveNotesToLocalStorage();
        }
      }
    },

    deleteTodoFromNote(noteId: number, todoId: number) {
      const note = this.notes.find((n) => n.id === noteId);
      if (note) {
        note.todos = note.todos.filter((t) => t.id !== todoId);
        this.saveNotesToLocalStorage();
      }
    },
  },
});
