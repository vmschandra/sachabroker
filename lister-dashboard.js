// Lister Dashboard JavaScript
// Property listing flow with multi-step form

// State variables
let currentPropertyStep = 1;
const totalPropertySteps = 6;
let uploadedImages = [];
let propertyToDelete = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and is a lister
    const storedUser = localStorage.getItem('currentUser_encrypted');
    if (!storedUser) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize UI
    initializeDashboard();
    setupEventListeners();
    loadMyProperties();
});

// Initialize Dashboard
function initializeDashboard() {
    // Update UI for logged in user
    if (typeof updateUIForLoggedInUser === 'function') {
        updateUIForLoggedInUser();
    }
    
    // Update stats
    updateDashboardStats();
    
    // Pre-fill contact info from user profile
    prefillContactInfo();
}

// Setup Event Listeners
function setupEventListeners() {
    // Add Property button
    document.getElementById('addPropertyBtn')?.addEventListener('click', showAddPropertyModal);
    
    // Form navigation
    document.getElementById('propertyNextBtn')?.addEventListener('click', nextPropertyStep);
    document.getElementById('propertyPrevBtn')?.addEventListener('click', prevPropertyStep);
    
    // Form submission
    document.getElementById('addPropertyForm')?.addEventListener('submit', handlePropertySubmission);
    
    // Listing type change (rent/sale)
    document.querySelectorAll('input[name="listingType"]').forEach(input => {
        input.addEventListener('change', handleListingTypeChange);
    });
    
    // Property category change
    document.querySelectorAll('input[name="propertyCategory"]').forEach(input => {
        input.addEventListener('change', handlePropertyCategoryChange);
    });
    
    // Pincode auto-detect
    document.getElementById('pincode')?.addEventListener('input', handlePincodeInput);
    
    // Character count
    document.getElementById('propertyTitle')?.addEventListener('input', function() {
        document.getElementById('titleCharCount').textContent = this.value.length;
    });
    
    document.getElementById('description')?.addEventListener('input', function() {
        document.getElementById('descCharCount').textContent = this.value.length;
    });
    
    // Contact visibility change
    document.querySelectorAll('input[name="contactVisibility"]').forEach(input => {
        input.addEventListener('change', handleContactVisibilityChange);
    });
    
    // Image upload
    const uploadZone = document.getElementById('uploadZone');
    const propertyImages = document.getElementById('propertyImages');
    
    uploadZone?.addEventListener('click', () => propertyImages?.click());
    uploadZone?.addEventListener('dragover', handleDragOver);
    uploadZone?.addEventListener('dragleave', handleDragLeave);
    uploadZone?.addEventListener('drop', handleDrop);
    propertyImages?.addEventListener('change', handleImageSelect);
    
    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', handleFilterTabClick);
    });
    
    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
}

// Show Add Property Modal
function showAddPropertyModal() {
    const modal = document.getElementById('addPropertyModal');
    modal.style.display = 'block';
    currentPropertyStep = 1;
    updatePropertyStep();
    
    // Reset form
    document.getElementById('addPropertyForm')?.reset();
    uploadedImages = [];
    updateUploadedPhotosDisplay();
    resetImageUrlInputs();
}

// Close Add Property Modal
function closeAddPropertyModal() {
    const modal = document.getElementById('addPropertyModal');
    modal.style.display = 'none';
}

