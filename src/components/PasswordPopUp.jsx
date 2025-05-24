import { useState } from "react";
import { X } from "lucide-react";

export function PasswordPopup({ onSubmit, onClose }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }
        onSubmit(password);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-surface-800 rounded-lg p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                >
                    <X className="w-5 h-5" />
                </button>
                
                <h2 className="text-xl font-semibold text-surface-800 dark:text-white mb-4">
                    Just one step more!
                </h2>
                
                <p className="text-surface-600 dark:text-surface-400 mb-4">
                    Please create a password for your new account
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-premium-500"
                            required
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-1">{error}</p>
                        )}
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-premium-500 hover:bg-premium-600 text-white rounded-lg transition-colors"
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
}