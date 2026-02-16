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

// Sample Properties for Demo - Indian Properties
const sampleProperties = [
    {
        id: 1,
        title: "Spacious Villa in Bangalore",
        type: "villa",
        price: 12500000,
        location: "Whitefield, Bangalore",
        bedrooms: 4,
        bathrooms: 4,
        area: 3200,
        description: "Beautiful modern villa with spacious rooms, modular kitchen, and landscaped garden. Perfect for families looking for comfort and luxury in prime Bangalore location.",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        contactEmail: "seller1@example.com",
        contactPhone: "+91 98765-43210"
    },
    {
        id: 2,
        title: "Premium 3BHK Apartment",
        type: "apartment",
        price: 8500000,
        location: "Powai, Mumbai",
        bedrooms: 3,
        bathrooms: 3,
        area: 1850,
        description: "Luxurious 3BHK apartment with lake view, club house, swimming pool and modern amenities. Located in prime Mumbai location with excellent connectivity.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        contactEmail: "seller2@example.com",
        contactPhone: "+91 98765-43211"
    },
    {
        id: 3,
        title: "Gated Community Villa",
        type: "villa",
        price: 15000000,
        location: "Gachibowli, Hyderabad",
        bedrooms: 5,
        bathrooms: 5,
        area: 4500,
        description: "Premium gated community villa with private pool, landscaped garden, home theater, and 24/7 security. Located in Hyderabad's IT hub.",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
        contactEmail: "seller3@example.com",
        contactPhone: "+91 98765-43212"
    },
    {
        id: 4,
        title: "Modern 2BHK Apartment",
        type: "apartment",
        price: 5500000,
        location: "Indira Nagar, Pune",
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        description: "Perfect starter home with modern finishes, covered parking, and excellent location near IT parks. Ready to move in.",
        image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
        contactEmail: "seller4@example.com",
        contactPhone: "+91 98765-43213"
    },
    {
        id: 5,
        title: "Independent House",
        type: "house",
        price: 9500000,
        location: "Koramangala, Bangalore",
        bedrooms: 4,
        bathrooms: 3,
        area: 2800,
        description: "Spacious independent house with car parking, terrace garden, and traditional architecture. Located in prime Bangalore location.",
        image: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800",
        contactEmail: "seller5@example.com",
        contactPhone: "+91 98765-43214"
    },
    {
        id: 6,
        title: "Commercial Plot",
        type: "land",
        price: 7500000,
        location: "Sector 62, Noida",
        bedrooms: 0,
        bathrooms: 0,
        area: 2000,
        description: "Prime commercial plot near metro station. Perfect for building your dream business or excellent investment opportunity.",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
        contactEmail: "seller6@example.com",
        contactPhone: "+91 98765-43215"
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
    
    // Force reload Indian properties (version 2.1)
    const dataVersion = localStorage.getItem('dataVersion');
    if (dataVersion !== '2.1') {
        localStorage.setItem('dataVersion', '2.1');
        localStorage.removeItem('properties'); // Clear old properties
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

// Setup dropdown menu with 1-second delay before hiding
function setupDropdownMenu() {
    const userMenu = document.getElementById('userMenu');
    const dropdownMenu = userMenu?.querySelector('.dropdown-menu');
    
    if (!userMenu || !dropdownMenu) return;
    
    let hideTimeout;
    
    // Show dropdown on hover
    userMenu.addEventListener('mouseenter', function() {
        clearTimeout(hideTimeout);
        dropdownMenu.style.display = 'block';
        setTimeout(() => {
            dropdownMenu.style.opacity = '1';
            dropdownMenu.style.visibility = 'visible';
        }, 10);
    });
    
    // Hide dropdown with 1-second delay
    userMenu.addEventListener('mouseleave', function() {
        hideTimeout = setTimeout(() => {
            dropdownMenu.style.opacity = '0';
            dropdownMenu.style.visibility = 'hidden';
            setTimeout(() => {
                dropdownMenu.style.display = 'none';
            }, 300);
        }, 1000); // 1 second delay
    });
    
    // Keep dropdown open when hovering over it
    dropdownMenu.addEventListener('mouseenter', function() {
        clearTimeout(hideTimeout);
    });
    
    // Hide dropdown with delay when leaving dropdown itself
    dropdownMenu.addEventListener('mouseleave', function() {
        hideTimeout = setTimeout(() => {
            dropdownMenu.style.opacity = '0';
            dropdownMenu.style.visibility = 'hidden';
            setTimeout(() => {
                dropdownMenu.style.display = 'none';
            }, 300);
        }, 1000); // 1 second delay
    });
}

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
    
    const isPro = isProMember();
    
    grid.innerHTML = propertiesToDisplay.map(property => {
        const isOwner = currentUser && property.ownerId === currentUser.id;
        const ownerBadge = property.ownerName ? `<span class="owner-badge"><i class="fas fa-user"></i> Listed by: ${property.ownerName}</span>` : '';
        
        // Always show full info for property owners
        const showFullInfo = isOwner || isPro;
        const priceDisplay = showFullInfo ? `₹${formatNumber(property.price)}` : getMaskedPrice(property.price);
        const locationDisplay = showFullInfo ? property.location : getMaskedLocation(property.location);
        
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
                <div class="property-price">${priceDisplay}</div>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${locationDisplay}
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
                
                <div class="property-contact-section">
                    ${showFullInfo ? `
                        <div class="property-contact">
                            <div class="contact-item-small">
                                <i class="fas fa-envelope"></i>
                                <a href="mailto:${property.contactEmail}">${property.contactEmail}</a>
                            </div>
                            <div class="contact-item-small">
                                <i class="fas fa-phone"></i>
                                <a href="tel:${property.contactPhone}">${property.contactPhone}</a>
                            </div>
                        </div>
                    ` : `
                        <div class="property-contact locked">
                            <div class="contact-item-small">
                                <i class="fas fa-lock"></i>
                                <span class="masked-content">${getMaskedContact(property.contactEmail, 'email')}</span>
                            </div>
                            <div class="contact-item-small">
                                <i class="fas fa-lock"></i>
                                <span class="masked-content">${getMaskedContact(property.contactPhone, 'phone')}</span>
                            </div>
                        </div>
                        <div class="upgrade-mini-prompt">
                            <i class="fas fa-star"></i> Upgrade to Pro to view contact
                        </div>
                    `}
                </div>
                
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
    
    const isOwner = currentUser && property.ownerId === currentUser.id;
    const isPro = isProMember();
    const showFullInfo = isOwner || isPro;
    
    const priceDisplay = showFullInfo ? `₹${formatNumber(property.price)}` : getMaskedPrice(property.price);
    const locationDisplay = showFullInfo ? property.location : getMaskedLocation(property.location);
    
    let contactSection = '';
    if (showFullInfo) {
        contactSection = `
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
        `;
    } else {
        contactSection = `
            <div class="modal-contact-info pro-locked">
                <h3><i class="fas fa-lock"></i> Contact Information - Pro Members Only</h3>
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span class="masked-content">${getMaskedContact(property.contactEmail, 'email')}</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span class="masked-content">${getMaskedContact(property.contactPhone, 'phone')}</span>
                </div>
                <div class="upgrade-prompt">
                    <p><i class="fas fa-star"></i> Upgrade to Pro to view contact details and connect with property owners</p>
                    <a href="profile.html#membership" class="btn btn-primary">
                        <i class="fas fa-bolt"></i> Upgrade to Pro - ₹399/month
                    </a>
                </div>
            </div>
        `;
    }
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <img src="${property.image}" alt="${property.title}" class="modal-property-image"
             onerror="this.src='https://via.placeholder.com/800x400?text=Property+Image'">
        <div class="modal-property-content">
            <div class="modal-property-header">
                <h2 class="modal-property-title">${property.title}</h2>
                <span class="property-type">${property.type}</span>
                <div class="modal-property-price">${priceDisplay}</div>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${locationDisplay}
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
            
            ${contactSection}
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

// Check if current user is a Pro member
function isProMember() {
    if (!currentUser) return false;
    
    const profileData = localStorage.getItem(`profile_${currentUser.id}`);
    if (!profileData) return false;
    
    try {
        const profile = JSON.parse(profileData);
        return profile.membership && profile.membership.plan === 'pro';
    } catch (e) {
        return false;
    }
}

// Mask price for non-Pro members
function getMaskedPrice(price) {
    // Show price to all users now
    return `₹${formatNumber(price)}`;
}

// Mask location for non-Pro members
function getMaskedLocation(location) {
    // Show location to all users now
    return location;
}

// Mask contact info for non-Pro members
function getMaskedContact(contactInfo, type = 'email') {
    if (isProMember()) {
        return contactInfo;
    }
    if (type === 'email') {
        return `<span class="masked-content" title="Upgrade to Pro to view contact">•••@••••.com</span>`;
    } else if (type === 'phone') {
        return `<span class="masked-content" title="Upgrade to Pro to view contact">+•• •••••-•••••</span>`;
    }
    return contactInfo;
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
    
    // Redirect to dashboard after successful signup
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
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
    
    // Redirect to dashboard after successful login
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
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
    // Hide login/signup buttons if they exist (only on index.html)
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
    
    // Show user menu and set username
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    if (userMenu) userMenu.style.display = 'block';
    if (userName && currentUser) userName.textContent = currentUser.name;
    
    // Pre-fill contact info in property form (only on index.html)
    const contactEmail = document.getElementById('contactEmail');
    const contactPhone = document.getElementById('contactPhone');
    if (contactEmail && currentUser) contactEmail.value = currentUser.email;
    if (contactPhone && currentUser) contactPhone.value = currentUser.phone;
    
    // Setup dropdown menu with delay
    setupDropdownMenu();
    
    // Update membership banner
    updateMembershipBanner();
}

function updateMembershipBanner() {
    const banner = document.getElementById('membershipBanner');
    if (!banner) return;
    
    // Get user's profile data to check membership
    const profileData = localStorage.getItem(`profile_${currentUser.id}`);
    let membership = { plan: 'free' };
    
    if (profileData) {
        try {
            const profile = JSON.parse(profileData);
            membership = profile.membership || { plan: 'free' };
        } catch (e) {
            console.error('Error loading membership:', e);
        }
    }
    
    // Show the banner
    banner.style.display = 'block';
    
    // Update banner styling based on plan
    banner.className = 'membership-banner';
    if (membership.plan === 'pro') {
        banner.classList.add('pro');
    }
    
    // Update content based on membership status
    const title = document.getElementById('membershipTitle');
    const description = document.getElementById('membershipDescription');
    const actionBtn = document.getElementById('membershipActionBtn');
    const icon = document.getElementById('membershipIcon');
    
    if (membership.plan === 'free') {
        // Non-member or free plan
        title.textContent = `Welcome back, ${currentUser.name.split(' ')[0]}!`;
        description.textContent = "You're currently on the Free plan. Upgrade to Pro for just ₹399/month!";
        actionBtn.innerHTML = '<i class="fas fa-bolt"></i> Become a Pro Member';
        actionBtn.href = 'profile.html#membership';
        icon.innerHTML = '<i class="fas fa-user"></i>';
    } else if (membership.plan === 'pro') {
        // Pro member
        title.textContent = `Welcome back, Pro Member ${currentUser.name.split(' ')[0]}! 🌟`;
        description.textContent = "Enjoying Pro benefits: Unlimited saves, priority alerts, advanced analytics & more";
        actionBtn.innerHTML = '<i class="fas fa-cog"></i> Manage Membership';
        actionBtn.href = 'profile.html#membership';
        icon.innerHTML = '<i class="fas fa-star"></i>';
    }
}

function updateUIForLoggedOutUser() {
    document.getElementById('loginBtn').style.display = 'inline-flex';
    document.getElementById('signupBtn').style.display = 'inline-flex';
    document.getElementById('userMenu').style.display = 'none';
    
    // Hide membership banner when logged out
    const banner = document.getElementById('membershipBanner');
    if (banner) {
        banner.style.display = 'none';
    }
    
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
