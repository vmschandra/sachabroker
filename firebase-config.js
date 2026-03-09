// Firebase Configuration for Sachabroker
// ===============================================
// Your Firebase project credentials

const firebaseConfig = {
    apiKey: "AIzaSyBoFSaRh2XJQ6txh8wNs2kktA2JVrMv6_g",
    authDomain: "sachabroker-4560a.firebaseapp.com",
    projectId: "sachabroker-4560a",
    storageBucket: "sachabroker-4560a.firebasestorage.app",
    messagingSenderId: "1010677555631",
    appId: "1:1010677555631:web:fb1395299e10a6a2128f5a"
};

// Initialize Firebase
let app, auth, db, storage;

// Check if Firebase SDK is loaded
function initializeFirebase() {
    if (typeof firebase !== 'undefined') {
        // Initialize Firebase App
        if (!firebase.apps.length) {
            app = firebase.initializeApp(firebaseConfig);
        } else {
            app = firebase.apps[0];
        }
        
        // Initialize Services
        auth = firebase.auth();
        db = firebase.firestore();
        storage = firebase.storage();
        
        console.log('✅ Firebase initialized successfully');
        
        // Setup auth state listener
        setupAuthStateListener();
        
        return true;
    } else {
        console.error('❌ Firebase SDK not loaded');
        return false;
    }
}

// Auth state change listener
function setupAuthStateListener() {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            console.log('👤 User logged in:', user.email);
            
            // Get user data from Firestore
            const userData = await getUserFromFirestore(user.uid);
            
            if (userData) {
                // Store in session for quick access
                const sessionUser = {
                    id: user.uid,
                    email: user.email,
                    name: userData.name || user.displayName || 'User',
                    phone: userData.phone || '',
                    accountType: userData.accountType || 'searcher',
                    emailVerified: user.emailVerified,
                    createdAt: userData.createdAt,
                    ...userData
                };
                
                // Update global currentUser
                window.currentUser = sessionUser;
                
                // Store encrypted session
                localStorage.setItem('currentUser_encrypted', btoa(JSON.stringify(sessionUser)));
                
                // Update UI
                if (typeof updateUIForLoggedInUser === 'function') {
                    updateUIForLoggedInUser();
                }
            }
        } else {
            console.log('👤 User logged out');
            window.currentUser = null;
            localStorage.removeItem('currentUser_encrypted');
            
            // Update UI for logged out state
            const loginBtn = document.getElementById('loginBtn');
            const signupBtn = document.getElementById('signupBtn');
            const userMenu = document.getElementById('userMenu');
            
            if (loginBtn) loginBtn.style.display = 'block';
            if (signupBtn) signupBtn.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
        }
    });
}

// Get user data from Firestore
async function getUserFromFirestore(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        if (doc.exists) {
            return doc.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}

// Check if Firebase is configured
function isFirebaseConfigured() {
    return firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure Firebase SDK is loaded
    setTimeout(() => {
        if (isFirebaseConfigured()) {
            initializeFirebase();
        } else {
            console.warn('⚠️ Firebase not configured. Using localStorage mode.');
            console.warn('Please update firebase-config.js with your Firebase credentials.');
        }
    }, 100);
});
