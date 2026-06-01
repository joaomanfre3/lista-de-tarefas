// Tipos e lógica pura da lista de tarefas — sem React, fácil de testar.

export interface Task {
  id: string;
  text: string;
  done: boolean;
  /** Marcada como importante (sobe pro topo). */
  important: boolean;
  /** Timestamp de criação, usado pra ordenar. */
  createdAt: number;
}

export type Filter = "todas" | "pendentes" | "concluidas";

export const FILTERS: { id: Filter; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "pendentes", label: "Pendentes" },
  { id: "concluidas", label: "Concluídas" },
];

/** Aplica o filtro selecionado à lista. */
export function applyFilter(tasks: Task[], filter: Filter): Task[] {
  if (filter === "pendentes") return tasks.filter((t) => !t.done);
  if (filter === "concluidas") return tasks.filter((t) => t.done);
  return tasks;
}

/**
 * Ordena pra exibição: importantes primeiro, depois pendentes antes das
 * concluídas e, por fim, as mais recentes no topo.
 */
export function sortForDisplay(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.important !== b.important) return a.important ? -1 : 1;
    if (a.done !== b.done) return a.done ? 1 : -1;
    return b.createdAt - a.createdAt;
  });
}

export interface Counts {
  total: number;
  done: number;
  pending: number;
}

export function countTasks(tasks: Task[]): Counts {
  const done = tasks.filter((t) => t.done).length;
  return { total: tasks.length, done, pending: tasks.length - done };
}
