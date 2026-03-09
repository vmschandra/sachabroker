// Firebase Authentication Module for Sachabroker
// ===============================================
// Handles user signup, login, logout, email verification, and password reset

// ==========================================
// SIGN UP
// ==========================================

async function firebaseSignup(email, password, userData) {
    try {
        // Create user with email and password
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        console.log('✅ User created:', user.uid);
        
        // Update profile with display name
        await user.updateProfile({
            displayName: userData.name
        });
        
        // Save additional user data to Firestore
        await db.collection('users').doc(user.uid).set({
            name: userData.name,
            email: email,
            phone: userData.phone || '',
            accountType: userData.accountType || 'searcher',
            emailVerified: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            // Searcher specific fields
            searchPreferences: userData.searchPreferences || null,
            // Lister specific fields
            companyName: userData.companyName || null,
            gstNumber: userData.gstNumber || null,
            reraNumber: userData.reraNumber || null,
            // Profile
            profileComplete: false,
            onboardingComplete: false
        });
        
        // Send email verification
        await user.sendEmailVerification();
        console.log('📧 Verification email sent');
        
        return {
            success: true,
            user: user,
            message: 'Account created! Please check your email to verify.'
        };
        
    } catch (error) {
        console.error('Signup error:', error);
        
        let message = 'Signup failed. Please try again.';
        switch (error.code) {
            case 'auth/email-already-in-use':
                message = 'This email is already registered. Please login instead.';
                break;
            case 'auth/invalid-email':
                message = 'Please enter a valid email address.';
                break;
            case 'auth/weak-password':
                message = 'Password should be at least 6 characters.';
                break;
            case 'auth/operation-not-allowed':
                message = 'Email/Password signup is not enabled.';
                break;
        }
        
        return {
            success: false,
            error: error,
            message: message
        };
    }
}

// ==========================================
// LOGIN
// ==========================================

async function firebaseLogin(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        console.log('✅ User logged in:', user.email);
        
        // Update last login time in Firestore
        await db.collection('users').doc(user.uid).update({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        return {
            success: true,
            user: user,
            message: 'Login successful!'
        };
        
    } catch (error) {
        console.error('Login error:', error);
        
        let message = 'Login failed. Please try again.';
        switch (error.code) {
            case 'auth/user-not-found':
                message = 'No account found with this email. Please sign up.';
                break;
            case 'auth/wrong-password':
                message = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-email':
                message = 'Please enter a valid email address.';
                break;
            case 'auth/user-disabled':
                message = 'This account has been disabled.';
                break;
            case 'auth/too-many-requests':
                message = 'Too many failed attempts. Please try again later.';
                break;
        }
        
        return {
            success: false,
            error: error,
            message: message
        };
    }
}

// ==========================================
// GOOGLE SIGN IN
// ==========================================

async function firebaseGoogleSignIn() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        const isNewUser = result.additionalUserInfo?.isNewUser;
        
        console.log('✅ Google sign in:', user.email);
        
        if (isNewUser) {
            // Create user document for new users
            await db.collection('users').doc(user.uid).set({
                name: user.displayName,
                email: user.email,
                phone: user.phoneNumber || '',
                accountType: 'searcher', // Default, can be changed in profile
                emailVerified: user.emailVerified,
                photoURL: user.photoURL,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                authProvider: 'google',
                profileComplete: false,
                onboardingComplete: false
            });
        } else {
            // Update last login
            await db.collection('users').doc(user.uid).update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        return {
            success: true,
            user: user,
            isNewUser: isNewUser,
            message: isNewUser ? 'Account created with Google!' : 'Welcome back!'
        };
        
    } catch (error) {
        console.error('Google sign in error:', error);
        
        let message = 'Google sign in failed.';
        if (error.code === 'auth/popup-closed-by-user') {
            message = 'Sign in cancelled.';
        } else if (error.code === 'auth/popup-blocked') {
            message = 'Pop-up blocked. Please allow pop-ups and try again.';
        }
        
        return {
            success: false,
            error: error,
            message: message
        };
    }
}

// ==========================================
// LOGOUT
// ==========================================

async function firebaseLogout() {
    try {
        await auth.signOut();
        
        // Clear local storage
        localStorage.removeItem('currentUser_encrypted');
        window.currentUser = null;
        
        console.log('✅ User logged out');
        
        return {
            success: true,
            message: 'Logged out successfully!'
        };
        
    } catch (error) {
        console.error('Logout error:', error);
        return {
            success: false,
            error: error,
            message: 'Logout failed. Please try again.'
        };
    }
}

// ==========================================
// EMAIL VERIFICATION
// ==========================================