// Update Property Step
function updatePropertyStep() {
    // Update step visibility
    document.querySelectorAll('.property-step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector(`.property-step[data-step="${currentPropertyStep}"]`)?.classList.add('active');
    
    // Update progress indicators
    document.querySelectorAll('.progress-step').forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.remove('active', 'completed');
        if (stepNum === currentPropertyStep) {
            step.classList.add('active');
        } else if (stepNum < currentPropertyStep) {
            step.classList.add('completed');
        }
    });
    
    // Update navigation buttons
    const prevBtn = document.getElementById('propertyPrevBtn');
    const nextBtn = document.getElementById('propertyNextBtn');
    const submitBtn = document.getElementById('submitPropertyBtn');
    
    prevBtn.style.display = currentPropertyStep === 1 ? 'none' : 'block';
    
    if (currentPropertyStep === totalPropertySteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

// Validate Current Step
function validatePropertyStep() {
    const step = currentPropertyStep;
    
    switch(step) {
        case 1:
            // Validate listing type and category
            const listingType = document.querySelector('input[name="listingType"]:checked');
            const propertyCategory = document.querySelector('input[name="propertyCategory"]:checked');
            const propertyTitle = document.getElementById('propertyTitle').value.trim();
            
            if (!listingType) {
                showNotification('Please select listing type (Rent/Sale)', 'error');
                return false;
            }
            if (!propertyCategory) {
                showNotification('Please select property category', 'error');
                return false;
            }
            if (!propertyTitle || propertyTitle.length < 10) {
                showNotification('Please enter a property title (min 10 characters)', 'error');
                return false;
            }
            return true;
            
        case 2:
            // Validate location
            const pincode = document.getElementById('pincode').value.trim();
            const city = document.getElementById('city').value.trim();
            const locality = document.getElementById('locality').value.trim();
            const fullAddress = document.getElementById('fullAddress').value.trim();
            
            if (!pincode || !/^\d{6}$/.test(pincode)) {
                showNotification('Please enter a valid 6-digit pincode', 'error');
                return false;
            }
            if (!city) {
                showNotification('Please enter city name', 'error');
                return false;
            }
            if (!locality) {
                showNotification('Please enter locality/area', 'error');
                return false;
            }
            if (!fullAddress) {
                showNotification('Please enter full address', 'error');
                return false;
            }
            return true;
            
        case 3:
            // Validate property details
            const price = document.getElementById('price').value;
            const builtUpArea = document.getElementById('builtUpArea').value;
            const furnishing = document.getElementById('furnishing').value;
            const availability = document.getElementById('availability').value;
            
            if (!price || price <= 0) {
                showNotification('Please enter a valid price', 'error');
                return false;
            }
            if (!builtUpArea || builtUpArea <= 0) {
                showNotification('Please enter built-up area', 'error');
                return false;
            }
            
            // Check bedrooms/bathrooms for residential properties
            const category = document.querySelector('input[name="propertyCategory"]:checked')?.value;
            if (category && !['plot', 'commercial'].includes(category)) {
                const bedrooms = document.getElementById('bedrooms').value;
                const bathrooms = document.getElementById('bathrooms').value;
                if (!bedrooms) {
                    showNotification('Please select number of bedrooms', 'error');
                    return false;
                }
                if (!bathrooms) {
                    showNotification('Please select number of bathrooms', 'error');
                    return false;
                }
            }
            
            if (!furnishing) {
                showNotification('Please select furnishing status', 'error');
                return false;
            }
            if (!availability) {
                showNotification('Please select availability', 'error');
                return false;
            }
            
            const description = document.getElementById('description').value.trim();
            if (!description || description.length < 50) {
                showNotification('Please enter a detailed description (min 50 characters)', 'error');
                return false;
            }
            return true;
            
        case 4:
            // Validate photos - at least one image required
            const imageUrls = getImageUrls();
            if (uploadedImages.length === 0 && imageUrls.length === 0) {
                showNotification('Please add at least one property photo', 'error');
                return false;
            }
            return true;
            
        case 5:
            // Amenities - optional, no validation needed
            return true;
            
        case 6:
            // Validate contact preferences
            const contactName = document.getElementById('contactName').value.trim();
            const contactPhone = document.getElementById('contactPhone').value.trim();
            const contactVisibility = document.querySelector('input[name="contactVisibility"]:checked');
            const termsAgreed = document.getElementById('termsAgreed').checked;
            
            if (!contactName) {
                showNotification('Please enter contact name', 'error');
                return false;
            }
            if (!contactPhone || !/^[0-9+\s-]{10,15}$/.test(contactPhone)) {
                showNotification('Please enter a valid phone number', 'error');
                return false;
            }
            if (!contactVisibility) {
                showNotification('Please select contact visibility option', 'error');
                return false;
            }
            
            // Check payment fee if paid option selected
            if (contactVisibility.value === 'paid') {
                const contactFee = document.getElementById('contactFee').value;
                if (!contactFee || contactFee < 1 || contactFee > 999) {
                    showNotification('Please enter a valid contact fee (₹1 - ₹999)', 'error');
                    return false;
                }
            }
            
            if (!termsAgreed) {
                showNotification('Please agree to the terms and conditions', 'error');
                return false;
            }
            return true;
    }
    
    return true;
}

// Next Step
function nextPropertyStep() {
    if (validatePropertyStep()) {
        if (currentPropertyStep < totalPropertySteps) {
            currentPropertyStep++;
            updatePropertyStep();
            // Scroll to top of modal
            document.querySelector('.add-property-content')?.scrollTo(0, 0);
        }
    }
}

// Previous Step
function prevPropertyStep() {
    if (currentPropertyStep > 1) {
        currentPropertyStep--;
        updatePropertyStep();
        document.querySelector('.add-property-content')?.scrollTo(0, 0);
    }
}

// Handle Listing Type Change (Rent/Sale)
function handleListingTypeChange(e) {
    const value = e.target.value;
    const rentPeriodGroup = document.getElementById('rentPeriodGroup');
    const priceLabel = document.getElementById('priceLabel');
    
    if (value === 'rent') {
        rentPeriodGroup.style.display = 'block';
        priceLabel.textContent = 'Enter monthly rent';
    } else {
        rentPeriodGroup.style.display = 'none';
        priceLabel.textContent = 'Enter total price';
    }
}

// Handle Property Category Change
function handlePropertyCategoryChange(e) {
    const value = e.target.value;
    const bedroomBathroomRow = document.getElementById('bedroomBathroomRow');
    
    // Hide bedroom/bathroom for plot and commercial
    if (value === 'plot' || value === 'commercial') {
        bedroomBathroomRow.style.display = 'none';
        // Remove required attribute
        document.getElementById('bedrooms').removeAttribute('required');
        document.getElementById('bathrooms').removeAttribute('required');
    } else {
        bedroomBathroomRow.style.display = 'grid';
        document.getElementById('bedrooms').setAttribute('required', 'required');
        document.getElementById('bathrooms').setAttribute('required', 'required');
    }
}

// Handle Contact Visibility Change
function handleContactVisibilityChange(e) {
    const value = e.target.value;
    const paymentSettings = document.getElementById('paymentSettings');
    
    if (value === 'paid') {
        paymentSettings.style.display = 'block';
        document.getElementById('contactFee').setAttribute('required', 'required');
    } else {
        paymentSettings.style.display = 'none';
        document.getElementById('contactFee').removeAttribute('required');
    }
}

// Handle Pincode Input - Auto-detect location
async function handlePincodeInput(e) {
    const pincode = e.target.value.trim();
    const pincodeInfo = document.getElementById('pincodeInfo');
    const cityInput = document.getElementById('city');
    const stateInput = document.getElementById('state');
    
    if (pincode.length === 6 && /^\d{6}$/.test(pincode)) {
        pincodeInfo.textContent = 'Looking up location...';
        pincodeInfo.classList.remove('error');
        
        try {
            // Using Indian Postal API
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();
            
            if (data[0].Status === 'Success' && data[0].PostOffice?.length > 0) {
                const postOffice = data[0].PostOffice[0];
                cityInput.value = postOffice.District;
                stateInput.value = postOffice.State;
                pincodeInfo.textContent = `📍 ${postOffice.Name}, ${postOffice.District}`;
                pincodeInfo.classList.remove('error');
                
                // Make fields editable now
                cityInput.removeAttribute('readonly');
                stateInput.removeAttribute('readonly');
            } else {
                throw new Error('Invalid pincode');
            }
        } catch (error) {
            pincodeInfo.textContent = 'Could not auto-detect. Please enter manually.';
            pincodeInfo.classList.add('error');
            cityInput.removeAttribute('readonly');
            stateInput.removeAttribute('readonly');
            cityInput.value = '';
            stateInput.value = '';
        }
    } else {
        pincodeInfo.textContent = '';
        cityInput.value = '';
        stateInput.value = '';
    }
}

// Image Upload Handlers
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    processImages(files);
}

