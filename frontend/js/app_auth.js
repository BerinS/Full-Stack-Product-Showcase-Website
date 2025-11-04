import { API_BASE_URL } from './dynamic_url.js';


// Sign in logic for sign_in.html
function signInUser(email, password) {
	fetch(`${API_BASE_URL}/auth/signin`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email, password })
	})
	.then(response => response.json())
	.then(data => {
		if (data.success && data.user && data.user.token) {
			localStorage.setItem('token', data.user.token);
      
      showToast('Success', 'Signed in successfully!', 'success');

			console.log('Signed in successfully. Token saved.');
			setTimeout(() => {
        if (data.user.user.role === 'admin'){
          window.location.href = 'dashboard/dashboard.html';
        }
        else {
          window.location.href = 'index.html';
        }
        
     }, 1000);

		} else {
			showToast('Error', 'Incorrect email or password', 'error');
      setTimeout(() => {
        window.location.href = 'sign_in.html';
      }, 1000);
		}
	})
	.catch(error => {
		console.error('Error during sign in', error);
		showToast('Error', 'Error during sign in', 'error');
	});
}

document.addEventListener('DOMContentLoaded', function() {
	const form = document.getElementById('signInForm');
	if (form) {
		form.addEventListener('submit', function(e) {
			e.preventDefault();
			const email = document.getElementById('email').value;
			const password = document.getElementById('password').value;
			signInUser(email, password);
		});
	}
});


function showToast(title, message, type = 'info') {
    const toastElement = document.getElementById('liveToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    if (type === 'success') {
        toastElement.classList.remove('bg-danger', 'bg-warning');
        toastElement.classList.add('bg-success', 'text-white');
    } else if (type === 'error') {
        toastElement.classList.remove('bg-success', 'bg-warning');
        toastElement.classList.add('bg-danger', 'text-white');
    } else {
        toastElement.classList.remove('bg-success', 'bg-danger', 'bg-warning');
    }
    
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

// Used on app_landing.js with the invisible button
export function isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
        // Decode the token payload
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Check if expired
        return Date.now() < payload.exp * 1000;
    } catch {
        return false;
    }
}