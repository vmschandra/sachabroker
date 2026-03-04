// Searcher Dashboard JavaScript
// Property search flow with filters, sorting, and contact unlock

// State variables
let allProperties = [];
let filteredProperties = [];
let currentFilters = {
    searchQuery: '',
    listingType: 'all',
    city: '',
    locality: '',
    pincode: '',
    minPrice: null,
    maxPrice: null,
    propertyTypes: [],
    bedrooms: 'any',
    furnishing: [],
    postedBy: []
};
let currentSort = 'newest';
let currentPage = 1;
const propertiesPerPage = 12;
let currentPropertyDetail = null;
let currentGalleryIndex = 0;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeSearcherDashboard();
    setupEventListeners();
    loadProperties();
});

// Initialize Dashboard
function initializeSearcherDashboard() {
    // Update UI for logged in user
    if (typeof updateUIForLoggedInUser === 'function') {
        updateUIForLoggedInUser();
    }
    
    // Check if user is logged in and show/hide auth buttons
    const storedUser = localStorage.getItem('currentUser_encrypted');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const userMenu = document.getElementById('userMenu');
    
    if (storedUser && currentUser) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (signupBtn) signupBtn.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Quick search
    document.getElementById('quickSearchBtn')?.addEventListener('click', handleQuickSearch);
    document.getElementById('quickSearchLocation')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleQuickSearch();
    });
    
    // Listing type toggle
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', handleListingTypeToggle);
    });
    
    // Filter inputs
    document.getElementById('filterCity')?.addEventListener('input', debounce(applyFilters, 500));
    document.getElementById('filterLocality')?.addEventListener('input', debounce(applyFilters, 500));
    document.getElementById('filterPincode')?.addEventListener('input', debounce(applyFilters, 500));
    document.getElementById('minPrice')?.addEventListener('input', debounce(applyFilters, 500));
    document.getElementById('maxPrice')?.addEventListener('input', debounce(applyFilters, 500));
    
    // Price presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', handlePricePreset);
    });
    
    // Property type checkboxes
    document.querySelectorAll('input[name="propertyType"]').forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });
    
    // Bedroom buttons
    document.querySelectorAll('.bedroom-btn').forEach(btn => {
        btn.addEventListener('click', handleBedroomSelect);
    });
    
    // Furnishing checkboxes
    document.querySelectorAll('input[name="furnishing"]').forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });
    
    // Posted by checkboxes
    document.querySelectorAll('input[name="postedBy"]').forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });
    
    // Clear all filters
    document.getElementById('clearAllFilters')?.addEventListener('click', clearAllFilters);
    
    // Sort by
    document.getElementById('sortBy')?.addEventListener('change', (e) => {
        currentSort = e.target.value;
        applyFilters();
    });
    
    // Toggle filters (mobile)
    document.getElementById('toggleFilters')?.addEventListener('click', toggleFiltersSidebar);
    document.getElementById('applyFiltersMobile')?.addEventListener('click', () => {
        toggleFiltersSidebar();
        applyFilters();
    });
    
    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
    
    // Login/Signup buttons redirect
    document.getElementById('loginBtn')?.addEventListener('click', () => {
        window.location.href = 'index.html#login';
    });
    document.getElementById('signupBtn')?.addEventListener('click', () => {
        window.location.href = 'index.html#signup';
    });
}

// Load Properties
function loadProperties() {
    showLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
        allProperties = JSON.parse(localStorage.getItem('properties') || '[]');
        
        // Add some sample properties if none exist
        if (allProperties.length === 0) {
            allProperties = generateSampleProperties();
            localStorage.setItem('properties', JSON.stringify(allProperties));
        }
        
        applyFilters();
        showLoading(false);
    }, 500);
}

