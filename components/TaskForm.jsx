// components/TaskForm.jsx
"use client";
import { useState } from "react";
import { format } from "date-fns";
export default function TaskForm({ onSubmit, defaultTask, isEditing = false }) {
	const [task, setTask] = useState(
		defaultTask || {
			title: "",
			description: "",
			startDate: "",
			dueDate: "",
			priority: "medium",
			status: "pending",
			tags: "",
		}
	);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setTask((prev) => ({ ...prev, [name]: value }));
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const formatted = {
			...task,
			tags:
				typeof task.tags === "string"
					? task.tags
							.split(",")
							.map((t) => t.trim().toLowerCase())
							.filter(Boolean)
					: task.tags,
		};
		onSubmit(formatted);
	};

	return (
		<form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md space-y-4 max-w-md w-full">
			<h2 className="text-xl font-semibold">Add New Task</h2>

			<input type="text" name="title" placeholder="Task Title" value={task.title} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />

			<textarea name="description" placeholder="Description (optional)" value={task.description} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />

			<div className="flex gap-4">
				<div className="flex flex-col flex-1">
					<label className="text-sm">Start Date</label>
					<input type="date" name="startDate" value={task.startDate} onChange={handleChange} className="border px-2 py-1 rounded-md" />
				</div>
				<div className="flex flex-col flex-1">
					<label className="text-sm">Due Date</label>
					<input type="date" name="dueDate" value={task.dueDate} onChange={handleChange} className="border px-2 py-1 rounded-md" />
				</div>
			</div>

			<div>
				<label className="text-sm">Priority</label>
				<select name="priority" value={task.priority} onChange={handleChange} className="w-full border px-2 py-2 rounded-md">
					<option value="low">🟢 Low</option>
					<option value="medium">🟡 Medium</option>
					<option value="high">🔴 High</option>
				</select>
			</div>
			<label className="block mb-2 text-sm font-medium text-gray-700">Tags (comma separated)</label>
			<input
				type="text"
				value={task.tags}
				onChange={(e) => setTask({ ...task, tags: e.target.value })}
				placeholder="e.g. work, urgent"
				className="w-full p-2 border rounded-md mb-4"
			/>

			<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
				Add Task
			</button>
		</form>
	);
}
