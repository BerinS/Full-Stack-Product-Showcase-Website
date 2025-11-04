import { API_BASE_URL } from './dynamic_url.js';

// Products functionality
function fetchAllProductsForDashboard() {    
    fetch(`${API_BASE_URL}/products`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            
            if (data.success && data.products) {
                populateDashboardProductsTable(data.products);
            } else {
                console.warn('No products found', data);
            }
        })
        .catch(error => {
            console.error('Error fetching products for dashboard:', error);
        });
}
window.fetchAllProductsForDashboard = fetchAllProductsForDashboard;

function populateDashboardProductsTable(products) {    
    const tableBody = document.querySelector('tbody');
    if (!tableBody) {
        console.error('No tbody element found in dashboard');
        return;
    }

    tableBody.innerHTML = '';

    products.forEach((product, index) => {
        
        const row = document.createElement('tr');        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${product.title || 'N/A'}</td>
            <td>${product.price ? `${product.price} KM` : 'N/A'}</td>
            <td>${product.type || 'N/A'}</td>
            <td>
                <div class="btn-group me-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary" onclick="editProduct('${product._id}')">Edit</button>
                    <!-- <button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${product._id}')">Delete</button> -->
                </div>
            </td>
        `;        
        tableBody.appendChild(row);
    });  
}
window.populateDashboardProductsTable = populateDashboardProductsTable;

// Handles the modal for product editing
function editProduct(productId) {    
    fetch(`${API_BASE_URL}/products/${productId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.product) {
                populateModalWithProductData(data.product);
                
                // Get the existing modal instance or create one
                const modalElement = document.getElementById('productModal');
                const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modal.show();
            } else {
                console.error('Error fetching product data for editing');
            }
        })
        .catch(error => {
            console.error('Error fetching product:', error);
        });
}
window.editProduct = editProduct;

// Handles the modal for creating product
function addNewProduct() {
    const productData = {
        title: document.getElementById('productTitle').value,
        content: document.getElementById('productContent').value,
        price: parseFloat(document.getElementById('productPrice').value),
        type: document.getElementById('productType').value,
        packaging: document.getElementById('productPackaging').value,
        intensity: document.getElementById('productIntensity').value,
        taste: document.getElementById('productTaste').value,
        box: document.getElementById('productBox').value
    };
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Success', 'Product added successfully!', 'success');
        } else {
            showToast('Error', 'Failed to add product', 'error');
        }
        bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
        fetchAllProductsForDashboard();
    })
    .catch(error => {
        showToast('Error', 'Error adding product', 'error');
        console.error('Error:', error);
    });
}
window.addNewProduct = addNewProduct;

// handle Save serves as a  router that figures out which operation to perform based on product ID
function handleSave() {
    const productId = document.getElementById('productId').value;
    
    if (productId) {
        // Editing existing product
        updateProduct();
    } else {
        // Adding new product
        addNewProduct();
    }
}
window.handleSave = handleSave;

// Called when Apply Changes is clicked
function updateProduct() {
    const productId = document.getElementById('productId').value;
    
    const productData = {
        title: document.getElementById('productTitle').value,
        content: document.getElementById('productContent').value,
        price: parseFloat(document.getElementById('productPrice').value),
        type: document.getElementById('productType').value,
        packaging: document.getElementById('productPackaging').value,
        intensity: document.getElementById('productIntensity').value,
        taste: document.getElementById('productTaste').value,
        box: document.getElementById('productBox').value
    };
    
    fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Success', 'Product updated successfully!', 'success');
        } else {
            showToast('Error', 'Failed to update product', 'error');
        }
        bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
        fetchAllProductsForDashboard();
    })
    .catch(error => {
        showToast('Error', 'Error updating product', 'error');
        console.error('Error:', error);
    });
}
window.updateProduct = updateProduct;

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
window.showToast = showToast;

// Function to populate modal with product data
function populateModalWithProductData(product) {
    document.getElementById('productModalLabel').textContent = `Edit ${product.title}`;
    
    document.getElementById('productTitle').value = product.title || '';
    document.getElementById('productPrice').value = product.price || '';
    document.getElementById('productType').value = product.type || '';
    document.getElementById('productPackaging').value = product.packaging || '';
    document.getElementById('productIntensity').value = product.intensity || '';
    document.getElementById('productTaste').value = product.taste || '';
    document.getElementById('productBox').value = product.box || '';
    document.getElementById('productContent').value = product.content || '';
    
    // Store the product ID in hidden field
    document.getElementById('productId').value = product._id || '';
}
window.populateModalWithProductData = populateModalWithProductData;

