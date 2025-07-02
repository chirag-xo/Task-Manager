import React, { useState, useEffect } from 'react';
import { Plus, LogOut, User, Search, Moon, Sun, Filter } from 'lucide-react';
import { Task, FilterType, PriorityType } from '../types';
import { storageUtils } from '../utils/storage';
import { createTask, updateTask } from '../utils/taskUtils';
import { useTheme } from '../hooks/useTheme';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ username, onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { isDark, toggleTheme } = useTheme();

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = storageUtils.getTasks();
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    storageUtils.saveTasks(tasks);
  }, [tasks]);

  const handleCreateTask = (title: string, description: string, priority: PriorityType, dueDate?: string, tags?: string[]) => {
    const newTask = createTask(title, description, priority, dueDate, tags);
    setTasks(prev => [newTask, ...prev]);
    setShowTaskForm(false);
  };

  const handleUpdateTask = (title: string, description: string, priority: PriorityType, dueDate?: string, tags?: string[]) => {
    if (editingTask) {
      const updatedTask = updateTask(editingTask, { title, description, priority, dueDate, tags });
      setTasks(prev => prev.map(task => task.id === editingTask.id ? updatedTask : task));
      setEditingTask(null);
    }
  };

  const handleToggleTask = (taskToToggle: Task) => {
    const updatedTask = updateTask(taskToToggle, { completed: !taskToToggle.completed });
    setTasks(prev => prev.map(task => task.id === taskToToggle.id ? updatedTask : task));
  };

  const handleDeleteTask = (taskToDelete: Task) => {
    setTasks(prev => prev.filter(task => task.id !== taskToDelete.id));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleLogout = () => {
    storageUtils.removeUser();
    onLogout();
  };

  // Get all unique tags from tasks
  const allTags = Array.from(new Set(tasks.flatMap(task => task.tags)));

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => task.tags.includes(tag));
    
    const matchesFilter = (() => {
      switch (filter) {
        case 'completed':
          return task.completed;
        case 'pending':
          return !task.completed;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesTags && matchesFilter;
  });

  const taskCounts = {
    all: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
  };

  const filterTabs = [
    { key: 'all' as FilterType, label: 'All Tasks', count: taskCounts.all },
    { key: 'pending' as FilterType, label: 'Pending', count: taskCounts.pending },
    { key: 'completed' as FilterType, label: 'Completed', count: taskCounts.completed },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center animate-in fade-in-0 slide-in-from-left-4 duration-500">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Task Manager</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back, {username}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 animate-in fade-in-0 slide-in-from-right-4 duration-500">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-105"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              <button
                onClick={() => setShowTaskForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </button>
              
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-200">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <Filter className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag, index) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTags(prev => 
                        prev.includes(tag) 
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 animate-in fade-in-0 zoom-in-95 ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {tag}
                  </button>
                ))}
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6 transition-colors duration-300">
            {filterTabs.map((tab, index) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 animate-in fade-in-0 zoom-in-95 ${
                  filter === tab.key
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-400">
          <TaskList
            tasks={filteredTasks}
            filter={filter}
            onToggleTask={handleToggleTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            isDark={isDark}
          />
        </div>
      </main>

      {/* Task Form Modal */}
      {(showTaskForm || editingTask) && (
        <TaskForm
          task={editingTask || undefined}
          onSave={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
          isDark={isDark}
        />
      )}
    </div>
  );
};

export default Dashboard;