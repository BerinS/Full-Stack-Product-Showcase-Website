// Dynamic API base URL detection for frontend

let API_BASE_URL;

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
	API_BASE_URL = 'http://localhost:5001/api';
} else {
	API_BASE_URL = '/api';
}

export { API_BASE_URL };
