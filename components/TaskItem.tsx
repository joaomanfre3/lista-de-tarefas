"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star, Trash2 } from "lucide-react";
import type { Task } from "@/lib/tarefas";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onToggleImportant: () => void;
  onEdit: (text: string) => void;
  onDelete: () => void;
}

export function TaskItem({
  task,
  onToggle,
  onToggleImportant,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== task.text) onEdit(trimmed);
    else setDraft(task.text); // reverte se vazio ou igual
    setEditing(false);
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-3 shadow-sm"
    >
      {/* Checkbox de concluir */}
      <button
        onClick={onToggle}
        aria-label={task.done ? "Marcar como pendente" : "Marcar como concluída"}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
          task.done ? "border-transparent text-white" : "border-black/20 text-transparent"
        }`}
        style={task.done ? { backgroundColor: "var(--color-accent)" } : undefined}
      >
        <Check size={14} strokeWidth={3} />
      </button>

      {/* Texto / edição inline */}
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setDraft(task.text);
              setEditing(false);
            }
          }}
          maxLength={120}
          className="min-w-0 flex-1 bg-transparent text-base outline-none"
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          className={`min-w-0 flex-1 truncate text-left text-base transition ${
            task.done ? "text-ink/40 line-through" : "text-ink"
          }`}
        >
          {task.text}
        </button>
      )}

      {/* Importante */}
      <button
        onClick={onToggleImportant}
        aria-label={task.important ? "Tirar destaque" : "Marcar como importante"}
        className="shrink-0 text-ink/30 transition hover:text-amber-400"
      >
        <Star
          size={18}
          className={task.important ? "fill-amber-400 text-amber-400" : ""}
        />
      </button>

      {/* Apagar */}
      <button
        onClick={onDelete}
        aria-label="Apagar tarefa"
        className="shrink-0 text-ink/25 transition hover:text-red-500"
      >
        <Trash2 size={17} />
      </button>
    </motion.li>
  );
}
