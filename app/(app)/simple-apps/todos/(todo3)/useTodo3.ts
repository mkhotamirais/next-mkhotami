import { create } from "zustand";
import { useSyncExternalStore } from "react";
import { InitialTodo } from "../types";

const STORAGE_KEY = "todo3";
const EVENT_KEY = "todo3-updated";

// Subscribe to both cross-tab (`storage`) and same-tab (custom event) changes.
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT_KEY, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT_KEY, callback);
  };
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) ?? "[]";
}

// Server has no localStorage; return a value identical to the client's
// pre-hydration state so there is no mismatch.
function getServerSnapshot() {
  return "[]";
}

function persist(todos: InitialTodo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  window.dispatchEvent(new Event(EVENT_KEY));
}

// Kept outside any hook/component so React Compiler's static analysis
// doesn't mistake these impure calls for something invoked during render.
function createId() {
  return crypto.randomUUID();
}

function nowIso() {
  return new Date().toISOString();
}

// Zustand only owns ephemeral UI state. The todos themselves are persisted
// data, so they're read straight from localStorage via useSyncExternalStore
// (same approach as Todo1/Todo2) instead of living in the Zustand store —
// that's what caused the SSR crash and the duplicated checkedAll bug before.
interface UiState {
  text: string;
  setText: (text: string) => void;
  isEdit: string | null;
  setIsEdit: (isEdit: string | null) => void;
}

const useTodo3Ui = create<UiState>((set) => ({
  text: "",
  setText: (text) => set({ text }),
  isEdit: null,
  setIsEdit: (isEdit) => set({ isEdit }),
}));

export function useTodo3() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const todos: InitialTodo[] = JSON.parse(raw);
  const checkedAll = todos.length > 0 && todos.every((t) => t.checked);
  const ui = useTodo3Ui();

  const addTodo = (text: string) => {
    const now = nowIso();
    persist([...todos, { id: createId(), text, checked: false, createdAt: now, updatedAt: now }]);
  };

  const delTodo = (id: string) => {
    persist(todos.filter((t) => t.id !== id));
  };

  const toggleCheck = (id: string) => {
    persist(todos.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t)));
  };

  const editTodo = (id: string, text: string) => {
    persist(todos.map((t) => (t.id === id ? { ...t, text, updatedAt: nowIso() } : t)));
  };

  // `check` is the value to apply to every todo's `checked` flag —
  // callers pass the *next* state (e.g. `!checkedAll`), not the previous one.
  const checkAllTodo = (check: boolean) => {
    persist(todos.map((t) => ({ ...t, checked: check })));
  };

  const delChecked = () => {
    persist(todos.filter((t) => !t.checked));
  };

  return {
    ...ui,
    todos,
    checkedAll,
    addTodo,
    delTodo,
    toggleCheck,
    editTodo,
    checkAllTodo,
    delChecked,
  };
}
