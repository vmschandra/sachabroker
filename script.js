// Property Data Storage
let properties = [];
let currentUser = null;
let users = [];

// ========== ENCRYPTION UTILITIES ==========

// Hash password using Web Crypto API (SHA-256)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Verify password against hash
async function verifyPassword(password, hashedPassword) {
    const inputHash = await hashPassword(password);
    return inputHash === hashedPassword;
}

// Encrypt sensitive data (for storage)
function encryptData(data, key = 'honestbroker-secret-key-2026') {
    try {
        // Simple XOR encryption for localStorage (better than plain text)
        // Note: For production, use a proper encryption library
        const jsonStr = JSON.stringify(data);
        let encrypted = '';
        for (let i = 0; i < jsonStr.length; i++) {
            encrypted += String.fromCharCode(jsonStr.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return btoa(encrypted); // Base64 encode
    } catch (e) {
        console.error('Encryption error:', e);
        return null;
    }
}

// Decrypt sensitive data
function decryptData(encryptedData, key = 'honestbroker-secret-key-2026') {
    try {
        const encrypted = atob(encryptedData); // Base64 decode
        let decrypted = '';
        for (let i = 0; i < encrypted.length; i++) {
            decrypted += String.fromCharCode(encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return JSON.parse(decrypted);
    } catch (e) {
        console.error('Decryption error:', e);
        return null;
    }
}

// ========== END ENCRYPTION UTILITIES ==========

// Sample Properties for Demo
const sampleProperties = [
    {
        id: 1,
        title: "Modern Family House",
        type: "house",
        price: 450000,
        location: "Los Angeles, CA",
        bedrooms: 4,
        bathrooms: 3,
        area: 2500,
        description: "Beautiful modern family home with spacious rooms, updated kitchen, and large backyard. Perfect for families looking for comfort and style.",
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500",
        contactEmail: "seller1@example.com",
        contactPhone: "+1 555-0101"
    },
    {
        id: 2,
        title: "Downtown Luxury Apartment",
        type: "apartment",
        price: 350000,
        location: "New York, NY",
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        description: "Stunning luxury apartment in the heart of downtown. Features modern amenities, gym access, and breathtaking city views.",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500",
        contactEmail: "seller2@example.com",
        contactPhone: "+1 555-0102"
    },
    {
        id: 3,
        title: "Beachfront Villa",
        type: "villa",
        price: 1250000,
        location: "Miami, FL",
        bedrooms: 5,
        bathrooms: 4,
        area: 4000,
        description: "Exclusive beachfront villa with private pool, ocean views, and direct beach access. Ultimate luxury living experience.",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500",
        contactEmail: "seller3@example.com",
        contactPhone: "+1 555-0103"
    },
    {
        id: 4,
        title: "Cozy Studio Condo",
        type: "condo",
        price: 175000,
        location: "Austin, TX",
        bedrooms: 1,
        bathrooms: 1,
        area: 650,
        description: "Perfect starter home or investment property. Cozy studio with modern finishes in a great neighborhood.",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
        contactEmail: "seller4@example.com",
        contactPhone: "+1 555-0104"
    },
    {
        id: 5,
        title: "Spacious Suburban Home",
        type: "house",
        price: 525000,
        location: "Seattle, WA",
        bedrooms: 5,
        bathrooms: 3,
        area: 3200,
        description: "Large family home in quiet suburban area. Features include home office, finished basement, and two-car garage.",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500",
        contactEmail: "seller5@example.com",
        contactPhone: "+1 555-0105"
    },
    {
        id: 6,
        title: "Commercial Land Plot",
        type: "land",
        price: 280000,
        location: "Phoenix, AZ",
        bedrooms: 0,
        bathrooms: 0,
        area: 5000,
        description: "Prime commercial land in developing area. Perfect for building your dream business or investment opportunity.",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500",
        contactEmail: "seller6@example.com",
        contactPhone: "+1 555-0106"
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Load users from localStorage (encrypted)
    const storedUsers = localStorage.getItem('users_encrypted');
    if (storedUsers) {
        const decrypted = decryptData(storedUsers);
        if (decrypted) {
            users = decrypted;
        }
    }
    
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser_encrypted');
    if (storedUser) {
        const decrypted = decryptData(storedUser);
        if (decrypted) {
            currentUser = decrypted;
            updateUIForLoggedInUser();
        }
    }
    
    // Load properties from localStorage or use sample data
    const storedProperties = localStorage.getItem('properties');
    if (storedProperties) {
        properties = JSON.parse(storedProperties);
    } else {
        properties = [...sampleProperties];
        saveProperties();
    }
    
    displayProperties(properties);
    setupEventListeners();
});

// Save properties to localStorage
function saveProperties() {
    localStorage.setItem('properties', JSON.stringify(properties));
}

// Setup Event Listeners
function setupEventListeners() {
    // Property form submission
    document.getElementById('propertyForm').addEventListener('submit', handleFormSubmit);
    
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', filterProperties);
    
    // Filter dropdowns
    document.getElementById('typeFilter').addEventListener('change', filterProperties);
    document.getElementById('priceFilter').addEventListener('change', filterProperties);
    
    // Clear filters button
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
    
    // Modal close
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('propertyModal');
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Auth buttons
    document.getElementById('loginBtn')?.addEventListener('click', () => {
        document.getElementById('loginModal').style.display = 'block';
    });
    
    document.getElementById('signupBtn')?.addEventListener('click', () => {
        document.getElementById('signupModal').style.display = 'block';
    });
    
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
    
    document.getElementById('myPropertiesLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        showMyProperties();
    });
    
    // Auth forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Check if user is logged in
    if (!currentUser) {
        showNotification('Please login to list a property', 'error');
        document.getElementById('loginModal').style.display = 'block';
        return;
    }
    
    const newProperty = {
        id: Date.now(),
        title: document.getElementById('propertyTitle').value,
        type: document.getElementById('propertyType').value,
        price: parseFloat(document.getElementById('propertyPrice').value),
        location: document.getElementById('propertyLocation').value,
        bedrooms: parseInt(document.getElementById('propertyBedrooms').value),
        bathrooms: parseInt(document.getElementById('propertyBathrooms').value),
        area: parseInt(document.getElementById('propertyArea').value),
        description: document.getElementById('propertyDescription').value,
        image: document.getElementById('propertyImage').value,
        contactEmail: document.getElementById('contactEmail').value,
        contactPhone: document.getElementById('contactPhone').value,
        ownerId: currentUser.id,
        ownerName: currentUser.name
    };
    
    properties.unshift(newProperty); // Add to beginning of array
    saveProperties();
    displayProperties(properties);
    
    // Reset form
    e.target.reset();
    
    // Show success message
    showNotification('Property listed successfully!', 'success');
    
    // Scroll to properties section
    document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
}

// Display properties
function displayProperties(propertiesToDisplay) {
    const grid = document.getElementById('propertiesGrid');
    const noResults = document.getElementById('noResults');
    
    if (propertiesToDisplay.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    grid.innerHTML = propertiesToDisplay.map(property => {
        const isOwner = currentUser && property.ownerId === currentUser.id;
        const ownerBadge = property.ownerName ? `<span class="owner-badge"><i class="fas fa-user"></i> Listed by: ${property.ownerName}</span>` : '';
        
        return `
        <div class="property-card" onclick="showPropertyDetails(${property.id})">
            <img src="${property.image}" alt="${property.title}" class="property-image" 
                 onerror="this.src='https://via.placeholder.com/400x300?text=Property+Image'">
            ${isOwner ? '<div class="my-property-badge"><i class="fas fa-crown"></i> Your Property</div>' : ''}
            <div class="property-content">
                <div class="property-header">
                    <h3 class="property-title">${property.title}</h3>
                </div>
                <span class="property-type">${property.type}</span>
                <div class="property-price">$${formatNumber(property.price)}</div>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.location}
                </div>
                ${ownerBadge}
                <div class="property-details">
                    <div class="property-detail">
                        <i class="fas fa-bed"></i>
                        <span>${property.bedrooms} Beds</span>
                    </div>
                    <div class="property-detail">
                        <i class="fas fa-bath"></i>
                        <span>${property.bathrooms} Baths</span>
                    </div>
                    <div class="property-detail">
                        <i class="fas fa-ruler-combined"></i>
                        <span>${formatNumber(property.area)} sq ft</span>
                    </div>
                </div>
                <p class="property-description">${property.description}</p>
                <div class="property-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); showPropertyDetails(${property.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    ${isOwner ? `<button class="btn btn-clear" onclick="event.stopPropagation(); deleteProperty(${property.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>` : ''}
                </div>
            </div>
        </div>
    `;
    }).join('');
}

// Filter properties
function filterProperties() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    
    let filtered = properties.filter(property => {
        // Search filter
        const matchesSearch = property.title.toLowerCase().includes(searchTerm) ||
                            property.description.toLowerCase().includes(searchTerm) ||
                            property.location.toLowerCase().includes(searchTerm);
        
        // Type filter
        const matchesType = typeFilter === 'all' || property.type === typeFilter;
        
        // Price filter
        let matchesPrice = true;
        if (priceFilter !== 'all') {
            const [min, max] = priceFilter.split('-').map(Number);
            matchesPrice = property.price >= min && property.price <= max;
        }
        
        return matchesSearch && matchesType && matchesPrice;
    });
    
    displayProperties(filtered);
}

// Clear filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('typeFilter').value = 'all';
    document.getElementById('priceFilter').value = 'all';
    displayProperties(properties);
}

// Show property details in modal
function showPropertyDetails(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <img src="${property.image}" alt="${property.title}" class="modal-property-image"
             onerror="this.src='https://via.placeholder.com/800x400?text=Property+Image'">
        <div class="modal-property-content">
            <div class="modal-property-header">
                <h2 class="modal-property-title">${property.title}</h2>
                <span class="property-type">${property.type}</span>
                <div class="modal-property-price">$${formatNumber(property.price)}</div>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.location}
                </div>
            </div>
            
            <div class="modal-property-details">
                <div class="modal-detail-item">
                    <i class="fas fa-bed"></i>
                    <span>${property.bedrooms} Bedrooms</span>
                </div>
                <div class="modal-detail-item">
                    <i class="fas fa-bath"></i>
                    <span>${property.bathrooms} Bathrooms</span>
                </div>
                <div class="modal-detail-item">
                    <i class="fas fa-ruler-combined"></i>
                    <span>${formatNumber(property.area)} sq ft</span>
                </div>
            </div>
            
            <div class="modal-property-description">
                <h3>Description</h3>
                <p>${property.description}</p>
            </div>
            
            <div class="modal-contact-info">
                <h3>Contact Information</h3>
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <a href="mailto:${property.contactEmail}">${property.contactEmail}</a>
                </div>
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <a href="tel:${property.contactPhone}">${property.contactPhone}</a>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('propertyModal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('propertyModal').style.display = 'none';
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#27ae60' : '#e74c3c';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 3000;
        animation: slideInRight 0.3s;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Authentication Functions

async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showNotification('Email already registered!', 'error');
        return;
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create new user (password is now hashed!)
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        password: hashedPassword, // Stored as hash, not plain text
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    // Save encrypted user data
    const encrypted = encryptData(users);
    if (encrypted) {
        localStorage.setItem('users_encrypted', encrypted);
    }
    
    // Auto login (don't store password in session)
    currentUser = { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone };
    const encryptedSession = encryptData(currentUser);
    if (encryptedSession) {
        localStorage.setItem('currentUser_encrypted', encryptedSession);
    }
    
    // Close modal and update UI
    closeAuthModal('signupModal');
    updateUIForLoggedInUser();
    
    showNotification(`Welcome, ${currentUser.name}!`, 'success');
    
    // Reset form
    document.getElementById('signupForm').reset();
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Find user by email
    const user = users.find(u => u.email === email);
    
    if (!user) {
        showNotification('Invalid email or password!', 'error');
        return;
    }
    
    // Verify password hash
    const isValidPassword = await verifyPassword(password, user.password);
    
    if (!isValidPassword) {
        showNotification('Invalid email or password!', 'error');
        return;
    }
    
    // Set current user (don't include password)
    currentUser = { id: user.id, name: user.name, email: user.email, phone: user.phone };
    const encryptedSession = encryptData(currentUser);
    if (encryptedSession) {
        localStorage.setItem('currentUser_encrypted', encryptedSession);
    }
    
    // Close modal and update UI
    closeAuthModal('loginModal');
    updateUIForLoggedInUser();
    
    showNotification(`Welcome back, ${currentUser.name}!`, 'success');
    
    // Reset form
    document.getElementById('loginForm').reset();
}

function handleLogout(e) {
    e.preventDefault();
    
    currentUser = null;
    localStorage.removeItem('currentUser_encrypted');
    
    updateUIForLoggedOutUser();
    showNotification('Logged out successfully!', 'success');
    
    // Refresh properties view
    displayProperties(properties);
}

function updateUIForLoggedInUser() {
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('signupBtn').style.display = 'none';
    document.getElementById('userMenu').style.display = 'block';
    document.getElementById('userName').textContent = currentUser.name;
    
    // Pre-fill contact info in property form
    document.getElementById('contactEmail').value = currentUser.email;
    document.getElementById('contactPhone').value = currentUser.phone;
}

function updateUIForLoggedOutUser() {
    document.getElementById('loginBtn').style.display = 'inline-flex';
    document.getElementById('signupBtn').style.display = 'inline-flex';
    document.getElementById('userMenu').style.display = 'none';
    
    // Clear contact info
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
}

function closeAuthModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function switchToSignup() {
    closeAuthModal('loginModal');
    document.getElementById('signupModal').style.display = 'block';
}

function switchToLogin() {
    closeAuthModal('signupModal');
    document.getElementById('loginModal').style.display = 'block';
}

function showMyProperties() {
    if (!currentUser) {
        showNotification('Please login first!', 'error');
        return;
    }
    
    const myProperties = properties.filter(p => p.ownerId === currentUser.id);
    
    if (myProperties.length === 0) {
        showNotification('You have not listed any properties yet!', 'error');
        document.getElementById('list-property').scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    displayProperties(myProperties);
    document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
    showNotification(`Showing your ${myProperties.length} properties`, 'success');
}

function deleteProperty(propertyId) {
    if (!currentUser) {
        showNotification('Please login first!', 'error');
        return;
    }
    
    const property = properties.find(p => p.id === propertyId);
    
    if (!property) {
        showNotification('Property not found!', 'error');
        return;
    }
    
    if (property.ownerId !== currentUser.id) {
        showNotification('You can only delete your own properties!', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to delete this property?')) {
        properties = properties.filter(p => p.id !== propertyId);
        saveProperties();
        displayProperties(properties);
        showNotification('Property deleted successfully!', 'success');
    }
}

// Add animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
