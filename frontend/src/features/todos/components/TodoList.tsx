import { useTodoStore } from '@/features/todos/store';
import React, { type JSX } from 'react';

export function TodoList(): JSX.Element {
  const tasks = useTodoStore((s) => s.tasks);
  const completeTask = useTodoStore((s) => s.completeTask);

  return (
    <div data-testid="todo-list">
      {tasks.map((task) => (
        <div key={task.id} data-testid="todo-item">
          <span>{task.title}</span>
          <span aria-label="状態">{task.status}</span>
          {task.status === '未完了' ? (
            <button onClick={() => completeTask(task.id)}>完了</button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