// Function for Add Product button
function openAddModal() {    
    document.getElementById('productForm').reset();
    document.getElementById('productModalLabel').textContent = 'Add New Product';
    document.getElementById('productId').value = '';
    
    // Get the existing modal instance or create one
    const modalElement = document.getElementById('productModal');
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.show();
}
window.openAddModal = openAddModal;

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        console.log(`Deleting product: ${productId}`);
        // Example: fetch(`/api/products/${productId}`, { method: 'DELETE' })
        //     .then(response => response.json())
        //     .then(data => {
        //         if (data.success) {
        //             location.reload();
        //         }
        //     });
    }
}
window.deleteProduct = deleteProduct;

// Users functionality 
function fetchAllUsersForDashboard() {
    const token = localStorage.getItem('token'); 
    fetch(`${API_BASE_URL}/users`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.user) {
            populateDashboardUsersTable(data.user);
        } else {
            console.warn('No users found', data);
        }
    })
    .catch(error => {
        console.error('Error fetching users for dashboard:', error);
    });
}
window.fetchAllUsersForDashboard = fetchAllUsersForDashboard;

function populateDashboardUsersTable(users) {
    const tableBody = document.querySelector('#usersTable tbody');
    if (!tableBody) {
        console.error('No tbody element found in users table');
        return;
    }

    tableBody.innerHTML = '';

    users.forEach((user, index) => {
        
        const row = document.createElement('tr');        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.first_name + " " + user.last_name || 'N/A'}</td>
            <td>${user.email || 'N/A'}</td>
            <td>${user.role || 'N/A'}</td>
            <td>
                <div class="btn-group me-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary" onclick="editUser('${user._id}')">Edit</button>
                </div>
            </td>
        `;        
        tableBody.appendChild(row);
    });  
}
window.populateDashboardUsersTable = populateDashboardUsersTable;

// Handles the modal for product editing
function editUser(userId) {    
    fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }    
    })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.user) {
                populateModalWithUserData(data.user);
                
                // Get the existing modal instance or create one
                const modalElement = document.getElementById('userModal');
                const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modal.show();
            } else {
                console.error('Error fetching user data for editing');
            }
        })
        .catch(error => {
            console.error('Error fetching user:', error);
        });
}
window.editUser = editUser;

// Called when Apply Changes is clicked for the USERS modal
function updateUser() {
    const userId = document.getElementById('userId').value;
    
    const userData = {
        first_name: document.getElementById('userFirstName').value,
        last_name: document.getElementById('userLastName').value,
        email: document.getElementById('userEmail').value,
        role: document.getElementById('userRole').value,        
    };
    
    fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Success', 'User updated successfully!', 'success');
        } else {
            console.error('Failed to update user:', data);
            showToast('Error', data.message || 'Failed to update user', 'error');
        }
        bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
        fetchAllUsersForDashboard();
    })
    .catch(error => {
        showToast('Error', 'Error updating user', 'error');
        console.error('Error:', error);
    });
}
window.updateUser = updateUser;

// function to populate modal with user data
function populateModalWithUserData(user) {
    document.getElementById('userModalLabel').textContent = `Edit ${user.first_name} ${user.last_name}`;
    
    document.getElementById('userFirstName').value = user.first_name || '';
    document.getElementById('userLastName').value = user.last_name || '';
    document.getElementById('userEmail').value = user.email || '';
    document.getElementById('userRole').value = user.role || 'customer';
    
    // Store the user ID in hidden field
    document.getElementById('userId').value = user._id || '';
}
window.populateModalWithUserData = populateModalWithUserData;

// removes token and signs user out
function signOut() {
    localStorage.removeItem('token');
    window.location.href = '../sign_in.html'; 
    console.log('Signed out successfully');
}
window.signOut = signOut;

document.addEventListener('DOMContentLoaded', () => {    
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../index.html';
    } else {
        const pageSlug = document.body.getAttribute('data-page-slug');    
        if (pageSlug === 'dashboard') {
            fetchAllProductsForDashboard();
            fetchAllUsersForDashboard();
        }
    }
});