"use client";

import React, { createContext, useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { InitialTodo } from "../types";

type Actions =
  | { type: "CREATE"; payload: InitialTodo }
  | { type: "DELETE"; payload: string }
  | { type: "TOGGLE_CHECK"; payload: string }
  | { type: "UPDATE"; payload: { id: string; text: string } }
  | { type: "CHECK_ALL"; payload: boolean } // payload = the checked value to apply to every todo
  | { type: "DELETE_CHECKED" };

interface TodoContextProps {
  todos: InitialTodo[];
  dispatch: (action: Actions) => void;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  isEdit: string | null;
  setIsEdit: React.Dispatch<React.SetStateAction<string | null>>;
  checkedAll: boolean;
}

const STORAGE_KEY = "todo2";
const EVENT_KEY = "todo2-updated";

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

// Kept outside the component so React Compiler's static analysis doesn't
// mistake this impure call for something invoked during render.
function nowIso() {
  return new Date().toISOString();
}

function todoReducer(state: InitialTodo[], action: Actions): InitialTodo[] {
  switch (action.type) {
    case "CREATE":
      return [...state, action.payload];
    case "DELETE":
      return state.filter((todo) => todo.id !== action.payload);
    case "TOGGLE_CHECK":
      return state.map((todo) => (todo.id === action.payload ? { ...todo, checked: !todo.checked } : todo));
    case "UPDATE":
      return state.map((todo) =>
        todo.id === action.payload.id ? { ...todo, text: action.payload.text, updatedAt: nowIso() } : todo,
      );
    case "CHECK_ALL":
      return state.map((todo) => ({ ...todo, checked: action.payload }));
    case "DELETE_CHECKED":
      return state.filter((todo) => !todo.checked);
    default:
      return state;
  }
}

export const Todo2Context = createContext<TodoContextProps | undefined>(undefined);

export default function Todo2Provider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const todos: InitialTodo[] = useMemo(() => JSON.parse(raw), [raw]);
  const checkedAll = todos.length > 0 && todos.every((t) => t.checked);

  // Reads the freshest snapshot itself (rather than closing over `todos`)
  // so back-to-back dispatches in the same tick never operate on stale data.
  const dispatch = useCallback((action: Actions) => {
    const current: InitialTodo[] = JSON.parse(getSnapshot());
    const next = todoReducer(current, action);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT_KEY));
  }, []);

  const [text, setText] = useState("");
  const [isEdit, setIsEdit] = useState<string | null>(null);

  return (
    <Todo2Context.Provider value={{ todos, dispatch, text, setText, isEdit, setIsEdit, checkedAll }}>
      {children}
    </Todo2Context.Provider>
  );
}
