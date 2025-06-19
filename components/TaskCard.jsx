import { parseISO, isBefore } from "date-fns";
const TaskCard = ({ task, onToggle, onStatusChange }) => {
	const now = new Date();
	const dueDate = task.dueDate ? parseISO(task.dueDate) : null;
	const isOverdue = dueDate && isBefore(dueDate, now) && task.status !== "completed";

	const statusColor = {
		pending: "text-yellow-600 bg-yellow-100",
		"in progress": "text-blue-600 bg-blue-100",
		completed: "text-green-600 bg-green-100",
		cancelled: "text-red-600 bg-red-100",
		archived: "text-gray-500 bg-gray-200",
	};

	return (
		<div className={`p-4 rounded-xl shadow-md border-l-4 flex justify-between items-start ${isOverdue ? "border-red-600 bg-red-50" : "border-blue-500 bg-white"} transition`}>
			<div className="flex items-start gap-3 w-full">
				{/* <input type="checkbox" checked={task.status === "completed"} onChange={onToggle} className="mt-1 accent-blue-600" /> */}

				<div className={`w-full ${task.status === "completed" ? "opacity-50 line-through" : ""}`}>
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-semibold">{task.title}</h3>
						<span className={`text-sm font-medium ${task.priority === "high" ? "text-red-600" : task.priority === "medium" ? "text-yellow-500" : "text-green-600"}`}>
							{task.priority.toUpperCase()}
						</span>
					</div>
					{task.tags && task.tags.length > 0 && (
						<div className="flex flex-wrap gap-2 mt-2">
							{task.tags.map((tag, i) => (
								<span key={i} className="bg-gray-200 text-gray-700 px-2 py-0.5 text-xs rounded-full">
									#{tag}
								</span>
							))}
						</div>
					)}

					<p className="text-gray-600 text-sm mt-1">{task.description}</p>

					<div className="text-xs text-gray-500 mt-2">
						📅 Start: {task.startDate} | ⏰ Due: {task.dueDate}
					</div>

					<div className="mt-2">
						<label className="text-xs text-gray-500">Status:</label>
						<select
							value={task.status}
							onChange={(e) => onStatusChange(e.target.value)}
							className={`text-sm px-2 py-1 rounded-md border ml-2 ${statusColor[task.status]}`}
						>
							<option value="pending">Pending</option>
							<option value="in progress">In Progress</option>
							<option value="completed">Completed</option>
							<option value="cancelled">Cancelled</option>
							<option value="archived">Archived</option>
						</select>
					</div>

					{isOverdue && task.status !== "completed" && <div className="text-red-600 text-xs font-semibold mt-1">⚠️ Overdue</div>}
					<div className="mt-4 flex gap-3 text-sm">
						<button onClick={onEdit} className="text-blue-600 hover:underline">
							✏️ Edit
						</button>
						<button onClick={onDelete} className="text-red-600 hover:underline">
							🗑️ Delete
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TaskCard;
