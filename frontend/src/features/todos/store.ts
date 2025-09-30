import { create } from 'zustand';

export type TaskStatus = '未完了' | '完了';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: string;
}

interface TodoStoreState {
  tasks: Task[];
  addTask: (title: string) => void;
  completeTask: (taskId: string) => void;
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useTodoStore = create<TodoStoreState>((set) => ({
  tasks: [],
  addTask: (title: string) =>
    set((prev) => {
      const trimmed = title.trim();
      if (trimmed.length === 0) {
        return prev;
      }
      const newTask: Task = {
        id: generateId(),
        title: trimmed,
        status: '未完了',
        createdAt: new Date().toISOString(),
      };
      const nextTasks = [...prev.tasks, newTask].sort((a, b) =>
        a.createdAt.localeCompare(b.createdAt),
      );
      return { ...prev, tasks: nextTasks };
    }),
  completeTask: (taskId: string) =>
    set((prev) => {
      const nextTasks = prev.tasks.map((task) =>
        task.id === taskId && task.status === '未完了'
          ? { ...task, status: '完了' as TaskStatus }
          : task,
      );
      return { ...prev, tasks: nextTasks };
    }),
}));