// Generate Sample Properties for Demo
function generateSampleProperties() {
    const sampleImages = [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
    ];
    
    const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune'];
    const localities = ['Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'Jayanagar', 'Marathahalli'];
    const types = ['flat', 'house', 'villa', 'commercial', 'pg'];
    const furnishings = ['unfurnished', 'semi-furnished', 'fully-furnished'];
    
    const samples = [];
    
    for (let i = 0; i < 20; i++) {
        const listingType = Math.random() > 0.5 ? 'rent' : 'sale';
        const city = cities[Math.floor(Math.random() * cities.length)];
        const locality = localities[Math.floor(Math.random() * localities.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const bedrooms = Math.floor(Math.random() * 5) + 1;
        const price = listingType === 'rent' 
            ? (Math.floor(Math.random() * 50) + 10) * 1000 
            : (Math.floor(Math.random() * 100) + 20) * 100000;
        
        samples.push({
            id: Date.now() + i,
            ownerId: 'demo-owner-' + i,
            title: `Beautiful ${bedrooms}BHK ${type.charAt(0).toUpperCase() + type.slice(1)} in ${locality}`,
            listingType: listingType,
            propertyCategory: type,
            type: type,
            city: city,
            locality: locality,
            location: `${locality}, ${city}`,
            pincode: String(560000 + Math.floor(Math.random() * 100)),
            fullAddress: `${Math.floor(Math.random() * 500) + 1}, ${locality}, ${city}`,
            price: price,
            builtUpArea: Math.floor(Math.random() * 1500) + 500,
            area: Math.floor(Math.random() * 1500) + 500,
            bedrooms: bedrooms,
            bathrooms: Math.floor(Math.random() * 3) + 1,
            balconies: Math.floor(Math.random() * 3),
            furnishing: furnishings[Math.floor(Math.random() * furnishings.length)],
            propertyAge: ['new', '1-3', '3-5', '5-10'][Math.floor(Math.random() * 4)],
            floorNumber: String(Math.floor(Math.random() * 10) + 1),
            totalFloors: Math.floor(Math.random() * 15) + 5,
            facing: ['north', 'south', 'east', 'west'][Math.floor(Math.random() * 4)],
            availability: 'immediately',
            description: `This is a beautiful ${bedrooms}BHK property located in the prime area of ${locality}, ${city}. It offers excellent connectivity to major IT parks, shopping malls, and educational institutions. The property is well-maintained and comes with all modern amenities.`,
            images: [sampleImages[Math.floor(Math.random() * sampleImages.length)], ...sampleImages.slice(0, 3)],
            image: sampleImages[Math.floor(Math.random() * sampleImages.length)],
            amenities: ['lift', 'parking', 'power-backup', 'security', 'gym', 'swimming-pool'].slice(0, Math.floor(Math.random() * 5) + 2),
            nearby: ['metro', 'school', 'hospital', 'mall'].slice(0, Math.floor(Math.random() * 4) + 1),
            contactName: 'Property Owner',
            contactPhone: '+91 98765 ' + String(Math.floor(Math.random() * 90000) + 10000),
            contactEmail: 'owner' + i + '@email.com',
            contactVisibility: Math.random() > 0.3 ? 'paid' : 'public',
            contactFee: 299,
            status: 'active',
            views: Math.floor(Math.random() * 500),
            inquiries: Math.floor(Math.random() * 20),
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
        });
    }
    
    return samples;
}

// Handle Quick Search
function handleQuickSearch() {
    const query = document.getElementById('quickSearchLocation').value.trim();
    currentFilters.searchQuery = query;
    
    // Try to determine if it's a pincode
    if (/^\d{6}$/.test(query)) {
        currentFilters.pincode = query;
        document.getElementById('filterPincode').value = query;
    } else {
        // Could be city or locality
        currentFilters.city = query;
        currentFilters.locality = query;
    }
    
    applyFilters();
}

// Handle Listing Type Toggle
function handleListingTypeToggle(e) {
    document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    currentFilters.listingType = e.target.dataset.type;
    applyFilters();
}

// Handle Price Preset
function handlePricePreset(e) {
    const btn = e.target;
    const min = parseInt(btn.dataset.min);
    const max = parseInt(btn.dataset.max);
    
    // Toggle active state
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update price inputs
    document.getElementById('minPrice').value = min;
    document.getElementById('maxPrice').value = max === 999999999 ? '' : max;
    
    currentFilters.minPrice = min;
    currentFilters.maxPrice = max === 999999999 ? null : max;
    
    applyFilters();
}

// Handle Bedroom Select
function handleBedroomSelect(e) {
    document.querySelectorAll('.bedroom-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    currentFilters.bedrooms = e.target.dataset.value;
    applyFilters();
}

// Apply Filters
function applyFilters() {
    // Get filter values
    currentFilters.city = document.getElementById('filterCity')?.value.trim().toLowerCase() || '';
    currentFilters.locality = document.getElementById('filterLocality')?.value.trim().toLowerCase() || '';
    currentFilters.pincode = document.getElementById('filterPincode')?.value.trim() || '';
    
    const minPriceVal = document.getElementById('minPrice')?.value;
    const maxPriceVal = document.getElementById('maxPrice')?.value;
    currentFilters.minPrice = minPriceVal ? parseInt(minPriceVal) : null;
    currentFilters.maxPrice = maxPriceVal ? parseInt(maxPriceVal) : null;
    
    // Property types
    currentFilters.propertyTypes = [];
    document.querySelectorAll('input[name="propertyType"]:checked').forEach(cb => {
        currentFilters.propertyTypes.push(cb.value);
    });
    
    // Furnishing
    currentFilters.furnishing = [];
    document.querySelectorAll('input[name="furnishing"]:checked').forEach(cb => {
        currentFilters.furnishing.push(cb.value);
    });
    
    // Posted by
    currentFilters.postedBy = [];
    document.querySelectorAll('input[name="postedBy"]:checked').forEach(cb => {
        currentFilters.postedBy.push(cb.value);
    });
    
    // Filter properties
    filteredProperties = allProperties.filter(property => {
        // Listing type filter
        if (currentFilters.listingType !== 'all' && property.listingType !== currentFilters.listingType) {
            return false;
        }
        
        // Search query (matches city, locality, or title)
        if (currentFilters.searchQuery) {
            const query = currentFilters.searchQuery.toLowerCase();
            const matchesQuery = 
                (property.city?.toLowerCase().includes(query)) ||
                (property.locality?.toLowerCase().includes(query)) ||
                (property.location?.toLowerCase().includes(query)) ||
                (property.title?.toLowerCase().includes(query)) ||
                (property.pincode?.includes(query));
            if (!matchesQuery) return false;
        }
        
        // City filter
        if (currentFilters.city && !property.city?.toLowerCase().includes(currentFilters.city)) {
            return false;
        }
        
        // Locality filter
        if (currentFilters.locality && !property.locality?.toLowerCase().includes(currentFilters.locality)) {
            return false;
        }
        
        // Pincode filter
        if (currentFilters.pincode && property.pincode !== currentFilters.pincode) {
            return false;
        }
        
        // Price filter
        if (currentFilters.minPrice && property.price < currentFilters.minPrice) {
            return false;
        }
        if (currentFilters.maxPrice && property.price > currentFilters.maxPrice) {
            return false;
        }
        
        // Property type filter
        if (currentFilters.propertyTypes.length > 0) {
            const propType = property.propertyCategory || property.type;
            if (!currentFilters.propertyTypes.includes(propType)) {
                return false;
            }
        }
        
        // Bedrooms filter
        if (currentFilters.bedrooms !== 'any') {
            const targetBedrooms = parseInt(currentFilters.bedrooms);
            if (targetBedrooms === 5) {
                if (property.bedrooms < 5) return false;
            } else {
                if (property.bedrooms !== targetBedrooms) return false;
            }
        }
        
        // Furnishing filter
        if (currentFilters.furnishing.length > 0) {
            if (!currentFilters.furnishing.includes(property.furnishing)) {
                return false;
            }
        }
        
        return true;
    });
    
    // Sort properties
    sortProperties();
    
    // Update display
    updateActiveFilters();
    currentPage = 1;
    displayProperties();
}

// Sort Properties
function sortProperties() {
    switch (currentSort) {
        case 'price-low':
            filteredProperties.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProperties.sort((a, b) => b.price - a.price);
            break;
        case 'area-high':
            filteredProperties.sort((a, b) => (b.builtUpArea || b.area) - (a.builtUpArea || a.area));
            break;
        case 'location':
            filteredProperties.sort((a, b) => (a.locality || a.location).localeCompare(b.locality || b.location));
            break;
        case 'newest':
        default:
            filteredProperties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
    }
}

// Display Properties
function displayProperties() {
    const grid = document.getElementById('propertiesGrid');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    
    // Update count
    resultsCount.textContent = filteredProperties.length;
    
    if (filteredProperties.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    noResults.style.display = 'none';
    
    // Pagination
    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    const pageProperties = filteredProperties.slice(startIndex, endIndex);
    
    // Render properties
    grid.innerHTML = pageProperties.map(property => createPropertyCard(property)).join('');
    
    // Render pagination
    renderPagination();
}

// Create Property Card
function createPropertyCard(property) {
    const listingBadge = property.listingType === 'rent' ? 'For Rent' : 'For Sale';
    const listingClass = property.listingType === 'rent' ? 'rent' : 'sale';
    const priceDisplay = property.listingType === 'rent' 
        ? `₹${formatPrice(property.price)}<small>/month</small>` 
        : `₹${formatPrice(property.price)}`;
    const propType = (property.propertyCategory || property.type || 'property').charAt(0).toUpperCase() + (property.propertyCategory || property.type || 'property').slice(1);
    const imageCount = property.images?.length || 1;
    
    // Check if contact is unlocked for this property
    const isUnlocked = isContactUnlocked(property.id);
    
    return `
        <div class="property-card-search" onclick="openPropertyDetail(${property.id})">
            <div class="card-image">
                <img src="${property.image || property.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}" 
                     alt="${property.title}"
                     onerror="this.src='https://via.placeholder.com/400x300?text=Image+Error'">
                <span class="listing-badge ${listingClass}">${listingBadge}</span>
                <span class="property-type-tag">${propType}</span>
                ${imageCount > 1 ? `<span class="image-count"><i class="fas fa-camera"></i> ${imageCount}</span>` : ''}
            </div>
            <div class="card-content">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.locality || property.location || 'Location not specified'}
                </p>
                <div class="property-price">${priceDisplay}</div>
                <div class="property-features">
                    ${property.bedrooms ? `<span><i class="fas fa-bed"></i> ${property.bedrooms} Bed</span>` : ''}
                    ${property.bathrooms ? `<span><i class="fas fa-bath"></i> ${property.bathrooms} Bath</span>` : ''}
                    <span><i class="fas fa-vector-square"></i> ${property.builtUpArea || property.area} sqft</span>
                </div>
                <div class="contact-preview">
                    ${isUnlocked ? `
                        <span class="contact-blurred">
                            <i class="fas fa-phone"></i> ${property.contactPhone}
                        </span>
                    ` : `
                        <span class="contact-blurred">
                            <i class="fas fa-phone"></i> <span class="blur-text">+91 98XXX XXXXX</span>
                        </span>
                        <button class="btn-unlock-small" onclick="event.stopPropagation(); openContactUnlock(${property.id})">
                            <i class="fas fa-lock"></i> Unlock
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;
}

// Format Price
function formatPrice(price) {
    if (price >= 10000000) {
        return (price / 10000000).toFixed(2) + ' Cr';
    } else if (price >= 100000) {
        return (price / 100000).toFixed(2) + ' Lac';
    } else if (price >= 1000) {
        return (price / 1000).toFixed(0) + 'K';
    }
    return price.toLocaleString('en-IN');
}

// Render Pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    html += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">
        <i class="fas fa-chevron-left"></i>
    </button>`;
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    // Next button
    html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">
        <i class="fas fa-chevron-right"></i>
    </button>`;
    
    pagination.innerHTML = html;
}

// Go To Page
function goToPage(page) {
    currentPage = page;
    displayProperties();
    window.scrollTo({ top: 400, behavior: 'smooth' });
}

// Update Active Filters Display
function updateActiveFilters() {
    const container = document.getElementById('activeFilters');
    const tags = [];
    
    if (currentFilters.listingType !== 'all') {
        tags.push({ label: currentFilters.listingType === 'rent' ? 'For Rent' : 'For Sale', type: 'listingType' });
    }
    if (currentFilters.city) {
        tags.push({ label: `City: ${currentFilters.city}`, type: 'city' });
    }
    if (currentFilters.locality) {
        tags.push({ label: `Area: ${currentFilters.locality}`, type: 'locality' });
    }
    if (currentFilters.pincode) {
        tags.push({ label: `Pincode: ${currentFilters.pincode}`, type: 'pincode' });
    }
    if (currentFilters.minPrice || currentFilters.maxPrice) {
        const min = currentFilters.minPrice ? `₹${formatPrice(currentFilters.minPrice)}` : '₹0';
        const max = currentFilters.maxPrice ? `₹${formatPrice(currentFilters.maxPrice)}` : 'Any';
        tags.push({ label: `Price: ${min} - ${max}`, type: 'price' });
    }
    if (currentFilters.propertyTypes.length > 0) {
        tags.push({ label: `Type: ${currentFilters.propertyTypes.join(', ')}`, type: 'propertyTypes' });
    }
    if (currentFilters.bedrooms !== 'any') {
        tags.push({ label: `${currentFilters.bedrooms}+ BHK`, type: 'bedrooms' });
    }
    if (currentFilters.furnishing.length > 0) {
        tags.push({ label: `Furnishing: ${currentFilters.furnishing.join(', ')}`, type: 'furnishing' });
    }
    
    if (tags.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'flex';
    container.innerHTML = tags.map(tag => `
        <span class="filter-tag">
            ${tag.label}
            <i class="fas fa-times" onclick="removeFilter('${tag.type}')"></i>
        </span>
    `).join('');
}

// Remove Filter
function removeFilter(type) {
    switch (type) {
        case 'listingType':
            currentFilters.listingType = 'all';
            document.querySelectorAll('.type-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.type === 'all');
            });
            break;
        case 'city':
            currentFilters.city = '';
            document.getElementById('filterCity').value = '';
            break;
        case 'locality':
            currentFilters.locality = '';
            document.getElementById('filterLocality').value = '';
            break;
        case 'pincode':
            currentFilters.pincode = '';
            document.getElementById('filterPincode').value = '';
            break;
        case 'price':
            currentFilters.minPrice = null;
            currentFilters.maxPrice = null;
            document.getElementById('minPrice').value = '';
            document.getElementById('maxPrice').value = '';
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            break;
        case 'propertyTypes':
            currentFilters.propertyTypes = [];
            document.querySelectorAll('input[name="propertyType"]').forEach(cb => cb.checked = false);
            break;
        case 'bedrooms':
            currentFilters.bedrooms = 'any';
            document.querySelectorAll('.bedroom-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.value === 'any');
            });
            break;
        case 'furnishing':
            currentFilters.furnishing = [];
            document.querySelectorAll('input[name="furnishing"]').forEach(cb => cb.checked = false);
            break;
    }
    applyFilters();
}

// Clear All Filters
function clearAllFilters() {
    // Reset all filter values
    currentFilters = {
        searchQuery: '',
        listingType: 'all',
        city: '',
        locality: '',
        pincode: '',
        minPrice: null,
        maxPrice: null,
        propertyTypes: [],
        bedrooms: 'any',
        furnishing: [],
        postedBy: []
    };
    
    // Reset UI
    document.getElementById('quickSearchLocation').value = '';
    document.getElementById('filterCity').value = '';
    document.getElementById('filterLocality').value = '';
    document.getElementById('filterPincode').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === 'all');
    });
    
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    
    document.querySelectorAll('input[name="propertyType"]').forEach(cb => cb.checked = false);
    
    document.querySelectorAll('.bedroom-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.value === 'any');
    });
    
    document.querySelectorAll('input[name="furnishing"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name="postedBy"]').forEach(cb => cb.checked = false);
    
    applyFilters();
}

