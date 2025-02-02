import React from "react";
import { AlertTriangle } from "lucide-react";

export default function DeleteConfirmationModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
}) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
			<div className="bg-white dark:bg-surface-800 rounded-lg shadow-xl max-w-md w-full">
				<div className="p-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
							<AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
						</div>
						<h3 className="text-xl font-semibold text-surface-900 dark:text-white">
							{title || "Delete Confirmation"}
						</h3>
					</div>

					<p className="text-surface-600 dark:text-surface-300 mb-6">
						{message ||
							"Are you sure you want to delete this item? This action cannot be undone."}
					</p>

					<div className="flex justify-end gap-3">
						<button
							onClick={onClose}
							className="px-4 py-2 text-white bg-surface-500 dark:text-white dark:bg-surface-600 hover:bg-surface-600 dark:hover:bg-surface-700 rounded-lg transition-colors"
						>
							Cancel
						</button>
						<button
							onClick={() => {
								onConfirm();
								onClose();
							}}
							className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
						>
							Delete
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
