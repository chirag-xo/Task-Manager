import { Task, PriorityType } from '../types';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createTask = (
  title: string, 
  description: string, 
  priority: PriorityType = 'medium',
  dueDate?: string,
  tags: string[] = []
): Task => {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: title.trim(),
    description: description.trim(),
    completed: false,
    priority,
    dueDate,
    tags,
    createdAt: now,
    updatedAt: now,
  };
};

export const updateTask = (task: Task, updates: Partial<Task>): Task => {
  return {
    ...task,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDueDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else if (diffDays <= 7) {
    return `Due in ${diffDays} days`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
};

export const getPriorityColor = (priority: PriorityType, isDark: boolean = false): string => {
  const colors = {
    low: isDark ? 'text-green-400 bg-green-900/20' : 'text-green-700 bg-green-100',
    medium: isDark ? 'text-yellow-400 bg-yellow-900/20' : 'text-yellow-700 bg-yellow-100',
    high: isDark ? 'text-red-400 bg-red-900/20' : 'text-red-700 bg-red-100',
  };
  return colors[priority];
};

export const isTaskOverdue = (dueDate?: string): boolean => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

export const sortTasksByPriority = (tasks: Task[]): Task[] => {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};