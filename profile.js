// Profile Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser_encrypted');
    if (!storedUser) {
        window.location.href = 'index.html';
        return;
    }

    // Load profile data
    loadProfileData();
    
    // Setup event listeners
    setupProfileEventListeners();
});

function loadProfileData() {
    if (!currentUser) return;
    
    // Load extended profile data from localStorage
    const profileData = localStorage.getItem(`profile_${currentUser.id}`);
    let profile = {};
    
    if (profileData) {
        try {
            profile = JSON.parse(profileData);
        } catch (e) {
            console.error('Error loading profile:', e);
        }
    }
    
    // Display user name in header
    document.getElementById('userName').textContent = currentUser.name;
    
    // Load profile picture
    if (profile.profilePicture) {
        const display = document.getElementById('profilePictureDisplay');
        display.innerHTML = `<img src="${profile.profilePicture}" alt="Profile Picture">`;
    }
    
    // Load user type
    if (profile.userType) {
        const option = document.querySelector(`.user-type-option[data-type="${profile.userType}"]`);
        if (option) {
            option.classList.add('active');
        }
    }
    
    // Load personal information
    const nameParts = currentUser.name.split(' ');
    document.getElementById('firstName').value = nameParts[0] || '';
    document.getElementById('lastName').value = nameParts.slice(1).join(' ') || '';
    document.getElementById('email').value = currentUser.email || '';
    document.getElementById('phone').value = currentUser.phone || '';
    document.getElementById('bio').value = profile.bio || '';
    
    // Load address
    if (profile.address) {
        document.getElementById('street').value = profile.address.street || '';
        document.getElementById('city').value = profile.address.city || '';
        document.getElementById('state').value = profile.address.state || '';
        document.getElementById('zipCode').value = profile.address.zipCode || '';
        document.getElementById('country').value = profile.address.country || 'USA';
    }
    
    // Load payment info (masked for security)
    if (profile.payment) {
        document.getElementById('cardName').value = profile.payment.cardName || '';
        // Only show last 4 digits of card
        if (profile.payment.cardNumberMasked) {
            document.getElementById('cardNumber').value = profile.payment.cardNumberMasked;
        }
        document.getElementById('expiryDate').value = profile.payment.expiryDate || '';
        document.getElementById('billingAddress').value = profile.payment.billingAddress || '';
    }
}

function setupProfileEventListeners() {
    // Profile picture upload
    document.getElementById('profilePictureInput').addEventListener('change', handleProfilePictureUpload);
    
    // User type selection
    document.querySelectorAll('.user-type-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.user-type-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Card number formatting
    document.getElementById('cardNumber').addEventListener('input', formatCardNumber);
    
    // Expiry date formatting
    document.getElementById('expiryDate').addEventListener('input', formatExpiryDate);
    
    // CVV input (numbers only)
    document.getElementById('cvv').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');
    });
    
    // Save profile button
    document.getElementById('saveProfileBtn').addEventListener('click', saveProfile);
    
    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

function handleProfilePictureUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size should be less than 5MB', 'error');
        return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please upload an image file', 'error');
        return;
    }
    
    // Read and display the image
    const reader = new FileReader();
    reader.onload = function(event) {
        const display = document.getElementById('profilePictureDisplay');
        display.innerHTML = `<img src="${event.target.result}" alt="Profile Picture">`;
        
        // Store in profile data
        const profileData = getProfileData();
        profileData.profilePicture = event.target.result;
        saveProfileData(profileData);
        
        showNotification('Profile picture updated!', 'success');
    };
    reader.readAsDataURL(file);
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '');
    value = value.replace(/\D/g, '');
    value = value.substring(0, 16);
    
    // Add space every 4 digits
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formatted;
}

function formatExpiryDate(e) {
    let value = e.target.value.replace(/\//g, '');
    value = value.replace(/\D/g, '');
    value = value.substring(0, 4);
    
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
    }
    
    e.target.value = value;
}

function getProfileData() {
    const profileData = localStorage.getItem(`profile_${currentUser.id}`);
    if (profileData) {
        try {
            return JSON.parse(profileData);
        } catch (e) {
            return {};
        }
    }
    return {};
}

function saveProfileData(data) {
    localStorage.setItem(`profile_${currentUser.id}`, JSON.stringify(data));
}

async function saveProfile() {
    // Get selected user type
    const selectedType = document.querySelector('.user-type-option.active');
    const userType = selectedType ? selectedType.dataset.type : null;
    
    if (!userType) {
        showNotification('Please select an account type', 'error');
        return;
    }
    
    // Get all form data
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const bio = document.getElementById('bio').value;
    
    const address = {
        street: document.getElementById('street').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        country: document.getElementById('country').value
    };
    
    // Get payment info (encrypt sensitive data)
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const payment = {
        cardName: document.getElementById('cardName').value,
        cardNumberMasked: cardNumber ? `•••• •••• •••• ${cardNumber.slice(-4)}` : '',
        cardNumberEncrypted: cardNumber ? await hashPassword(cardNumber) : '', // Use hashing for storage
        expiryDate: document.getElementById('expiryDate').value,
        billingAddress: document.getElementById('billingAddress').value
    };
    
    // Get existing profile data
    const profileData = getProfileData();
    
    // Update profile data
    const updatedProfile = {
        ...profileData,
        userType: userType,
        bio: bio,
        address: address,
        payment: payment,
        lastUpdated: new Date().toISOString()
    };
    
    // Save profile data
    saveProfileData(updatedProfile);
    
    // Update current user info
    currentUser.name = `${firstName} ${lastName}`.trim();
    currentUser.email = email;
    currentUser.phone = phone;
    
    // Update encrypted session
    const encryptedSession = encryptData(currentUser);
    if (encryptedSession) {
        localStorage.setItem('currentUser_encrypted', encryptedSession);
    }
    
    // Update user in users array
    const storedUsers = localStorage.getItem('users_encrypted');
    if (storedUsers) {
        const decrypted = decryptData(storedUsers);
        if (decrypted) {
            const userIndex = decrypted.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                decrypted[userIndex] = {
                    ...decrypted[userIndex],
                    name: currentUser.name,
                    email: currentUser.email,
                    phone: currentUser.phone
                };
                
                const encrypted = encryptData(decrypted);
                if (encrypted) {
                    localStorage.setItem('users_encrypted', encrypted);
                }
            }
        }
    }
    
    showNotification('Profile updated successfully!', 'success');
    
    // Update the display
    document.getElementById('userName').textContent = currentUser.name;
}

// Format phone number on input
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) value = value.substring(0, 10);
            
            if (value.length >= 6) {
                value = `+1 (${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6)}`;
            } else if (value.length >= 3) {
                value = `+1 (${value.substring(0, 3)}) ${value.substring(3)}`;
            } else if (value.length > 0) {
                value = `+1 (${value}`;
            }
            
            e.target.value = value;
        });
    }
});