// Toggle Filters Sidebar (Mobile)
function toggleFiltersSidebar() {
    const sidebar = document.getElementById('filtersSidebar');
    let overlay = document.querySelector('.filters-overlay');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'filters-overlay';
        overlay.onclick = toggleFiltersSidebar;
        document.body.appendChild(overlay);
    }
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
}

// Show/Hide Loading
function showLoading(show) {
    const loadingState = document.getElementById('loadingState');
    const grid = document.getElementById('propertiesGrid');
    
    if (show) {
        loadingState.style.display = 'block';
        grid.style.display = 'none';
    } else {
        loadingState.style.display = 'none';
        grid.style.display = 'grid';
    }
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==========================================
// PROPERTY DETAIL MODAL
// ==========================================

// Open Property Detail
function openPropertyDetail(propertyId) {
    const property = allProperties.find(p => p.id === propertyId);
    if (!property) return;
    
    currentPropertyDetail = property;
    currentGalleryIndex = 0;
    
    const modal = document.getElementById('propertyDetailModal');
    const body = document.getElementById('propertyDetailBody');
    
    body.innerHTML = generatePropertyDetailHTML(property);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Increment view count
    property.views = (property.views || 0) + 1;
    saveProperties();
}

// Close Property Detail Modal
function closePropertyDetailModal() {
    document.getElementById('propertyDetailModal').style.display = 'none';
    document.body.style.overflow = '';
    currentPropertyDetail = null;
}

// Generate Property Detail HTML
function generatePropertyDetailHTML(property) {
    const isUnlocked = isContactUnlocked(property.id);
    const images = property.images?.length > 0 ? property.images : [property.image || 'https://via.placeholder.com/800x500?text=No+Image'];
    const priceDisplay = property.listingType === 'rent' 
        ? `₹${formatPrice(property.price)}` 
        : `₹${formatPrice(property.price)}`;
    const pricePeriod = property.listingType === 'rent' ? '/month' : '';
    
    // Amenity icon mapping
    const amenityIcons = {
        'lift': 'fas fa-sort',
        'parking': 'fas fa-car',
        'power-backup': 'fas fa-bolt',
        'security': 'fas fa-shield-alt',
        'cctv': 'fas fa-video',
        'gym': 'fas fa-dumbbell',
        'swimming-pool': 'fas fa-swimming-pool',
        'clubhouse': 'fas fa-glass-cheers',
        'kids-play-area': 'fas fa-child',
        'garden': 'fas fa-tree',
        'air-conditioning': 'fas fa-snowflake',
        'modular-kitchen': 'fas fa-utensils',
        'wifi': 'fas fa-wifi',
        'wardrobe': 'fas fa-door-closed'
    };
    
    return `
        <!-- Image Gallery -->
        <div class="property-gallery">
            <img src="${images[0]}" alt="${property.title}" class="gallery-main-image" id="galleryMainImage"
                 onerror="this.src='https://via.placeholder.com/800x500?text=Image+Error'">
            ${images.length > 1 ? `
                <button class="gallery-nav prev" onclick="prevGalleryImage()"><i class="fas fa-chevron-left"></i></button>
                <button class="gallery-nav next" onclick="nextGalleryImage()"><i class="fas fa-chevron-right"></i></button>
                <span class="gallery-counter"><span id="galleryCounter">1</span> / ${images.length}</span>
            ` : ''}
        </div>
        
        ${images.length > 1 ? `
            <div class="gallery-thumbnails">
                ${images.map((img, idx) => `
                    <div class="gallery-thumb ${idx === 0 ? 'active' : ''}" onclick="goToGalleryImage(${idx})">
                        <img src="${img}" alt="Thumbnail ${idx + 1}" onerror="this.src='https://via.placeholder.com/100x75?text=Error'">
                    </div>
                `).join('')}
            </div>
        ` : ''}
        
        <!-- Property Info -->
        <div class="property-info-section">
            <div class="property-header">
                <div>
                    <h1>${property.title}</h1>
                    <p class="location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${property.fullAddress || property.locality || property.location}
                    </p>
                </div>
                <div class="price">
                    <span class="amount">${priceDisplay}</span>
                    <span class="period">${pricePeriod}</span>
                </div>
            </div>
            
            <!-- Key Features -->
            <div class="key-features">
                ${property.bedrooms ? `
                    <div class="feature-item">
                        <i class="fas fa-bed"></i>
                        <span class="value">${property.bedrooms}</span>
                        <span class="label">Bedrooms</span>
                    </div>
                ` : ''}
                ${property.bathrooms ? `
                    <div class="feature-item">
                        <i class="fas fa-bath"></i>
                        <span class="value">${property.bathrooms}</span>
                        <span class="label">Bathrooms</span>
                    </div>
                ` : ''}
                <div class="feature-item">
                    <i class="fas fa-vector-square"></i>
                    <span class="value">${property.builtUpArea || property.area}</span>
                    <span class="label">Sq.ft</span>
                </div>
                ${property.balconies ? `
                    <div class="feature-item">
                        <i class="fas fa-door-open"></i>
                        <span class="value">${property.balconies}</span>
                        <span class="label">Balconies</span>
                    </div>
                ` : ''}
                <div class="feature-item">
                    <i class="fas fa-couch"></i>
                    <span class="value">${(property.furnishing || 'Not Specified').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                    <span class="label">Furnishing</span>
                </div>
            </div>
            
            <!-- Property Details -->
            <div class="details-grid">
                <div class="detail-item">
                    <span class="label">Property Type</span>
                    <span class="value">${(property.propertyCategory || property.type || 'Not Specified').charAt(0).toUpperCase() + (property.propertyCategory || property.type || '').slice(1)}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Listing Type</span>
                    <span class="value">${property.listingType === 'rent' ? 'For Rent' : 'For Sale'}</span>
                </div>
                ${property.floorNumber ? `
                    <div class="detail-item">
                        <span class="label">Floor</span>
                        <span class="value">${property.floorNumber}${property.totalFloors ? ' of ' + property.totalFloors : ''}</span>
                    </div>
                ` : ''}
                ${property.propertyAge ? `
                    <div class="detail-item">
                        <span class="label">Property Age</span>
                        <span class="value">${property.propertyAge} years</span>
                    </div>
                ` : ''}
                ${property.facing ? `
                    <div class="detail-item">
                        <span class="label">Facing</span>
                        <span class="value">${property.facing.charAt(0).toUpperCase() + property.facing.slice(1)}</span>
                    </div>
                ` : ''}
                <div class="detail-item">
                    <span class="label">Availability</span>
                    <span class="value">${(property.availability || 'Immediately').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                </div>
            </div>
            
            <!-- Description -->
            <div class="property-description">
                <h3><i class="fas fa-align-left"></i> Description</h3>
                <p>${property.description || 'No description available.'}</p>
            </div>
            
            <!-- Amenities -->
            ${property.amenities?.length > 0 ? `
                <div class="amenities-display">
                    <h3><i class="fas fa-check-circle"></i> Amenities</h3>
                    <div class="amenities-tags">
                        ${property.amenities.map(amenity => `
                            <span class="amenity-tag">
                                <i class="${amenityIcons[amenity] || 'fas fa-check'}"></i>
                                ${amenity.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <!-- Map -->
            <div class="property-map">
                <h3><i class="fas fa-map-marker-alt"></i> Location</h3>
                <div class="map-placeholder-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <p>${property.locality || property.location}, ${property.city || ''}</p>
                    <small>Map integration coming soon</small>
                </div>
            </div>
            
            <!-- Contact Section -->
            <div class="contact-section">
                <h3><i class="fas fa-phone-alt"></i> Contact Owner</h3>
                
                ${isUnlocked || property.contactVisibility === 'public' ? `
                    <div class="contact-unlocked">
                        <div class="contact-item phone">
                            <i class="fas fa-phone"></i>
                            <div class="info">
                                <span class="label">Phone</span>
                                <span class="value"><a href="tel:${property.contactPhone}">${property.contactPhone}</a></span>
                            </div>
                        </div>
                        ${property.contactEmail ? `
                            <div class="contact-item email">
                                <i class="fas fa-envelope"></i>
                                <div class="info">
                                    <span class="label">Email</span>
                                    <span class="value"><a href="mailto:${property.contactEmail}">${property.contactEmail}</a></span>
                                </div>
                            </div>
                        ` : ''}
                        <div class="contact-item whatsapp">
                            <i class="fab fa-whatsapp"></i>
                            <div class="info">
                                <span class="label">WhatsApp</span>
                                <span class="value"><a href="https://wa.me/${property.contactPhone?.replace(/[^0-9]/g, '')}" target="_blank">Send Message</a></span>
                            </div>
                        </div>
                    </div>
                ` : `
                    <div class="contact-locked">
                        <div class="lock-icon">
                            <i class="fas fa-lock"></i>
                        </div>
                        <h4>Contact details are protected</h4>
                        <p>Unlock to get direct contact with the property owner</p>
                        <div class="blurred-info">
                            <span class="blurred-item"><i class="fas fa-phone"></i> +91 98XXX XXXXX</span>
                            <span class="blurred-item"><i class="fas fa-envelope"></i> owner@xxxxx.com</span>
                        </div>
                        <button class="btn-unlock" onclick="openContactUnlock(${property.id})">
                            <i class="fas fa-lock-open"></i> Unlock for ₹${property.contactFee || 299}
                        </button>
                    </div>
                `}
            </div>
        </div>
    `;
}

// Gallery Navigation
function nextGalleryImage() {
    if (!currentPropertyDetail) return;
    const images = currentPropertyDetail.images || [currentPropertyDetail.image];
    currentGalleryIndex = (currentGalleryIndex + 1) % images.length;
    updateGalleryDisplay();
}

function prevGalleryImage() {
    if (!currentPropertyDetail) return;
    const images = currentPropertyDetail.images || [currentPropertyDetail.image];
    currentGalleryIndex = (currentGalleryIndex - 1 + images.length) % images.length;
    updateGalleryDisplay();
}

function goToGalleryImage(index) {
    currentGalleryIndex = index;
    updateGalleryDisplay();
}

function updateGalleryDisplay() {
    if (!currentPropertyDetail) return;
    const images = currentPropertyDetail.images || [currentPropertyDetail.image];
    
    document.getElementById('galleryMainImage').src = images[currentGalleryIndex];
    document.getElementById('galleryCounter').textContent = currentGalleryIndex + 1;
    
    // Update thumbnail active state
    document.querySelectorAll('.gallery-thumb').forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === currentGalleryIndex);
    });
}

