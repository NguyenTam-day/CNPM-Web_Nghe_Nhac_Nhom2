import axios from "axios";

const API_URL =
	import.meta.env.VITE_API_URL ||
	"http://localhost:5000";

console.log("🔌 API_URL:", API_URL); // Debug log
console.log("🔌 VITE_API_URL:", import.meta.env.VITE_API_URL); // Debug log

export const axiosInstance = axios.create({
	baseURL: `${API_URL}/api`,
});

// Interceptor to log requests
axiosInstance.interceptors.request.use(
	(config) => {
		const token = config.headers.Authorization;
		console.log("📤 Request to:", config.url);
		console.log("📤 Has Authorization header:", !!token);
		if (token) {
			console.log("📤 Token preview:", token.substring(0, 30) + "...");
		}
		return config;
	},
	(error) => {
		console.error("❌ Request interceptor error:", error);
		return Promise.reject(error);
	}
);

// Interceptor to log responses
axiosInstance.interceptors.response.use(
	(response) => {
		console.log("✅ Response from:", response.config.url, "Status:", response.status);
		return response;
	},
	(error) => {
		console.error("❌ Response error:");
		console.error("  URL:", error.config?.url);
		console.error("  Status:", error.response?.status);
		console.error("  Message:", error.response?.data?.message);
		console.error("  Headers:", error.config?.headers);
		return Promise.reject(error);
	}
);