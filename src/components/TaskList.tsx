import React from 'react';
import { Task, FilterType } from '../types';
import TaskItem from './TaskItem';
import { CheckCircle, Clock, List } from 'lucide-react';
import { sortTasksByPriority } from '../utils/taskUtils';

interface TaskListProps {
  tasks: Task[];
  filter: FilterType;
  onToggleTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  isDark?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  isDark = false,
}) => {
  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'completed':
        return task.completed;
      case 'pending':
        return !task.completed;
      default:
        return true;
    }
  });

  const sortedTasks = sortTasksByPriority(filteredTasks);

  const getEmptyStateConfig = () => {
    switch (filter) {
      case 'completed':
        return {
          icon: CheckCircle,
          title: 'No completed tasks',
          description: 'Complete some tasks to see them here',
        };
      case 'pending':
        return {
          icon: Clock,
          title: 'No pending tasks',
          description: 'All caught up! Create new tasks to get started',
        };
      default:
        return {
          icon: List,
          title: 'No tasks yet',
          description: 'Create your first task to get started',
        };
    }
  };

  if (sortedTasks.length === 0) {
    const { icon: Icon, title, description } = getEmptyStateConfig();
    
    return (
      <div className="text-center py-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <Icon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedTasks.map((task, index) => (
        <div
          key={task.id}
          className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <TaskItem
            task={task}
            onToggle={onToggleTask}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            isDark={isDark}
          />
        </div>
      ))}
    </div>
  );
};

export default TaskList;