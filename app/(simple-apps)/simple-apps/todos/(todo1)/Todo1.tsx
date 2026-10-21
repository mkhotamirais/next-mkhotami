"use client";

import { useState, useSyncExternalStore } from "react";
import { InitialTodo } from "../types";
import { Button } from "@/components/ui/button";
import Create from "./Create";
import { toast } from "sonner";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Edit from "./Edit";
import Delete from "./Delete";
import DeleteAllChecked from "./DeleteAllChecked";

const STORAGE_KEY = "todo1";
const EVENT_KEY = "todo1-updated";

// Subscribe to both cross-tab (`storage`) and same-tab (custom event) changes
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
// mistake these impure calls for something invoked during render — they are
// only ever actually called from within event handlers.
function createId() {
  return crypto.randomUUID();
}

function nowIso() {
  return new Date().toISOString();
}

export default function Todo1() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const todos: InitialTodo[] = JSON.parse(raw);
  const checkedAll = todos.length > 0 && todos.every((t) => t.checked);

  const [text, setText] = useState("");
  const [isEdit, setIsEdit] = useState<string | null>(null);

  const checkedLength = todos.filter((t) => t.checked).length;
  const todosLength = todos.length;

  const setResult = (result: InitialTodo[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    // Notify this same tab's subscribers; the native `storage` event only
    // fires in *other* tabs, not the one that made the change.
    window.dispatchEvent(new Event(EVENT_KEY));
  };

  const createTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget as typeof e.currentTarget & {
      text: { value: string };
    };
    const text = target.text.value;

    if (!text) return toast.error(`Input required`);

    const duplicate = todos.find((t) => t.text.toLowerCase() === text.toLowerCase());
    if (duplicate) return toast.error(`Todo "${text}" registered`);

    const now = nowIso();
    const result = [...todos, { id: createId(), text, checked: false, createdAt: now, updatedAt: now }];
    setResult(result);

    setText("");
    target.reset();
    toast.success(`Create ${text} success`);
  };

  const updateTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.currentTarget as typeof e.currentTarget & {
      id: { value: string };
      text: { value: string };
    };
    const newText = target.text.value;
    const id = target.id.value;

    if (!newText) return toast.error(`Input required`);
    const duplicate = todos.find((t) => t.text.toLowerCase() === newText.toLowerCase() && t.id !== id);
    if (duplicate) return toast.error(`Todo "${newText}" registered`);

    const others = todos.filter((t) => t.id !== id);
    const match = todos.find((t) => t.id === id);
    if (match && newText) {
      match.text = newText;
      match.updatedAt = nowIso();
      const result = [...others, match];
      setResult(result);
      setIsEdit(null);
    }

    setIsEdit(null);
    toast.success(`Update ${newText} success`);
  };

  const deleteTodo = (id: string) => {
    const result = todos.filter((t) => t.id !== id);
    setResult(result);
    toast.success(`Delete todo success`);
  };

  const checkTodo = (id: string) => {
    setIsEdit(null);
    const result = todos.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t));
    setResult(result);
  };

  const checkAll = () => {
    setIsEdit(null);
    const nextChecked = !checkedAll;
    const result = todos.map((t) => ({ ...t, checked: nextChecked }));
    setResult(result);
  };

  const deleteChecked = () => {
    const checked = todos.filter((t) => t.checked);
    const unchecked = todos.filter((t) => !t.checked);

    if (checked.length === todos.length) {
      toast.success(`Delete all data success, total deleted ${todos.length} data`);
    } else {
      toast.success(`Delete ${checked.length} data success`);
    }

    setResult(unchecked);
  };

  return (
    <div className="border rounded-xl p-4">
      <h2 className="mt-0 mb-0">Todo1</h2>
      <p className="text-muted-foreground">useState, useEffect, useRef</p>
      <Create createTodo={createTodo} text={text} setText={setText} />
      <div>
        <h3>Todo List</h3>
        {todos?.length && todos?.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-2 border-b pb-2 pl-3">
              <div>
                <input
                  title="checkAll"
                  type="checkbox"
                  id="checkAllData"
                  checked={checkedAll}
                  className="mr-2"
                  onChange={checkAll}
                />
                <label htmlFor="checkAllData" className="font-semibold py-2 text-sm">
                  Check All
                </label>
              </div>
              {checkedLength > 0 && (
                <DropdownMenu>
                  {/* <DropdownMenuTrigger asChild> */}
                  <DropdownMenuTrigger>
                    <Button variant={"outline"} size={"icon"}>
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    // onCloseAutoFocus={(e) => {
                    //   if (isEdit) e.preventDefault();
                    // }}
                  >
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={(e) => e.preventDefault()}
                      className="p-0 rounded-md"
                    >
                      <DeleteAllChecked
                        checkedLength={checkedLength}
                        todosLength={todosLength}
                        deleteChecked={deleteChecked}
                      />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {todos
              .sort((t1, t2) => t2.updatedAt.localeCompare(t1.updatedAt))
              .map((todo) => (
                <div key={todo.id} className="mb-2 flex gap-1 items-center w-full justify-between">
                  <div className="w-full">
                    {isEdit === todo.id ? (
                      <Edit todo={todo} isEdit={isEdit} setIsEdit={setIsEdit} updateTodo={updateTodo} />
                    ) : (
                      <div className="border rounded-lg flex px-3">
                        <input
                          disabled={isEdit === todo.id}
                          title="input todo1"
                          type="checkbox"
                          checked={todo.checked}
                          onChange={() => checkTodo(todo.id)}
                        />
                        <span
                          className="py-2 px-3 text-sm inline-block w-full cursor-text"
                          onClick={() => setIsEdit(todo.id)}
                        >
                          {todo.text}
                        </span>
                      </div>
                    )}
                  </div>
                  <DropdownMenu>
                    {/* <DropdownMenuTrigger asChild>
                      <Button variant={"outline"} size={"icon"}>
                        <MoreVertical />
                      </Button>
                    </DropdownMenuTrigger> */}
                    <DropdownMenuTrigger>
                      <MoreVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      // onCloseAutoFocus={(e) => {
                      //   if (isEdit) e.preventDefault();
                      // }}
                    >
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setIsEdit(todo.id);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={(e) => e.preventDefault()}
                        className="p-0 rounded-md"
                      >
                        <Delete todo={todo} deleteTodo={deleteTodo} />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
          </>
        ) : (
          <div>No data</div>
        )}
      </div>
    </div>
  );
}