function handleImageSelect(e) {
    const files = e.target.files;
    processImages(files);
}

function processImages(files) {
    const maxFiles = 10;
    const maxSize = 7 * 1024 * 1024; // 7MB
    const allowedTypes = ['image/jpeg', 'image/png'];
    
    for (let file of files) {
        if (uploadedImages.length >= maxFiles) {
            showNotification(`Maximum ${maxFiles} images allowed`, 'error');
            break;
        }
        
        if (!allowedTypes.includes(file.type)) {
            showNotification(`${file.name}: Only JPG and PNG images are allowed`, 'error');
            continue;
        }
        
        if (file.size > maxSize) {
            showNotification(`${file.name}: Image must be less than 7MB`, 'error');
            continue;
        }
        
        // Read and store image
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImages.push({
                name: file.name,
                data: e.target.result,
                type: file.type
            });
            updateUploadedPhotosDisplay();
        };
        reader.readAsDataURL(file);
    }
}

function updateUploadedPhotosDisplay() {
    const container = document.getElementById('uploadedPhotos');
    container.innerHTML = '';
    
    uploadedImages.forEach((img, index) => {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'uploaded-photo';
        photoDiv.innerHTML = `
            <img src="${img.data}" alt="${img.name}">
            <button type="button" class="remove-photo" onclick="removeUploadedPhoto(${index})">
                <i class="fas fa-times"></i>
            </button>
            ${index === 0 ? '<span class="cover-badge">Cover</span>' : ''}
        `;
        container.appendChild(photoDiv);
    });
}

