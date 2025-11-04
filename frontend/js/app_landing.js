import { API_BASE_URL } from './dynamic_url.js';
import { isAuthenticated } from './app_auth.js'

// Function to fetch all products for landing page
function fetchAllProducts() {    
    fetch(`${API_BASE_URL}/products`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.success && data.products) {
                updateLandingPageProducts(data.products);
            } else {
                console.warn('API returned success:false or no products array', data);
            }
        })
        .catch(error => {
            console.error('Error fetching products for landing page:', error);
        });
}

function updateLandingPageProducts(products) {
    const spotlights = document.querySelectorAll('.spotlight');
    // Update spotlight sections (first 3 products)
    products.forEach((product, index) => {        
        if (spotlights[index]) {            
            // Update title
            const title = spotlights[index].querySelector('.content h2');
            if (title) {
                title.textContent = product.title;
            } else {
                console.warn(`No title for product ${product.title}`);
            }
            // Update description using main paragraph from content
            const description = spotlights[index].querySelector('.content p');
            if (description) {
                const parsedData = parseProductDescription(product.content);
                const words = parsedData.mainParagraph.split(' ');
                let displayText;
                if (words.length > 30) {
                    displayText = words.slice(0, 20).join(' ') + '...';
                } else {
                    displayText = parsedData.mainParagraph;
                }
                description.textContent = displayText;
            } else {
                console.warn(`No description for product ${product.title}`);
            }
        } 
    });

    // Update features section for products[3] and products[4]
    const features = document.querySelectorAll('.features li.icon, .features li.icon.solid');
    if (products[3] && features[0]) {
        // Deterdženti
        features[0].querySelector('h3').textContent = products[3].title;
        features[0].querySelector('p').textContent = parseProductDescription(products[3].content).mainParagraph;
    }
    if (products[4] && features[1]) {
        // Sjaj za posuđe
        features[1].querySelector('h3').textContent = products[4].title;
        features[1].querySelector('p').textContent = parseProductDescription(products[4].content).mainParagraph;
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



let count = 0;
let clickTimeout; 

function clickCounter() {    
    clearTimeout(clickTimeout); 
    count += 1;
    console.log('Click count:', count);
    console.log('Auth check:', isAuthenticated());

    if (count === 3) {	        
        if (!isAuthenticated()) {
            console.log('NOT authenticated - redirecting to sign in');
            window.location.href = 'sign_in.html';
        } else {
            console.log('IS authenticated - redirecting to dashboard');
            window.location.href = 'dashboard/dashboard.html';
        }        
    }	

    clickTimeout = setTimeout(() => { 
        count = 0;                                                                                               
    }, 1500);  
}

window.clickCounter = clickCounter;

// Initialize landing page only if data-product-slug="landing"
document.addEventListener('DOMContentLoaded', () => {
    const productSlug = document.body.getAttribute('data-product-slug');
    count = 0; 
    if (productSlug === 'landing') {
        fetchAllProducts();
        const btn = document.getElementById('hiddenClickCounterBtn');
        if (btn) {
            btn.addEventListener('click', clickCounter);
        }
    } 
});
