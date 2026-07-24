import api from './api';

export const getPipelines = async () => {
	const response = await api.get('/pipelines');
	return response.data;
};
