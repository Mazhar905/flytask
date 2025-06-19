'use client';
import { useState, useEffect } from 'react';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import CalendarView from '@/components/CalendarView';

const STORAGE_KEY = 'my-tasks';

export default function Page() {
  const [filter, setFilter] = useState('all');
  const [hideArchived, setHideArchived] = useState(true);
  const [addNew, setHideAddNew] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);


  // 🟢 Load tasks from localStorage (on mount)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // 🟡 Save tasks to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // ➕ Add new task
  const handleAddTask = (task) => {
    setTasks(prev => [...prev, { ...task, completed: false }]);
  };

  // ✅ Toggle completed
  const handleToggleComplete = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };
  const handleStatusChange = (index, newStatus) => {
    const updated = [...tasks];
    updated[index].status = newStatus;
    setTasks(updated);
  };

  const handleEditTask = (task, index) => {
    setEditingTask({ ...task, index });
  };

  const handleUpdateTask = (updatedTask) => {
    const updated = [...tasks];
    updated[editingTask.index] = updatedTask;
    setTasks(updated);
    setEditingTask(null);
  };

  const handleDeleteTask = (index) => {
    const updated = [...tasks];
    updated.splice(index, 1);
    setTasks(updated);
  };

  const filters = [
    'all',
    'today',
    'overdue',
    'pending',
    'in progress',
    'completed',
    'cancelled',
    'archived'
  ];

  return (
    <div className="min-h-screen p-4 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-500">

      <div className="flex items-center justify-between mt-6">
        <h1 className="text-2xl font-bold dark:text-white">📝 To-Do List</h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-2 px-3 py-1 text-sm rounded-full border dark:border-gray-500"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      {/* <CalendarView tasks={tasks} /> */}

      <div className="flex gap-2 mt-6 flex-wrap">
        {filters.map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 rounded-md border ${filter === type ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
        <input
          type="text"
          placeholder="🔍 Search tasks by title, description, or tags..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="mt-4 w-full max-w-md p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex justify-between mt-4 w-full">
        <div>

          <input
            type="checkbox"
            checked={hideArchived}
            onChange={(e) => setHideArchived(e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm text-gray-700">Hide Archived & Cancelled</label>
        </div>

        <button
          onClick={() => setHideAddNew(!addNew)}
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {addNew ? 'Cancel' : 'Add New Task'}
        </button>
      </div>
      {addNew && <TaskForm onSubmit={handleAddTask} />}
      <TaskList
        tasks={tasks}
        onToggle={handleToggleComplete}
        onStatusChange={handleStatusChange}
        filter={filter}
        hideArchived={hideArchived}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        searchText={searchText}
      />



      {/* <TaskList tasks={tasks} onToggle={handleToggleComplete} filter={filter} onStatusChange={handleStatusChange} /> */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit Task</h2>
            <TaskForm
              onSubmit={handleUpdateTask}
              defaultTask={editingTask}
              isEditing
            />
            <button
              onClick={() => setEditingTask(null)}
              className="mt-4 text-gray-500 hover:underline text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
