"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ListChecks, Sparkles } from "lucide-react";
import {
  type Filter,
  type Task,
  applyFilter,
  countTasks,
  sortForDisplay,
} from "@/lib/tarefas";
import { TaskInput } from "@/components/TaskInput";
import { FilterTabs } from "@/components/FilterTabs";
import { TaskItem } from "@/components/TaskItem";

const STORAGE_KEY = "lista-de-tarefas:v1";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("todas");
  const [hydrated, setHydrated] = useState(false);

  // Carrega as tarefas salvas (uma vez).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch {
      /* localStorage indisponível — segue vazio */
    }
    setHydrated(true);
  }, []);

  // Persiste a cada mudança, depois de hidratar.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      /* cota cheia / modo privado — ignora */
    }
  }, [tasks, hydrated]);

  const counts = useMemo(() => countTasks(tasks), [tasks]);
  const visible = useMemo(
    () => sortForDisplay(applyFilter(tasks, filter)),
    [tasks, filter],
  );

  // Percentual concluído pra barra de progresso.
  const progress = counts.total > 0 ? (counts.done / counts.total) * 100 : 0;

  function addTask(text: string) {
    setTasks((prev) => [
      { id: crypto.randomUUID(), text, done: false, important: false, createdAt: Date.now() },
      ...prev,
    ]);
  }

  function updateTask(id: string, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function clearDone() {
    setTasks((prev) => prev.filter((t) => !t.done));
  }

  if (!hydrated) return null;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-5 px-4 py-8">
      {/* Cabeçalho com progresso */}
      <header>
        <div className="mb-3 flex items-center gap-2">
          <ListChecks size={26} style={{ color: "var(--color-accent)" }} />
          <h1 className="text-2xl font-extrabold tracking-tight">Minhas Tarefas</h1>
        </div>
        {counts.total > 0 && (
          <>
            <div className="mb-1 flex items-center justify-between text-sm text-ink/50">
              <span>
                {counts.done} de {counts.total} concluídas
              </span>
              <span className="tabular-nums">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-black/5">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: "var(--color-accent)" }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
          </>
        )}
      </header>

      <TaskInput onAdd={addTask} />

      {tasks.length > 0 && <FilterTabs active={filter} onChange={setFilter} />}

      {/* Lista */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center text-ink/40">
          <Sparkles size={28} strokeWidth={1.5} />
          <p className="text-sm">
            {tasks.length === 0
              ? "Nenhuma tarefa ainda. Adicione a primeira acima!"
              : filter === "concluidas"
                ? "Nada concluído por aqui ainda."
                : "Tudo em dia por aqui. 🎉"}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {visible.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => updateTask(task.id, { done: !task.done })}
                onToggleImportant={() => updateTask(task.id, { important: !task.important })}
                onEdit={(text) => updateTask(task.id, { text })}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}

      {/* Limpar concluídas */}
      {counts.done > 0 && (
        <button
          onClick={clearDone}
          className="mx-auto mt-2 text-sm font-medium text-ink/40 underline-offset-4 transition hover:text-accent hover:underline"
        >
          Limpar {counts.done} concluída{counts.done > 1 ? "s" : ""}
        </button>
      )}
    </main>
  );
}
