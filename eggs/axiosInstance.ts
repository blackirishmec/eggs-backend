import axios from 'axios';

export const axiosInstance = axios.create({
	baseURL: 'https://api.stlouisfed.org/fred/',
	withCredentials: true,
	withXSRFToken: true,
});
