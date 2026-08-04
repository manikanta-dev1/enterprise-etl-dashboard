import axios from 'axios';

const api = axios.create({
	// In development Vite proxies /api to FastAPI. Set VITE_API_BASE_URL when
	// the API is hosted elsewhere (for example, https://api.example.com/api).
	baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
	timeout: 15000,
	headers: {
		'Content-Type': 'application/json',
	},
});

export const getApiErrorMessage = (error: unknown) => {
	if (axios.isAxiosError(error)) {
		const detail = error.response?.data?.detail;
		if (typeof detail === 'string') return detail;
		if (error.code === 'ECONNABORTED') return 'The API request timed out.';
		if (!error.response) return 'Unable to connect to the FastAPI server.';
		return error.message;
	}

	return error instanceof Error ? error.message : 'An unexpected error occurred.';
};

export default api;
