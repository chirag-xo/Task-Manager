export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  username: string;
  loginDate: string;
  preferences: {
    darkMode: boolean;
  };
}

export type FilterType = 'all' | 'completed' | 'pending';
export type PriorityType = 'low' | 'medium' | 'high';