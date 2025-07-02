import React, { useState } from 'react';
import { Check, Edit, Trash2, Calendar, Flag, Tag, Clock } from 'lucide-react';
import { Task } from '../types';
import { formatDate, formatDueDate, getPriorityColor, isTaskOverdue } from '../utils/taskUtils';

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  isDark?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onEdit, onDelete, isDark = false }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(task);
      setIsDeleting(false);
    }, 300);
  };

  const handleToggle = () => {
    onToggle(task);
  };

  const isOverdue = task.dueDate && isTaskOverdue(task.dueDate) && !task.completed;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 group animate-in fade-in-0 slide-in-from-bottom-2 ${isOverdue ? 'ring-2 ring-red-200 dark:ring-red-800' : ''}`}>
      <div className="flex items-start space-x-4">
        <button
          onClick={handleToggle}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
          }`}
        >
          {task.completed && <Check className="h-4 w-4" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`text-lg font-semibold transition-all duration-200 ${
              task.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'
            }`}>
              {task.title}
            </h3>
            
            <div className="flex items-center space-x-2 ml-4">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority, isDark)}`}>
                <Flag className="h-3 w-3 mr-1" />
                {task.priority}
              </span>
            </div>
          </div>
          
          {task.description && (
            <p className={`text-sm mb-3 transition-all duration-200 ${
              task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'
            }`}>
              {task.description}
            </p>
          )}

          {task.dueDate && (
            <div className={`flex items-center text-sm mb-3 ${
              isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
              <Clock className="h-4 w-4 mr-1" />
              {formatDueDate(task.dueDate)}
              {isOverdue && <span className="ml-2 animate-pulse">⚠️</span>}
            </div>
          )}

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 animate-in fade-in-0 zoom-in-95 duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Created: {formatDate(task.createdAt)}
            </div>
            {task.updatedAt !== task.createdAt && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Updated: {formatDate(task.updatedAt)}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 transform hover:scale-110"
          >
            <Edit className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 transform hover:scale-110"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in-0 duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4 animate-in fade-in-0 zoom-in-95 duration-200 border dark:border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Task</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete "{task.title}"? This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-all duration-200 flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isDeleting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;