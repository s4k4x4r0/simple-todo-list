import { AddTodo } from '@/features/todos/components/AddTodo';
import { TodoList } from '@/features/todos/components/TodoList';
import React, { type JSX } from 'react';

export function App(): JSX.Element {
  return (
    <div>
      <h1>TODO</h1>
      <AddTodo />
      <TodoList />
    </div>
  );
}
