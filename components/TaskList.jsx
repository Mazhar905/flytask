import TaskCard from "./TaskCard";
import { parseISO, isBefore, isToday } from "date-fns";
const TaskList = ({ tasks, onToggle, onStatusChange, filter, hideArchived, onEdit, onDelete, searchText }) => {
	const now = new Date();

	const filteredTasks = tasks.filter((task) => {
		const due = task.dueDate ? parseISO(task.dueDate) : null;

		if (hideArchived && (task.status === "archived" || task.status === "cancelled")) {
			return false;
		}

		if (filter === "overdue" && (!due || isAfter(due, now) || task.status === "completed")) {
			return false;
		}

		if (filter === "today" && (!due || !isToday(due))) {
			return false;
		}

		if (["completed", "pending", "in progress", "archived", "cancelled"].includes(filter) && task.status !== filter) {
			return false;
		}

		// 🔍 Search logic
		if (searchText) {
			const keyword = searchText.toLowerCase();
			const inTitle = task.title?.toLowerCase().includes(keyword);
			const inDesc = task.description?.toLowerCase().includes(keyword);
			const inTags = task.tags?.some((tag) => tag.toLowerCase().includes(keyword));

			if (!inTitle && !inDesc && !inTags) return false;
		}

		return true;
	});

	const sortedTasks = [...filteredTasks].sort((a, b) => {
		const priorityValue = { high: 3, medium: 2, low: 1 };
		return priorityValue[b.priority] - priorityValue[a.priority];
	});

	return (
		<div className="space-y-4 mt-4">
			<div className="text-sm text-center text-gray-500 mt-2 italic">
				{filteredTasks.length > 0 ? `🔍 ${filteredTasks.length} task${filteredTasks.length > 1 ? "s" : ""} found` : "❌ No tasks match your search."}
			</div>

			{filteredTasks.length > 0 &&
				sortedTasks.map((task, i) => (
					<TaskCard
						key={i}
						task={task}
						onToggle={() => onToggle(i)}
						onStatusChange={(status) => onStatusChange(i, status)}
						onEdit={() => onEdit(task, i)}
						onDelete={() => onDelete(i)}
					/>
				))}
		</div>
	);
};

export default TaskList;
