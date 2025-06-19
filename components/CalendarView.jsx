'use client';
import { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  format,
  parseISO,
} from 'date-fns';

export default function CalendarView({ tasks }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));

  const getTasksForDate = (date) => {
    return tasks.filter(task => task.dueDate && isSameDay(parseISO(task.dueDate), date));
  };

  const renderDays = () => {
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      const dateTasks = getTasksForDate(day);
      const isToday = isSameDay(day, new Date());
      const isSelected = selectedDate && isSameDay(day, selectedDate);

      days.push(
        <div
          key={day}
          className={`p-2 border h-24 cursor-pointer rounded-md text-sm flex flex-col justify-between 
            ${!isSameMonth(day, currentDate) ? 'text-gray-400' : ''}
            ${isToday ? 'bg-blue-100' : ''}
            ${isSelected ? 'border-2 border-blue-600' : ''}
          `}
          onClick={() => setSelectedDate(day)}
        >
          <div>{format(day, 'd')}</div>
          {dateTasks.length > 0 && (
            <span className="text-xs text-white bg-blue-500 px-1 rounded">
              {dateTasks.length} task{dateTasks.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      );

      day = addDays(day, 1);
    }

    return days;
  };

  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <div className="w-full max-w-5xl mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-2">🗓️ Calendar View</h2>

      <div className="grid grid-cols-7 gap-2 bg-white p-4 rounded-xl shadow">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-600">{day}</div>
        ))}
        {renderDays()}
      </div>

      {selectedDate && (
        <div className="mt-4 bg-white p-4 rounded-md shadow">
          <h3 className="text-lg font-bold">
            Tasks for {format(selectedDate, 'PPP')}:
          </h3>
          {selectedTasks.length === 0 ? (
            <p className="text-gray-500 text-sm">No tasks for this date.</p>
          ) : (
            <ul className="list-disc ml-5 mt-2 space-y-1">
              {selectedTasks.map((task, i) => (
                <li key={i} className={`${task.completed ? 'line-through text-gray-400' : ''}`}>
                  {task.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