function removeUploadedPhoto(index) {
    uploadedImages.splice(index, 1);
    updateUploadedPhotosDisplay();
}

// Image URL Input Handlers
function addImageUrlInput() {
    const container = document.getElementById('imageUrlInputs');
    const inputs = container.querySelectorAll('.image-url-row');
    
    if (inputs.length >= 10) {
        showNotification('Maximum 10 image URLs allowed', 'error');
        return;
    }
    
    const newRow = document.createElement('div');
    newRow.className = 'image-url-row';
    newRow.innerHTML = `
        <input type="url" class="imageUrl" placeholder="https://example.com/image.jpg">
        <button type="button" class="btn btn-small btn-remove-url" onclick="removeImageUrlInput(this)">
            <i class="fas fa-minus"></i>
        </button>
    `;
    container.appendChild(newRow);
}

function removeImageUrlInput(button) {
    button.closest('.image-url-row').remove();
}

function resetImageUrlInputs() {
    const container = document.getElementById('imageUrlInputs');
    container.innerHTML = `
        <div class="image-url-row">
            <input type="url" class="imageUrl" placeholder="https://example.com/image1.jpg">
            <button type="button" class="btn btn-small btn-add-url" onclick="addImageUrlInput()">
                <i class="fas fa-plus"></i>
            </button>
        </div>
    `;
}

function getImageUrls() {
    const inputs = document.querySelectorAll('.imageUrl');
    const urls = [];
    inputs.forEach(input => {
        if (input.value.trim()) {
            urls.push(input.value.trim());
        }
    });
    return urls;
}

// Pre-fill contact info from user profile
function prefillContactInfo() {
    if (currentUser) {
        const contactName = document.getElementById('contactName');
        const contactPhone = document.getElementById('contactPhone');
        const contactEmail = document.getElementById('contactEmail');
        
        if (contactName && currentUser.name) {
            contactName.value = currentUser.name;
        }
        if (contactPhone && currentUser.phone) {
            contactPhone.value = currentUser.phone;
        }
        if (contactEmail && currentUser.email) {
            contactEmail.value = currentUser.email;
        }
    }
}

