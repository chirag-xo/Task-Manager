import { Task, User } from '../types';

const STORAGE_KEYS = {
  USER: 'taskapp_user',
  TASKS: 'taskapp_tasks',
  THEME: 'taskapp_theme',
};

export const storageUtils = {
  // User storage
  saveUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  removeUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Tasks storage
  saveTasks: (tasks: Task[]): void => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  getTasks: (): Task[] => {
    const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    return tasks ? JSON.parse(tasks) : [];
  },

  removeTasks: (): void => {
    localStorage.removeItem(STORAGE_KEYS.TASKS);
  },

  // Theme storage
  saveTheme: (isDark: boolean): void => {
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(isDark));
  },

  getTheme: (): boolean => {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return theme ? JSON.parse(theme) : false;
  },
};