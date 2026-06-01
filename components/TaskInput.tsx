"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface TaskInputProps {
  onAdd: (text: string) => void;
}

export function TaskInput({ onAdd }: TaskInputProps) {
  const [text, setText] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText(""); // limpa pra adicionar a próxima sem tirar a mão do teclado
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="O que precisa ser feito?"
        maxLength={120}
        className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-base shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        aria-label="Adicionar tarefa"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm transition active:scale-95 disabled:opacity-30"
        style={{ backgroundColor: "var(--color-accent)" }}
      >
        <Plus size={22} />
      </button>
    </form>
  );
}