async function sendVerificationEmail() {
    try {
        const user = auth.currentUser;
        if (!user) {
            return { success: false, message: 'No user logged in.' };
        }
        
        await user.sendEmailVerification();
        console.log('📧 Verification email sent');
        
        return {
            success: true,
            message: 'Verification email sent! Please check your inbox.'
        };
        
    } catch (error) {
        console.error('Send verification error:', error);
        
        let message = 'Failed to send verification email.';
        if (error.code === 'auth/too-many-requests') {
            message = 'Too many requests. Please wait before trying again.';
        }
        
        return {
            success: false,
            error: error,
            message: message
        };
    }
}

// Check if email is verified
async function checkEmailVerified() {
    try {
        const user = auth.currentUser;
        if (!user) return false;
        
        // Reload user to get latest status
        await user.reload();
        
        if (user.emailVerified) {
            // Update Firestore
            await db.collection('users').doc(user.uid).update({
                emailVerified: true,
                verifiedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        return user.emailVerified;
        
    } catch (error) {
        console.error('Check verification error:', error);
        return false;
    }
}

// ==========================================
// PASSWORD RESET
// ==========================================

async function sendPasswordResetEmail(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        console.log('📧 Password reset email sent');
        
        return {
            success: true,
            message: 'Password reset email sent! Check your inbox.'
        };
        
    } catch (error) {
        console.error('Password reset error:', error);
        
        let message = 'Failed to send password reset email.';
        switch (error.code) {
            case 'auth/user-not-found':
                message = 'No account found with this email.';
                break;
            case 'auth/invalid-email':
                message = 'Please enter a valid email address.';
                break;
            case 'auth/too-many-requests':
                message = 'Too many requests. Please try again later.';
                break;
        }
        
        return {
            success: false,
            error: error,
            message: message
        };
    }
}

// ==========================================
// UPDATE PASSWORD
// ==========================================

async function updatePassword(currentPassword, newPassword) {
    try {
        const user = auth.currentUser;
        if (!user) {
            return { success: false, message: 'No user logged in.' };
        }
        
        // Re-authenticate user
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            currentPassword
        );
        await user.reauthenticateWithCredential(credential);
        
        // Update password
        await user.updatePassword(newPassword);
        
        console.log('✅ Password updated');
        
        return {
            success: true,
            message: 'Password updated successfully!'
        };
        
    } catch (error) {
        console.error('Update password error:', error);
        
        let message = 'Failed to update password.';
        if (error.code === 'auth/wrong-password') {
            message = 'Current password is incorrect.';
        } else if (error.code === 'auth/weak-password') {
            message = 'New password should be at least 6 characters.';
        }
        
        return {
            success: false,
            error: error,
            message: message
        };
    }
}

// ==========================================
// UPDATE PROFILE
// ==========================================

async function updateUserProfile(updates) {
    try {
        const user = auth.currentUser;
        if (!user) {
            return { success: false, message: 'No user logged in.' };
        }
        
        // Update Firebase Auth profile
        if (updates.name) {
            await user.updateProfile({
                displayName: updates.name
            });
        }
        
        // Update Firestore document
        await db.collection('users').doc(user.uid).update({
            ...updates,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update local user object
        if (window.currentUser) {
            window.currentUser = { ...window.currentUser, ...updates };
            localStorage.setItem('currentUser_encrypted', btoa(JSON.stringify(window.currentUser)));
        }
        
        console.log('✅ Profile updated');
        
        return {
            success: true,
            message: 'Profile updated successfully!'
        };
        
    } catch (error) {
        console.error('Update profile error:', error);
        return {
            success: false,
            error: error,
            message: 'Failed to update profile.'
        };
    }
}

// ==========================================
// DELETE ACCOUNT
// ==========================================

async function deleteUserAccount(password) {
    try {
        const user = auth.currentUser;
        if (!user) {
            return { success: false, message: 'No user logged in.' };
        }
        
        // Re-authenticate user
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            password
        );
        await user.reauthenticateWithCredential(credential);
        
        // Delete user data from Firestore
        await db.collection('users').doc(user.uid).delete();
        
        // Delete user properties
        const propertiesSnapshot = await db.collection('properties')
            .where('ownerId', '==', user.uid)
            .get();
        
        const batch = db.batch();
        propertiesSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        
        // Delete Firebase Auth account
        await user.delete();
        
        // Clear local storage
        localStorage.clear();
        window.currentUser = null;
        
        console.log('✅ Account deleted');
        
        return {
            success: true,
            message: 'Account deleted successfully.'
        };
        
    } catch (error) {
        console.error('Delete account error:', error);
        
        let message = 'Failed to delete account.';
        if (error.code === 'auth/wrong-password') {
            message = 'Incorrect password.';
        } else if (error.code === 'auth/requires-recent-login') {
            message = 'Please log out and log back in before deleting your account.';
        }
        
        return {
            success: false,
            error: error,
            message: message
        };
    }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Get current user
function getCurrentUser() {
    return auth?.currentUser || null;
}

// Check if user is logged in
function isUserLoggedIn() {
    return auth?.currentUser !== null;
}

// Get user ID
function getCurrentUserId() {
    return auth?.currentUser?.uid || null;
}
