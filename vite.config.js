import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
	// Load environment variables based on the current mode
	const env = loadEnv(mode, process.cwd(), "");

	return {
		plugins: [react()],
		optimizeDeps: {
			exclude: ["lucide-react"],
		},
		define: {
			"process.env": { ...env }, // Make sure environment variables are accessible
		},
	};
});