// Handle Property Submission
function handlePropertySubmission(e) {
    e.preventDefault();
    
    if (!validatePropertyStep()) {
        return;
    }
    
    // Collect all form data
    const formData = collectPropertyFormData();
    
    // Save property
    saveProperty(formData);
}

// Collect Property Form Data
function collectPropertyFormData() {
    const listingType = document.querySelector('input[name="listingType"]:checked')?.value;
    const propertyCategory = document.querySelector('input[name="propertyCategory"]:checked')?.value;
    
    // Collect amenities
    const amenities = [];
    document.querySelectorAll('input[name="amenities"]:checked').forEach(cb => {
        amenities.push(cb.value);
    });
    
    // Collect nearby
    const nearby = [];
    document.querySelectorAll('input[name="nearby"]:checked').forEach(cb => {
        nearby.push(cb.value);
    });
    
    // Collect contact times
    const contactTimes = [];
    document.querySelectorAll('input[name="contactTime"]:checked').forEach(cb => {
        contactTimes.push(cb.value);
    });
    
    // Combine uploaded images and URLs
    const imageUrls = getImageUrls();
    const allImages = [
        ...uploadedImages.map(img => img.data),
        ...imageUrls
    ];
    
    return {
        id: Date.now(),
        ownerId: currentUser?.id,
        ownerName: currentUser?.name,
        
        // Basic Info
        listingType: listingType,
        propertyCategory: propertyCategory,
        title: document.getElementById('propertyTitle').value.trim(),
        
        // Location
        pincode: document.getElementById('pincode').value.trim(),
        city: document.getElementById('city').value.trim(),
        state: document.getElementById('state').value.trim(),
        locality: document.getElementById('locality').value.trim(),
        fullAddress: document.getElementById('fullAddress').value.trim(),
        landmark: document.getElementById('landmark').value.trim(),
        location: `${document.getElementById('locality').value.trim()}, ${document.getElementById('city').value.trim()}`,
        
        // Details
        price: parseFloat(document.getElementById('price').value),
        rentPeriod: document.getElementById('rentPeriod')?.value || 'monthly',
        builtUpArea: parseInt(document.getElementById('builtUpArea').value),
        carpetArea: parseInt(document.getElementById('carpetArea').value) || null,
        bedrooms: parseInt(document.getElementById('bedrooms').value) || 0,
        bathrooms: parseInt(document.getElementById('bathrooms').value) || 0,
        balconies: parseInt(document.getElementById('balconies').value) || 0,
        floorNumber: document.getElementById('floorNumber').value || null,
        totalFloors: parseInt(document.getElementById('totalFloors').value) || null,
        propertyAge: document.getElementById('propertyAge').value || null,
        furnishing: document.getElementById('furnishing').value,
        facing: document.getElementById('facing').value || null,
        availability: document.getElementById('availability').value,
        description: document.getElementById('description').value.trim(),
        
        // Images
        images: allImages,
        image: allImages[0] || 'https://via.placeholder.com/400x300?text=No+Image',
        
        // Amenities
        amenities: amenities,
        nearby: nearby,
        
        // Contact
        contactName: document.getElementById('contactName').value.trim(),
        contactPhone: document.getElementById('contactPhone').value.trim(),
        contactEmail: document.getElementById('contactEmail').value.trim(),
        contactVisibility: document.querySelector('input[name="contactVisibility"]:checked')?.value,
        contactFee: parseFloat(document.getElementById('contactFee').value) || 0,
        contactTimes: contactTimes,
        
        // Meta
        status: 'active',
        views: 0,
        inquiries: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        
        // Legacy fields for compatibility
        type: propertyCategory,
        area: parseInt(document.getElementById('builtUpArea').value),
    };
}

// Save Property
function saveProperty(propertyData) {
    // Get existing properties
    let properties = JSON.parse(localStorage.getItem('properties') || '[]');
    
    // Add new property
    properties.unshift(propertyData);
    
    // Save to localStorage
    localStorage.setItem('properties', JSON.stringify(properties));
    
    // Close modal
    closeAddPropertyModal();
    
    // Show success message
    showNotification('🎉 Property listed successfully!', 'success');
    
    // Refresh dashboard
    loadMyProperties();
    updateDashboardStats();
}

