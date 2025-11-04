import { API_BASE_URL } from './dynamic_url.js';

function showLoading() {   
    const quickInfoList = document.querySelector('.quick-info-list');
    if (quickInfoList) {
        quickInfoList.innerHTML = '<li>Loading...</li>';
    }

    const pillTexts = document.querySelectorAll('.pill__text');
    pillTexts.forEach(pill => {
        pill.textContent = 'Loading...';
    });

    const emptyCells = document.querySelectorAll('.table-wrapper td:empty');
    emptyCells.forEach(cell => {
        cell.innerHTML = '<span class="loading-text">Loading...</span>';
    });
    
}

function fetchProductData(productSlug) {
    showLoading(); 
    
    fetch(`${API_BASE_URL}/products/${productSlug}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateProductUI(data.product);
            }
        })
        .catch(error => {
            console.error(`Error fetching product data for ${productSlug}:`, error);
        })
        .finally(() => {
            // Hide loading 
        });
}

function updateProductUI(product) {
    const productTitle = document.querySelector('.product_description h2');
    if (productTitle) {
        productTitle.textContent = product.title;
    }

    // Update product description
    const productDescription = document.querySelector('.main-paragraph');
    const quickInfoList = document.querySelector('.quick-info-list');
    if (productDescription && quickInfoList) {
        const parsedData = parseProductDescription(product.content);
        
        // Set main paragraph
        productDescription.textContent = parsedData.mainParagraph;
        
        // Clear and populate list items
        quickInfoList.innerHTML = ''; 
        parsedData.quickInfo.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            quickInfoList.appendChild(li);
        });
    }

    // Update product pills
    const pillTexts = document.querySelectorAll('.pill__text');
    if (pillTexts.length > 0) {
        pillTexts[0].textContent = `Intenzitet ${product.intensity}`;
        pillTexts[1].textContent = product.packaging;
    }
    
    const typeRow = document.createElement('tr');
    const tasteRow = document.createElement('tr');
    const packRow = document.createElement('tr');
    const boxRow = document.createElement('tr');
    // Update product table
    const tableBody = document.querySelector('.table-wrapper tbody');
    if (tableBody) {
        tableBody.innerHTML = '';

        // type        
        typeRow.innerHTML = `<td>Vrsta</td><td></td><td>${product.type}</td>`;
        tableBody.appendChild(typeRow);

        // taste        
        tasteRow.innerHTML = `<td>Okus</td><td></td><td>${product.taste}</td>`;
        tableBody.appendChild(tasteRow);

        // packaging        
        packRow.innerHTML = `<td>Pakovanje</td><td></td><td>${product.packaging}</td>`;
        tableBody.appendChild(packRow);

        // box        
        boxRow.innerHTML = `<td>Kutija</td><td></td><td>${product.box}</td>`;
        tableBody.appendChild(boxRow);
    }
    
    if (price) {
        const formattedPrice = parseFloat(product.price).toFixed(2);
        price.innerHTML = `<b>${formattedPrice} KM</b>`;
    }

    const productSlug = document.body.getAttribute('data-product-slug');
    if (productSlug === "detergent" || productSlug === "shine"){
        tasteRow.innerHTML = ``;
        tableBody.appendChild(tasteRow);
    }
}

function parseProductDescription(descriptionText) {
    const parts = descriptionText.split('*').map(part => part.trim());
    
    // First part is the main paragraph
    const mainParagraph = parts[0];
    
    // Remaining parts are the list items
    const quickInfo = parts.slice(1).filter(item => item !== '');
    
    return { mainParagraph, quickInfo };
}

document.addEventListener('DOMContentLoaded', () => {
    const productSlug = document.body.getAttribute('data-product-slug');
    
    if (!productSlug) {
        console.error('No product slug found in data-product-slug attribute');
        return;
    }
    
    fetchProductData(productSlug);
});