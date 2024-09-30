import { createRouter, createWebHistory } from "vue-router";

import Main from "../pages/Main.vue";
import NoteEditor from "../pages/NoteEditor.vue";

const routes = [
  {
    path: "/",
    name: "Main",
    component: Main,
  },
  {
    path: "/note/new",
    name: "Creating",
    component: NoteEditor,
  },
  {
    path: "/note/:id",
    name: "Editing",
    component: NoteEditor,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