// Load My Properties
function loadMyProperties() {
    const grid = document.getElementById('myPropertiesGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!currentUser) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    const allProperties = JSON.parse(localStorage.getItem('properties') || '[]');
    const myProperties = allProperties.filter(p => p.ownerId === currentUser.id);
    
    if (myProperties.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    grid.innerHTML = myProperties.map(property => createPropertyCard(property)).join('');
}

// Create Property Card HTML
function createPropertyCard(property) {
    const statusClass = property.status || 'active';
    const listingBadge = property.listingType === 'rent' ? 'For Rent' : 'For Sale';
    const priceDisplay = property.listingType === 'rent' 
        ? `₹${formatPrice(property.price)}/mo` 
        : `₹${formatPrice(property.price)}`;
    
    return `
        <div class="property-card-dashboard" data-id="${property.id}">
            <div class="property-image">
                <img src="${property.image || property.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}" 
                     alt="${property.title}"
                     onerror="this.src='https://via.placeholder.com/400x300?text=Image+Error'">
                <span class="property-status-badge ${statusClass}">${statusClass}</span>
                <span class="property-type-badge">${listingBadge}</span>
            </div>
            <div class="property-details">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.locality || property.location || 'Location not specified'}
                </p>
                <div class="property-price">${priceDisplay}</div>
                <div class="property-meta">
                    ${property.bedrooms ? `<span><i class="fas fa-bed"></i> ${property.bedrooms} Bed</span>` : ''}
                    ${property.bathrooms ? `<span><i class="fas fa-bath"></i> ${property.bathrooms} Bath</span>` : ''}
                    <span><i class="fas fa-vector-square"></i> ${property.builtUpArea || property.area} sqft</span>
                </div>
                <div class="property-stats">
                    <span><i class="fas fa-eye"></i> ${property.views || 0} views</span>
                    <span><i class="fas fa-phone"></i> ${property.inquiries || 0} inquiries</span>
                </div>
                <div class="property-actions">
                    <button class="btn-view" onclick="viewProperty(${property.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn-edit" onclick="editProperty(${property.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="confirmDeleteProperty(${property.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
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
        return (price / 1000).toFixed(1) + 'K';
    }
    return price.toLocaleString('en-IN');
}

// Update Dashboard Stats
function updateDashboardStats() {
    if (!currentUser) return;
    
    const allProperties = JSON.parse(localStorage.getItem('properties') || '[]');
    const myProperties = allProperties.filter(p => p.ownerId === currentUser.id);
    
    document.getElementById('totalListings').textContent = myProperties.length;
    document.getElementById('activeListings').textContent = myProperties.filter(p => p.status === 'active').length;
    document.getElementById('pendingListings').textContent = myProperties.filter(p => p.status === 'pending').length;
    
    const totalViews = myProperties.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalInquiries = myProperties.reduce((sum, p) => sum + (p.inquiries || 0), 0);
    
    document.getElementById('totalViews').textContent = totalViews;
    document.getElementById('totalInquiries').textContent = totalInquiries;
}

// Filter Tab Click
function handleFilterTabClick(e) {
    // Update active state
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    e.target.classList.add('active');
    
    const filter = e.target.dataset.filter;
    filterMyProperties(filter);
}

// Filter My Properties
function filterMyProperties(filter) {
    const grid = document.getElementById('myPropertiesGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!currentUser) return;
    
    const allProperties = JSON.parse(localStorage.getItem('properties') || '[]');
    let myProperties = allProperties.filter(p => p.ownerId === currentUser.id);
    
    // Apply filter
    switch(filter) {
        case 'active':
            myProperties = myProperties.filter(p => p.status === 'active');
            break;
        case 'pending':
            myProperties = myProperties.filter(p => p.status === 'pending');
            break;
        case 'sold':
            myProperties = myProperties.filter(p => p.status === 'sold' || p.status === 'rented');
            break;
    }
    
    if (myProperties.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        emptyState.querySelector('h3').textContent = `No ${filter === 'all' ? '' : filter} properties`;
    } else {
        emptyState.style.display = 'none';
        grid.innerHTML = myProperties.map(property => createPropertyCard(property)).join('');
    }
}

// View Property
function viewProperty(propertyId) {
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    const property = properties.find(p => p.id === propertyId);
    
    if (property && typeof showPropertyDetails === 'function') {
        showPropertyDetails(property);
    } else {
        // Fallback: show in modal
        const modal = document.getElementById('propertyModal');
        const modalBody = document.getElementById('modalBody');
        
        if (property && modal && modalBody) {
            modalBody.innerHTML = generatePropertyDetailHTML(property);
            modal.style.display = 'block';
        }
    }
}

// Generate Property Detail HTML
function generatePropertyDetailHTML(property) {
    const priceDisplay = property.listingType === 'rent' 
        ? `₹${formatPrice(property.price)}/month` 
        : `₹${formatPrice(property.price)}`;
    
    return `
        <div class="property-detail">
            <div class="property-images">
                <img src="${property.image || property.images?.[0] || 'https://via.placeholder.com/600x400?text=No+Image'}" 
                     alt="${property.title}">
            </div>
            <h2>${property.title}</h2>
            <p class="property-location"><i class="fas fa-map-marker-alt"></i> ${property.fullAddress || property.location}</p>
            <div class="property-price" style="font-size: 1.5rem; color: var(--primary-color); margin: 1rem 0;">
                ${priceDisplay}
            </div>
            <div class="property-info">
                ${property.bedrooms ? `<span><i class="fas fa-bed"></i> ${property.bedrooms} Bedrooms</span>` : ''}
                ${property.bathrooms ? `<span><i class="fas fa-bath"></i> ${property.bathrooms} Bathrooms</span>` : ''}
                <span><i class="fas fa-vector-square"></i> ${property.builtUpArea || property.area} sqft</span>
            </div>
            <div class="property-description" style="margin-top: 1rem;">
                <h4>Description</h4>
                <p>${property.description}</p>
            </div>
            ${property.amenities?.length > 0 ? `
                <div class="property-amenities" style="margin-top: 1rem;">
                    <h4>Amenities</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${property.amenities.map(a => `<span style="background: #f0f0f0; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.9rem;">${a}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// Edit Property
function editProperty(propertyId) {
    showNotification('Edit functionality coming soon!', 'error');
    // TODO: Implement edit functionality
}

// Confirm Delete Property
function confirmDeleteProperty(propertyId) {
    propertyToDelete = propertyId;
    const modal = document.getElementById('deleteConfirmModal');
    modal.style.display = 'block';
    
    // Setup confirm button
    document.getElementById('confirmDeleteBtn').onclick = deleteProperty;
}

// Close Delete Confirm Modal
function closeDeleteConfirmModal() {
    const modal = document.getElementById('deleteConfirmModal');
    modal.style.display = 'none';
    propertyToDelete = null;
}

// Delete Property
function deleteProperty() {
    if (!propertyToDelete) return;
    
    let properties = JSON.parse(localStorage.getItem('properties') || '[]');
    properties = properties.filter(p => p.id !== propertyToDelete);
    localStorage.setItem('properties', JSON.stringify(properties));
    
    closeDeleteConfirmModal();
    showNotification('Property deleted successfully', 'success');
    
    loadMyProperties();
    updateDashboardStats();
}

// Close Edit Property Modal
function closeEditPropertyModal() {
    const modal = document.getElementById('editPropertyModal');
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const addModal = document.getElementById('addPropertyModal');
    const deleteModal = document.getElementById('deleteConfirmModal');
    const propertyModal = document.getElementById('propertyModal');
    
    if (event.target === addModal) closeAddPropertyModal();
    if (event.target === deleteModal) closeDeleteConfirmModal();
    if (event.target === propertyModal) {
        propertyModal.style.display = 'none';
    }
});

// Handle Logout (if not defined in main script)
function handleLogout() {
    localStorage.removeItem('currentUser_encrypted');
    window.location.href = 'index.html';
}
