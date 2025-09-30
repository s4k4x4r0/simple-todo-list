import { useTodoStore } from '@/features/todos/store';
import React, { type JSX } from 'react';

export function AddTodo(): JSX.Element {
  const addTask = useTodoStore((s) => s.addTask);
  const [title, setTitle] = React.useState('');

  const isValid = title.trim().length > 0;

  function handleAdd(): void {
    if (!isValid) return;
    addTask(title);
    setTitle('');
  }

  return (
    <div>
      <input aria-label="タイトル入力" value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={handleAdd} disabled={!isValid}>
        追加
      </button>
    </div>
  );
}