// ==========================================
// CONTACT UNLOCK PAYMENT - Plan Selection Flow
// ==========================================

// Current payment state
let selectedPlan = 'single';
let currentPaymentPropertyId = null;

// Open Contact Unlock Modal
function openContactUnlock(propertyId) {
    const property = allProperties.find(p => p.id === propertyId);
    if (!property) return;
    
    // Check if user is logged in
    if (!currentUser) {
        if (typeof showNotification === 'function') {
            showNotification('Please login to unlock contact details', 'error');
        }
        window.location.href = 'index.html#login';
        return;
    }
    
    // Check if user has unlimited plan
    if (hasUnlimitedPlan()) {
        // Auto-unlock for free
        saveContactUnlock(propertyId);
        showPaymentSuccess(property, 'unlimited', 0);
        displayProperties();
        return;
    }
    
    // Check if already unlocked
    if (isContactUnlocked(propertyId)) {
        showPaymentSuccess(property, 'already', 0);
        return;
    }
    
    currentPropertyDetail = property;
    currentPaymentPropertyId = propertyId;
    selectedPlan = 'single';
    
    const modal = document.getElementById('contactUnlockModal');
    const summary = document.getElementById('unlockPropertySummary');
    
    // Reset to step 1
    document.getElementById('paymentStep1').style.display = 'block';
    document.getElementById('paymentStep2').style.display = 'none';
    
    // Hide unlimited plan status if no active plan
    document.getElementById('currentPlanStatus').style.display = 'none';
    
    // Reset plan selection
    document.getElementById('planSingle').checked = true;
    updatePlanSelection();
    
    summary.innerHTML = `
        <img src="${property.image || property.images?.[0] || 'https://via.placeholder.com/100x75'}" 
             alt="${property.title}"
             onerror="this.src='https://via.placeholder.com/100x75?text=Error'">
        <div class="summary-info">
            <h4>${property.title}</h4>
            <p>${property.locality || property.location}</p>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Setup plan selection listeners
    setupPlanSelection();
    
    // Setup payment button
    document.getElementById('proceedPaymentBtn').onclick = () => initiatePayment();
}

// Setup plan selection event listeners
function setupPlanSelection() {
    const planCards = document.querySelectorAll('.plan-card');
    const planRadios = document.querySelectorAll('input[name="plan"]');
    
    planCards.forEach(card => {
        card.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                updatePlanSelection();
            }
        });
    });
    
    planRadios.forEach(radio => {
        radio.addEventListener('change', updatePlanSelection);
    });
}

// Update plan selection UI
function updatePlanSelection() {
    const planCards = document.querySelectorAll('.plan-card');
    const selectedRadio = document.querySelector('input[name="plan"]:checked');
    
    selectedPlan = selectedRadio ? selectedRadio.value : 'single';
    
    planCards.forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.plan === selectedPlan) {
            card.classList.add('selected');
        }
    });
    
    // Update payment summary
    const planName = selectedPlan === 'single' ? 'Single Contact' : 'Unlimited Monthly';
    const amount = selectedPlan === 'single' ? '₹299' : '₹999';
    
    document.getElementById('selectedPlanName').textContent = planName;
    document.getElementById('totalAmount').textContent = amount;
    document.getElementById('payBtnPrice').textContent = amount;
}

// Initiate payment
function initiatePayment() {
    const amount = selectedPlan === 'single' ? 299 : 999;
    
    // Show processing step
    document.getElementById('paymentStep1').style.display = 'none';
    document.getElementById('paymentStep2').style.display = 'block';
    
    // Initialize Razorpay
    initializeRazorpay(amount, selectedPlan);
}

// Initialize Razorpay Payment Gateway
function initializeRazorpay(amount, plan) {
    // Check if Razorpay is loaded
    if (typeof Razorpay === 'undefined') {
        // Load Razorpay script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => processRazorpayPayment(amount, plan);
        script.onerror = () => simulatePayment(amount, plan);
        document.head.appendChild(script);
    } else {
        processRazorpayPayment(amount, plan);
    }
}

// Process Razorpay Payment
function processRazorpayPayment(amount, plan) {
    const planName = plan === 'single' ? 'Single Contact Unlock' : 'Unlimited Monthly Plan';
    
    const options = {
        key: 'rzp_test_demo_key', // Replace with your Razorpay key in production
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'Sachabroker',
        description: planName,
        image: 'https://sachabroker.com/logo.png',
        handler: function(response) {
            // Payment successful
            handlePaymentSuccess(response, plan, amount);
        },
        prefill: {
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            contact: currentUser?.phone || ''
        },
        theme: {
            color: '#27ae60'
        },
        modal: {
            ondismiss: function() {
                // Payment cancelled - go back to step 1
                document.getElementById('paymentStep1').style.display = 'block';
                document.getElementById('paymentStep2').style.display = 'none';
            }
        }
    };
    
    try {
        const rzp = new Razorpay(options);
        rzp.on('payment.failed', function(response) {
            handlePaymentFailure(response);
        });
        rzp.open();
    } catch (error) {
        console.log('Razorpay not available, simulating payment');
        simulatePayment(amount, plan);
    }
}

// Simulate payment (for demo/testing)
function simulatePayment(amount, plan) {
    // Simulate processing delay
    setTimeout(() => {
        const mockResponse = {
            razorpay_payment_id: 'pay_' + generateTransactionId(),
            razorpay_order_id: 'order_' + generateTransactionId(),
            razorpay_signature: 'sig_' + generateTransactionId()
        };
        handlePaymentSuccess(mockResponse, plan, amount);
    }, 2000);
}

// Handle Payment Success
function handlePaymentSuccess(response, plan, amount) {
    const property = allProperties.find(p => p.id === currentPaymentPropertyId);
    if (!property) return;
    
    const transactionId = response.razorpay_payment_id || generateTransactionId();
    
    // Save unlock status
    saveContactUnlock(currentPaymentPropertyId);
    
    // If unlimited plan, save plan status
    if (plan === 'unlimited') {
        saveUnlimitedPlan();
    }
    
    // Increment inquiry count
    property.inquiries = (property.inquiries || 0) + 1;
    saveProperties();
    
    // Save transaction record
    saveTransaction({
        id: transactionId,
        propertyId: currentPaymentPropertyId,
        plan: plan,
        amount: amount,
        date: new Date().toISOString(),
        status: 'success'
    });
    
    // Close unlock modal
    closeContactUnlockModal();
    
    // Show success modal with transaction details
    showPaymentSuccess(property, plan, amount, transactionId);
    
    // Send receipt email (simulated)
    sendReceiptEmail(transactionId, plan, amount);
    
    // Refresh property detail if open
    if (document.getElementById('propertyDetailModal').style.display === 'block') {
        const body = document.getElementById('propertyDetailBody');
        body.innerHTML = generatePropertyDetailHTML(property);
    }
    
    // Refresh property cards
    displayProperties();
}

// Handle Payment Failure
function handlePaymentFailure(response) {
    // Go back to step 1
    document.getElementById('paymentStep1').style.display = 'block';
    document.getElementById('paymentStep2').style.display = 'none';
    
    if (typeof showNotification === 'function') {
        showNotification('Payment failed. Please try again.', 'error');
    } else {
        alert('Payment failed. Please try again.');
    }
    
    console.error('Payment failed:', response.error);
}

// Generate transaction ID
function generateTransactionId() {
    return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Show Payment Success Modal
function showPaymentSuccess(property, plan, amount, transactionId = null) {
    const modal = document.getElementById('paymentSuccessModal');
    const contactDetails = document.getElementById('unlockedContactDetails');
    const successMessage = document.getElementById('successPlanMessage');
    const amountPaid = document.getElementById('amountPaid');
    const planPurchased = document.getElementById('planPurchased');
    const txnId = document.getElementById('transactionId');
    const planValidityRow = document.getElementById('planValidityRow');
    const planValidity = document.getElementById('planValidity');
    
    // Set transaction details
    if (transactionId) {
        txnId.textContent = transactionId;
        amountPaid.textContent = '₹' + amount;
    }
    
    // Set plan info
    if (plan === 'unlimited') {
        planPurchased.textContent = 'Unlimited Monthly';
        successMessage.textContent = 'You now have unlimited access for 30 days!';
        planValidityRow.style.display = 'flex';
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 30);
        planValidity.textContent = validUntil.toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    } else if (plan === 'already') {
        planPurchased.textContent = 'Previously Unlocked';
        amountPaid.textContent = '₹0';
        successMessage.textContent = 'This contact was already unlocked!';
        planValidityRow.style.display = 'none';
    } else {
        planPurchased.textContent = 'Single Contact';
        successMessage.textContent = 'Contact details have been unlocked!';
        planValidityRow.style.display = 'none';
    }
    
    contactDetails.innerHTML = `
        <div class="unlocked-contact-item">
            <i class="fas fa-phone"></i>
            <div>
                <span class="label">Phone</span>
                <span class="value"><a href="tel:${property.contactPhone}">${property.contactPhone}</a></span>
            </div>
        </div>
        ${property.contactEmail ? `
            <div class="unlocked-contact-item">
                <i class="fas fa-envelope"></i>
                <div>
                    <span class="label">Email</span>
                    <span class="value"><a href="mailto:${property.contactEmail}">${property.contactEmail}</a></span>
                </div>
            </div>
        ` : ''}
        <div class="unlocked-contact-item">
            <i class="fab fa-whatsapp"></i>
            <div>
                <span class="label">WhatsApp</span>
                <span class="value"><a href="https://wa.me/91${property.contactPhone?.replace(/[^0-9]/g, '')}" target="_blank">Send Message</a></span>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close Contact Unlock Modal
function closeContactUnlockModal() {
    document.getElementById('contactUnlockModal').style.display = 'none';
    // Reset to step 1
    document.getElementById('paymentStep1').style.display = 'block';
    document.getElementById('paymentStep2').style.display = 'none';
}

// Close Payment Success Modal
function closePaymentSuccessModal() {
    document.getElementById('paymentSuccessModal').style.display = 'none';
}

// ==========================================
// UNLIMITED PLAN MANAGEMENT
// ==========================================

// Check if user has active unlimited plan
function hasUnlimitedPlan() {
    if (!currentUser) return false;
    
    const planData = localStorage.getItem(`unlimited_plan_${currentUser.id}`);
    if (!planData) return false;
    
    try {
        const plan = JSON.parse(planData);
        const expiry = new Date(plan.expiresAt);
        return expiry > new Date();
    } catch {
        return false;
    }
}

// Save unlimited plan
function saveUnlimitedPlan() {
    if (!currentUser) return;
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    const planData = {
        plan: 'unlimited',
        purchasedAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString()
    };
    
    localStorage.setItem(`unlimited_plan_${currentUser.id}`, JSON.stringify(planData));
}

// Get unlimited plan expiry
function getUnlimitedPlanExpiry() {
    if (!currentUser) return null;
    
    const planData = localStorage.getItem(`unlimited_plan_${currentUser.id}`);
    if (!planData) return null;
    
    try {
        const plan = JSON.parse(planData);
        return new Date(plan.expiresAt);
    } catch {
        return null;
    }
}

// ==========================================
// TRANSACTION & RECEIPT MANAGEMENT
// ==========================================

// Save transaction record
function saveTransaction(transaction) {
    if (!currentUser) return;
    
    const transactions = JSON.parse(localStorage.getItem(`transactions_${currentUser.id}`) || '[]');
    transactions.unshift(transaction);
    localStorage.setItem(`transactions_${currentUser.id}`, JSON.stringify(transactions));
}

// Get user transactions
function getUserTransactions() {
    if (!currentUser) return [];
    return JSON.parse(localStorage.getItem(`transactions_${currentUser.id}`) || '[]');
}

// Send receipt email (simulated)
function sendReceiptEmail(transactionId, plan, amount) {
    const planName = plan === 'single' ? 'Single Contact Unlock' : 'Unlimited Monthly Plan';
    
    console.log(`📧 Receipt email sent to ${currentUser?.email}`);
    console.log(`   Transaction ID: ${transactionId}`);
    console.log(`   Plan: ${planName}`);
    console.log(`   Amount: ₹${amount}`);
    
    // In production, this would call an API to send actual email
    if (typeof showNotification === 'function') {
        setTimeout(() => {
            showNotification('Receipt sent to ' + (currentUser?.email || 'your email'), 'success');
        }, 1500);
    }
}

// Download receipt
function downloadReceipt() {
    const txnId = document.getElementById('transactionId').textContent;
    const amount = document.getElementById('amountPaid').textContent;
    const plan = document.getElementById('planPurchased').textContent;
    const date = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const receiptContent = `
SACHABROKER - PAYMENT RECEIPT
==============================

Transaction ID: ${txnId}
Date: ${date}

Customer Details:
Name: ${currentUser?.name || 'N/A'}
Email: ${currentUser?.email || 'N/A'}
Phone: ${currentUser?.phone || 'N/A'}

Payment Details:
Plan: ${plan}
Amount: ${amount}
Status: Successful

Property: ${currentPropertyDetail?.title || 'N/A'}
Location: ${currentPropertyDetail?.locality || currentPropertyDetail?.location || 'N/A'}

==============================
Thank you for using Sachabroker!
Website: https://sachabroker.com
Support: support@sachabroker.com
==============================
    `.trim();
    
    // Create and download file
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sachabroker_Receipt_${txnId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    if (typeof showNotification === 'function') {
        showNotification('Receipt downloaded!', 'success');
    }
}

// Email receipt
function emailReceipt() {
    const txnId = document.getElementById('transactionId').textContent;
    
    // In production, this would call an API to send email
    sendReceiptEmail(txnId, selectedPlan, selectedPlan === 'single' ? 299 : 999);
}

// Check if contact is unlocked
function isContactUnlocked(propertyId) {
    if (!currentUser) return false;
    
    // Check if user has unlimited plan
    if (hasUnlimitedPlan()) {
        // Check if this property was already unlocked
        const unlocked = JSON.parse(localStorage.getItem(`unlocked_contacts_${currentUser.id}`) || '[]');
        return unlocked.includes(propertyId);
    }
    
    const unlocked = JSON.parse(localStorage.getItem(`unlocked_contacts_${currentUser.id}`) || '[]');
    return unlocked.includes(propertyId);
}

// Save contact unlock
function saveContactUnlock(propertyId) {
    if (!currentUser) return;
    
    const unlocked = JSON.parse(localStorage.getItem(`unlocked_contacts_${currentUser.id}`) || '[]');
    if (!unlocked.includes(propertyId)) {
        unlocked.push(propertyId);
        localStorage.setItem(`unlocked_contacts_${currentUser.id}`, JSON.stringify(unlocked));
    }
}

// Save properties
function saveProperties() {
    localStorage.setItem('properties', JSON.stringify(allProperties));
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('currentUser_encrypted');
    window.location.href = 'index.html';
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const detailModal = document.getElementById('propertyDetailModal');
    const unlockModal = document.getElementById('contactUnlockModal');
    const successModal = document.getElementById('paymentSuccessModal');
    
    if (event.target === detailModal) closePropertyDetailModal();
    if (event.target === unlockModal) closeContactUnlockModal();
    if (event.target === successModal) closePaymentSuccessModal();
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePropertyDetailModal();
        closeContactUnlockModal();
        closePaymentSuccessModal();
    }
    
    if (document.getElementById('propertyDetailModal').style.display === 'block') {
        if (e.key === 'ArrowRight') nextGalleryImage();
        if (e.key === 'ArrowLeft') prevGalleryImage();
    }
});
