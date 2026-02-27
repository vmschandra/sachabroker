# 🏗️ SachaBroker - Complete System Architecture & Logic

## 🎯 OVERVIEW

SachaBroker is a **dual-sided real estate marketplace** with separate user experiences for property searchers and property listers.

---

## 👥 USER TYPES & RESTRICTIONS

### **User Type 1: SEARCHERS (Buyers/Renters)**
**Can Do:**
- ✅ Search and filter properties
- ✅ View property details (without contact info)
- ✅ Sort by price, location, date
- ✅ Save favorites (future feature)
- ✅ Pay to unlock contact information
- ✅ Subscribe for unlimited access

**Cannot Do:**
- ❌ List properties
- ❌ Access lister dashboard
- ❌ View other searchers

### **User Type 2: LISTERS (Sellers/Brokers/Agents)**
**Can Do:**
- ✅ List properties (with photos, details)
- ✅ Manage their listings (edit, delete)
- ✅ View listing analytics (views, contacts unlocked)
- ✅ Receive notifications when contact is unlocked
- ✅ Pay for featured listings (optional)

**Cannot Do:**
- ❌ Search other properties
- ❌ Access searcher dashboard
- ❌ View other listers' properties

### **Email Restriction:**
- ✅ Same email can have TWO accounts (one searcher, one lister)
- ❌ Same email cannot have two searcher accounts
- ❌ Same email cannot have two lister accounts

**Example:**
- vamshi@gmail.com → Searcher Account ✅
- vamshi@gmail.com → Lister Account ✅ (DIFFERENT account)
- vamshi@gmail.com → Second Searcher ❌ (NOT ALLOWED)

---

## 🔐 AUTHENTICATION FLOW

### **Registration Process:**

```
1. User visits sachabroker.cm
2. Clicks "Sign Up"
3. System asks: "What do you want to do?"
   [🔍 Find Properties] [📋 List Properties]
4. User selects one
5. System shows registration form:
   - Email
   - Password
   - Confirm Password
   - Full Name
   - Phone Number
   - Account Type (pre-selected, hidden)
6. User submits
7. System checks:
   - Email valid? ✓
   - Email already registered for THIS type? → Show error
   - Email registered for OTHER type? → Allow (create second account)
   - Password strength? ✓ (min 8 chars, 1 number, 1 special)
8. Create account in database:
   - users table
   - user_id (auto)
   - email
   - password_hash (SHA-256)
   - user_type (searcher/lister)
   - created_at
   - is_verified (false)
9. Send verification email
10. Redirect to email verification page
11. User clicks link in email
12. System verifies → is_verified = true
13. Redirect to onboarding
```

### **Login Process:**

```
1. User visits sachabroker.cm/login
2. Enters email + password
3. System checks:
   - Email exists? ✓
   - If email has BOTH accounts:
     → Show: "Which account? [Searcher] [Lister]"
   - If email has ONE account:
     → Auto-detect type
4. Verify password hash
5. Create session token (JWT)
6. Store in localStorage:
   - authToken
   - userType
   - userId
   - userName
   - userEmail
7. Redirect based on type:
   - Searcher → /dashboard-searcher.html
   - Lister → /dashboard-lister.html
```

---

## 📋 ONBOARDING FLOWS

### **SEARCHER ONBOARDING:**

**Step 1: Basic Info (Already collected at registration)**
- Name ✓
- Email ✓
- Phone ✓

**Step 2: Preferences**
```
Form Fields:
1. I'm looking to:
   [ ] Buy  [ ] Rent  [ ] Both

2. Property Type:
   [ ] Residential House
   [ ] Apartment/Flat
   [ ] Villa
   [ ] Commercial Space
   [ ] Plot/Land

3. Budget Range:
   Min: ₹ [______]  Max: ₹ [______]

4. Preferred Locations (up to 5):
   [City/Area] [+ Add Another]
   Example: "Mumbai, Andheri West"

5. Number of Bedrooms:
   [ ] 1 BHK  [ ] 2 BHK  [ ] 3 BHK  [ ] 4+ BHK  [ ] Any

6. Current Location:
   [Auto-detect using browser] OR [Enter manually]
   City: [______]
   State: [______]
   Pincode: [______]

7. How soon are you looking to move?
   ( ) Immediately
   ( ) Within 1 month
   ( ) Within 3 months
   ( ) Just browsing

[Save & Continue to Dashboard]
```

**Data Stored:**
```javascript
searcher_profile {
  user_id: 123,
  looking_for: "buy", // or "rent" or "both"
  property_types: ["apartment", "villa"],
  budget_min: 5000000,
  budget_max: 10000000,
  preferred_locations: ["Mumbai Andheri West", "Mumbai Bandra"],
  bedrooms: [2, 3],
  current_city: "Mumbai",
  current_state: "Maharashtra",
  current_pincode: "400053",
  urgency: "within_3_months",
  created_at: "2026-02-27T10:30:00Z"
}
```

### **LISTER ONBOARDING:**

**Step 1: Basic Info (Already collected)**
- Name ✓
- Email ✓
- Phone ✓

**Step 2: Business Details**
```
Form Fields:
1. I am a:
   ( ) Property Owner
   ( ) Real Estate Broker
   ( ) Real Estate Agent
   ( ) Property Dealer
   ( ) Builder/Developer

2. Business Name (if applicable):
   [________________]

3. Business Type:
   ( ) Individual
   ( ) Partnership
   ( ) Private Limited
   ( ) LLP

4. Business Registration Number (optional):
   [________________]

5. GST Number (if registered):
   [________________]

6. Office Address:
   Street: [________________]
   City: [________________]
   State: [________________]
   Pincode: [________________]

7. Operating Areas (where you list properties):
   [City/Area] [+ Add Another]
   Example: "Mumbai, Delhi NCR"

8. Years of Experience:
   ( ) Less than 1 year
   ( ) 1-3 years
   ( ) 3-5 years
   ( ) 5-10 years
   ( ) 10+ years

9. Bank Account Details (for refunds/payments):
   Account Holder Name: [________________]
   Account Number: [________________]
   IFSC Code: [________________]
   Bank Name: [________________]

10. Upload Documents (optional but recommended):
    [ ] Business License/Registration
    [ ] PAN Card
    [ ] Aadhaar Card
    [Upload Files - PDF/JPG, max 5MB each]

[Save & Continue to Dashboard]
```

**Data Stored:**
```javascript
lister_profile {
  user_id: 456,
  lister_type: "broker", // owner/broker/agent/dealer/builder
  business_name: "ABC Properties",
  business_type: "individual",
  business_reg_number: "MH123456",
  gst_number: "27XXXXX",
  office_address: "123 Main St, Mumbai, MH, 400001",
  operating_areas: ["Mumbai", "Navi Mumbai", "Thane"],
  experience_years: "5-10",
  bank_account: {
    holder_name: "ABC Properties",
    account_number: "123456789",
    ifsc: "HDFC0001234",
    bank_name: "HDFC Bank"
  },
  documents: ["doc1.pdf", "doc2.pdf"],
  verification_status: "pending", // pending/verified/rejected
  created_at: "2026-02-27T10:30:00Z"
}
```

---

## 🏠 PROPERTY LISTING FLOW

### **Lister Dashboard → Add New Property:**

```
STEP 1: Property Basic Info
━━━━━━━━━━━━━━━━━━━━━━━━
1. Property For:
   ( ) Sale  ( ) Rent

2. Property Type:
   ( ) Residential House
   ( ) Apartment/Flat
   ( ) Villa
   ( ) Penthouse
   ( ) Commercial Office
   ( ) Commercial Shop
   ( ) Warehouse
   ( ) Plot/Land
   ( ) Farm House

3. Property Title:
   [________________________________]
   Example: "3 BHK Spacious Apartment in Andheri West"

[Next Step →]


STEP 2: Property Location
━━━━━━━━━━━━━━━━━━━━━━━━
4. Property Address:
   Building/House Name: [________________]
   Street/Area: [________________]
   Landmark: [________________] (optional)
   City: [________________]
   State: [________________]
   Pincode: [______]

5. Pin Location on Map:
   [🗺️ Interactive Map - Click to mark exact location]
   OR
   [📍 Auto-detect from address]

   Latitude: [____] (auto-filled)
   Longitude: [____] (auto-filled)

[← Back] [Next Step →]


STEP 3: Property Details
━━━━━━━━━━━━━━━━━━━━━━━━
6. Price:
   ₹ [________________]
   
   (If Rent):
   [ ] Per Month  [ ] Per Year
   Security Deposit: ₹ [________________]

7. Property Size:
   [____] sq ft (Carpet Area)
   [____] sq ft (Built-up Area)

8. Configuration:
   Bedrooms: [▼ Select]
   Bathrooms: [▼ Select]
   Balconies: [▼ Select]
   Parking: [ ] 2 Wheeler [Count: __] [ ] 4 Wheeler [Count: __]

9. Property Age:
   ( ) Under Construction
   ( ) Ready to Move
   ( ) 0-1 years
   ( ) 1-5 years
   ( ) 5-10 years
   ( ) 10+ years

10. Possession Status:
    ( ) Immediate
    ( ) Within 1 month
    ( ) Within 3 months
    ( ) Within 6 months
    ( ) Within 1 year

11. Furnishing Status:
    ( ) Fully Furnished
    ( ) Semi Furnished
    ( ) Unfurnished

[← Back] [Next Step →]


STEP 4: Amenities & Features
━━━━━━━━━━━━━━━━━━━━━━━━
12. Select All That Apply:
   Building Amenities:
   [ ] Lift/Elevator
   [ ] Power Backup
   [ ] Security/Gated
   [ ] CCTV
   [ ] Intercom
   [ ] Fire Safety
   [ ] Gymnasium
   [ ] Swimming Pool
   [ ] Club House
   [ ] Children's Play Area
   [ ] Garden/Park
   [ ] Visitor Parking

   Inside Property:
   [ ] Air Conditioning
   [ ] Modular Kitchen
   [ ] Servant Room
   [ ] Study Room
   [ ] Pooja Room
   [ ] Store Room
   [ ] Balcony
   [ ] Terrace Access
   [ ] Internet/WiFi Ready
   [ ] Water Purifier
   [ ] Chimney
   [ ] Wardrobes

13. Facing Direction:
    ( ) North  ( ) South  ( ) East  ( ) West
    ( ) North-East  ( ) North-West  ( ) South-East  ( ) South-West

14. Overlooking:
    [ ] Main Road  [ ] Park/Garden  [ ] Pool  [ ] Club

[← Back] [Next Step →]


STEP 5: Photos Upload
━━━━━━━━━━━━━━━━━━━━━━━━
15. Upload Photos (1-10 images, max 7MB each):

   [📸 Upload Images]
   
   Drag & drop or click to upload
   Supported: JPG, PNG, JPEG
   Max size: 7MB per image
   
   Tips:
   ✓ Upload good quality photos
   ✓ Include: Living room, bedrooms, kitchen, bathroom, balcony
   ✓ First photo will be the cover photo
   
   Uploaded Images (drag to reorder):
   [1] [Image preview] [x Remove]
   [2] [Image preview] [x Remove]
   [...up to 10]

[← Back] [Next Step →]


STEP 6: Description & Contact
━━━━━━━━━━━━━━━━━━━━━━━━
16. Property Description:
    [________________________________]
    [________________________________]
    [________________________________]
    (Max 1000 characters)
    
    Tips: Describe key features, nearby locations,
    connectivity, neighborhood, etc.

17. Contact Preferences:
    Show contact after payment: [✓] (Checked by default)
    
    Primary Contact Number: [__________] (auto-filled from profile)
    Alternative Number: [__________] (optional)
    
    Best Time to Call:
    [ ] Morning (9 AM - 12 PM)
    [ ] Afternoon (12 PM - 5 PM)
    [ ] Evening (5 PM - 9 PM)
    [ ] Anytime

18. WhatsApp Number:
    [__________] (optional)
    [ ] Same as primary contact

[← Back] [Next Step →]


STEP 7: Review & Publish
━━━━━━━━━━━━━━━━━━━━━━━━
Review all details:

[Preview Card showing:
- Cover photo
- Title
- Price
- Location
- Key features
- All details entered]

Listing Options:

( ) FREE Listing
    - Visible in search results
    - No featured placement
    - Valid for 30 days
    ₹0

( ) FEATURED Listing
    - Top placement in search
    - Highlighted border
    - "Featured" badge
    - Valid for 30 days
    ₹499

( ) PREMIUM Listing
    - Priority placement
    - Featured badge
    - Boost in search
    - Valid for 60 days
    - Featured on homepage
    ₹999

[✓] I agree to Terms & Conditions

[← Back] [Publish Property 🚀]
```

### **After Publishing:**
```
1. If FREE → Property goes live immediately
2. If FEATURED/PREMIUM → Redirect to payment page
3. After payment → Property goes live
4. Send confirmation email
5. Redirect to "My Listings" page
```

**Data Stored:**
```javascript
property {
  property_id: "PROP001",
  lister_id: 456,
  listing_type: "sale", // or "rent"
  property_type: "apartment",
  title: "3 BHK Spacious Apartment in Andheri West",
  address: {
    building: "Sunshine Towers",
    street: "SV Road",
    landmark: "Near Metro Station",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400053",
    latitude: 19.1234,
    longitude: 72.5678
  },
  price: 12500000,
  price_per_sqft: 15000,
  security_deposit: null, // for rent only
  size: {
    carpet_area: 850,
    built_up_area: 1100
  },
  configuration: {
    bedrooms: 3,
    bathrooms: 2,
    balconies: 2,
    parking: { two_wheeler: 0, four_wheeler: 1 }
  },
  property_age: "1-5",
  possession: "immediate",
  furnishing: "semi_furnished",
  amenities: ["lift", "security", "gym", "parking", "power_backup"],
  facing: "east",
  overlooking: ["park"],
  description: "Spacious 3BHK apartment...",
  photos: [
    "https://storage.supabase.co/property/image1.jpg",
    "https://storage.supabase.co/property/image2.jpg"
  ],
  contact: {
    primary_phone: "9876543210",
    alt_phone: null,
    whatsapp: "9876543210",
    best_time: ["evening", "anytime"],
    show_after_payment: true
  },
  listing_plan: "free", // free/featured/premium
  status: "active", // active/inactive/sold/rented
  views: 0,
  contacts_unlocked: 0,
  created_at: "2026-02-27T10:30:00Z",
  expires_at: "2026-03-29T10:30:00Z",
  featured_until: null
}
```

---

## 🔍 PROPERTY SEARCH FLOW

### **Searcher Dashboard → Search Properties:**

```
SEARCH INTERFACE
━━━━━━━━━━━━━━━━━━━━━━━━

[Search Bar: "Search by city, area, or pincode"]  [🔍 Search]

FILTERS (Left Sidebar):
━━━━━━━━━━━━━━━━━━━━━━━━

📍 Location:
  City: [▼ Select or Type]
  Area: [▼ Select or Type]
  Pincode: [______]
  
  [ ] Search within 5km of my location
  
💰 Budget:
  Min: ₹ [________]
  Max: ₹ [________]
  
  Quick Filters:
  [ ] Under 50 Lakhs
  [ ] 50L - 1 Cr
  [ ] 1 Cr - 2 Cr
  [ ] 2 Cr+

🏠 Property Type:
  [ ] House
  [ ] Apartment
  [ ] Villa
  [ ] Commercial
  [ ] Plot

📊 Configuration:
  Bedrooms:
  [ ] 1 BHK  [ ] 2 BHK  [ ] 3 BHK  [ ] 4+ BHK
  
  Bathrooms:
  [ ] 1  [ ] 2  [ ] 3+

📏 Property Size:
  Min: [___] sq ft
  Max: [___] sq ft

🔑 Possession:
  [ ] Immediate
  [ ] Within 1 month
  [ ] Within 3 months
  [ ] Within 6 months

🛋️ Furnishing:
  [ ] Fully Furnished
  [ ] Semi Furnished
  [ ] Unfurnished

✨ Amenities:
  [ ] Parking
  [ ] Lift
  [ ] Gym
  [ ] Swimming Pool
  [ ] Security
  [ ] Power Backup
  [ ] Garden

[Apply Filters] [Clear All]


SORT OPTIONS (Top):
━━━━━━━━━━━━━━━━━━━━━━━━
Sort by: [▼ Relevance]
  - Relevance (default)
  - Price: Low to High
  - Price: High to Low
  - Newest First
  - Oldest First
  - Size: Largest First
  - Size: Smallest First
  - Distance: Nearest First

[Grid View 📊] [List View 📋]


RESULTS:
━━━━━━━━━━━━━━━━━━━━━━━━
Showing 45 properties

[Property Card 1]
┌─────────────────────────┐
│  [Cover Photo]          │ [FEATURED ⭐]
│  ₹ 1.25 Cr              │
│  3 BHK Apartment        │
│  Andheri West, Mumbai   │
│  📏 850 sq ft           │
│  🛏️ 3 BR  🚿 2 Bath    │
│  [View Details →]       │
└─────────────────────────┘

[Property Card 2]
[Property Card 3]
...

[Load More] or [Pagination: 1 2 3 ... 10]
```

### **Click "View Details" → Property Detail Page:**

```
PROPERTY DETAIL PAGE
━━━━━━━━━━━━━━━━━━━━━━━━

[Photo Gallery - Large carousel]
[< >] Photo 1 of 8

┌─────────────────────────────────────────┐
│ 3 BHK Spacious Apartment in Andheri     │
│ Andheri West, Mumbai, Maharashtra       │
│                                          │
│ ₹ 1.25 Cr          For Sale             │
│ ₹15,625/sq ft                            │
│                                          │
│ [❤️ Save] [📤 Share] [⚠️ Report]        │
└─────────────────────────────────────────┘

KEY DETAILS:
━━━━━━━━━━━━
🛏️ Bedrooms: 3
🚿 Bathrooms: 2
🏠 Type: Apartment
📏 Carpet Area: 850 sq ft
📐 Built-up: 1100 sq ft
🅿️ Parking: 1 Car
🏗️ Age: 1-5 years
🔑 Possession: Immediate
🛋️ Furnishing: Semi Furnished
🧭 Facing: East

AMENITIES:
━━━━━━━━━━━━
✓ Lift            ✓ Gym
✓ Security        ✓ Parking
✓ Power Backup    ✓ Garden

DESCRIPTION:
━━━━━━━━━━━━
Spacious 3BHK apartment in prime location...
[Full description text]

LOCATION:
━━━━━━━━━━━━
📍 Sunshine Towers, SV Road, Andheri West
    Near Metro Station
    Mumbai, Maharashtra - 400053

[🗺️ Map showing exact location]

Nearby:
- Andheri Metro: 0.5 km
- Hospital: 1.2 km
- School: 0.8 km
- Mall: 1.5 km

CONTACT OWNER:
━━━━━━━━━━━━
⚠️ Contact information is hidden

To view contact details, you need to:

Option 1: Pay Per Contact
  Unlock THIS property contact
  ₹299 (one-time)
  [Unlock Now →]

Option 2: Unlimited Access
  Unlock ALL properties for 30 days
  ₹999/month
  [Subscribe →]

Already paid? [Login to view]

SIMILAR PROPERTIES:
━━━━━━━━━━━━
[Card 1] [Card 2] [Card 3]
```

---

## 💳 PAYMENT FLOWS

### **FLOW 1: Pay to Unlock Single Property Contact**

```
User clicks "Unlock Now" on property page
↓
Redirect to Payment Page
━━━━━━━━━━━━━━━━━━━━━━━━

Unlock Contact Information
━━━━━━━━━━━━━━━━━━━━━━━━

Property: 3 BHK Apartment in Andheri West
Amount: ₹299

What you'll get:
✓ Owner's phone number
✓ WhatsApp contact
✓ Email address
✓ Best time to call
✓ Valid for lifetime (re-access anytime)

[Proceed to Pay ₹299]
↓
Razorpay Payment Gateway Opens
↓
User pays using:
- UPI (Google Pay, PhonePe, Paytm)
- Credit/Debit Card
- Net Banking
- Wallets
↓
Payment Success
↓
Store in database:
{
  payment_id: "PAY123",
  user_id: 123,
  property_id: "PROP001",
  amount: 299,
  payment_type: "single_unlock",
  payment_method: "upi",
  status: "success",
  razorpay_payment_id: "pay_xxx",
  paid_at: "2026-02-27T10:30:00Z"
}
↓
Unlock contact in user's account:
{
  user_id: 123,
  unlocked_properties: ["PROP001"],
  unlocked_at: "2026-02-27T10:30:00Z"
}
↓
Redirect back to property page
↓
NOW CONTACT IS VISIBLE:
━━━━━━━━━━━━━━━━━━━━━━━━

CONTACT OWNER:
📞 +91 98765 43210
📱 WhatsApp: +91 98765 43210
📧 owner@email.com
🕐 Best time: Evening, Anytime

[📞 Call Now] [💬 WhatsApp] [✉️ Email]

━━━━━━━━━━━━━━━━━━━━━━━━
↓
Send email to:
1. Searcher: "You unlocked contact for [Property]"
2. Lister: "Someone unlocked your property contact! [Property]"
↓
Update property analytics:
property.contacts_unlocked += 1
↓
Done!
```

### **FLOW 2: Subscribe for Unlimited Access**

```
User clicks "Subscribe" button
↓
Subscription Page
━━━━━━━━━━━━━━━━━━━━━━━━

Choose Your Plan
━━━━━━━━━━━━━━━━━━━━━━━━

( ) BASIC - ₹999/month
    ✓ Unlock ALL property contacts
    ✓ Valid for 30 days
    ✓ Unlimited access
    ✓ Priority support
    
( ) PREMIUM - ₹2,499/3 months
    ✓ Everything in Basic
    ✓ Valid for 90 days
    ✓ Save 17%
    ✓ Early access to new listings
    ✓ Dedicated support

( ) PRO - ₹8,999/year
    ✓ Everything in Premium
    ✓ Valid for 365 days
    ✓ Save 25%
    ✓ Personal property consultant
    ✓ Home loan assistance

[Continue to Payment]
↓
Razorpay Payment
↓
Payment Success
↓
Store in database:
{
  subscription_id: "SUB123",
  user_id: 123,
  plan: "basic",
  amount: 999,
  start_date: "2026-02-27",
  end_date: "2026-03-29",
  status: "active",
  auto_renew: false,
  razorpay_subscription_id: "sub_xxx"
}
↓
Update user account:
{
  user_id: 123,
  is_subscribed: true,
  subscription_plan: "basic",
  subscription_expires: "2026-03-29",
  unlimited_access: true
}
↓
Redirect to Dashboard
↓
Show success message:
"🎉 Subscription activated! You now have unlimited access to all contacts."
↓
Send confirmation email
↓
Done!
```

### **FLOW 3: Lister Pays for Featured Listing**

```
Lister creates property → Chooses "FEATURED" → Clicks "Publish"
↓
Payment Page
━━━━━━━━━━━━━━━━━━━━━━━━

Featured Listing Payment
━━━━━━━━━━━━━━━━━━━━━━━━

Property: 3 BHK Apartment in Andheri West
Plan: FEATURED
Amount: ₹499

What you'll get:
✓ Top placement in search results
✓ Highlighted with yellow border
✓ "Featured" badge
✓ 3x more visibility
✓ Valid for 30 days

[Pay ₹499 & Publish]
↓
Razorpay Payment
↓
Success
↓
Store payment:
{
  payment_id: "PAY456",
  user_id: 456,
  property_id: "PROP001",
  amount: 499,
  payment_type: "featured_listing",
  status: "success"
}
↓
Update property:
{
  property_id: "PROP001",
  listing_plan: "featured",
  status: "active",
  featured_until: "2026-03-29"
}
↓
Publish property (goes live)
↓
Redirect to "My Listings"
↓
Show success:
"🎉 Property published successfully! Your listing is now featured."
↓
Send confirmation email
↓
Done!
```

---

## 📊 DASHBOARD DESIGNS

### **SEARCHER DASHBOARD:**

```
━━━━━━━━━━━━━━━━━━━━━━━━
WELCOME BACK, VAMSHI! 👋
━━━━━━━━━━━━━━━━━━━━━━━━

Quick Stats:
┌─────────────┬─────────────┬─────────────┐
│ 🔍 Searches │ ❤️ Saved    │ 📞 Unlocked │
│     15      │      8      │      3      │
└─────────────┴─────────────┴─────────────┘

Your Subscription:
[ No active subscription ]
[Upgrade to Unlimited Access →]

Recent Searches:
━━━━━━━━━━━━━━━━━━━━━━━━
- 3 BHK in Andheri West, Mumbai (2 days ago)
- 2 BHK in Bandra, Mumbai (5 days ago)

Saved Properties (8):
━━━━━━━━━━━━━━━━━━━━━━━━
[Card 1] [Card 2] [Card 3] [View All →]

Recommended For You:
━━━━━━━━━━━━━━━━━━━━━━━━
Based on your searches...
[Card 1] [Card 2] [Card 3]

Recent Unlocked Contacts (3):
━━━━━━━━━━━━━━━━━━━━━━━━
1. 3 BHK Apartment, Andheri
   📞 +91 98765 43210
   [Call] [WhatsApp]

2. 2 BHK Flat, Bandra
   📞 +91 98765 11111
   [Call] [WhatsApp]

[Search More Properties 🔍]
```

### **LISTER DASHBOARD:**

```
━━━━━━━━━━━━━━━━━━━━━━━━
WELCOME, ABC PROPERTIES! 🏢
━━━━━━━━━━━━━━━━━━━━━━━━

Your Performance:
┌─────────────┬─────────────┬─────────────┐
│ 📋 Listings │ 👁️ Views    │ 📞 Contacts │
│      5      │    1,234    │     45      │
└─────────────┴─────────────┴─────────────┘

Revenue This Month: ₹13,455
(45 contacts × ₹299 each)

[+ Add New Property] [Upgrade to Featured →]

Your Active Listings (5):
━━━━━━━━━━━━━━━━━━━━━━━━

1. 3 BHK Apartment, Andheri [FEATURED ⭐]
   Status: Active
   Views: 456 | Contacts: 15
   Expires: 15 days left
   [Edit] [Deactivate] [Analytics]

2. 2 BHK Flat, Bandra
   Status: Active
   Views: 234 | Contacts: 8
   Expires: 20 days left
   [Edit] [Deactivate] [Analytics] [Make Featured →]

3. 4 BHK Villa, Juhu
   Status: Active
   Views: 178 | Contacts: 12
   Expires: 5 days left ⚠️
   [Edit] [Renew →]

Recent Activity:
━━━━━━━━━━━━━━━━━━━━━━━━
- Someone unlocked contact for "3 BHK Apartment" (2 hours ago)
- New view on "2 BHK Flat" (5 hours ago)
- Someone saved "4 BHK Villa" (1 day ago)

Performance Analytics:
━━━━━━━━━━━━━━━━━━━━━━━━
[Graph showing views over last 7 days]
[Graph showing contacts unlocked]

Tips to Improve:
━━━━━━━━━━━━━━━━━━━━━━━━
💡 Add more photos to "2 BHK Flat" (has only 3)
💡 "4 BHK Villa" expires soon - renew now!
💡 Featured listings get 5x more contacts
```

---

## 🧮 DATABASE SCHEMA

### **Tables:**

```sql
-- Users table (both searchers and listers)
users {
  id: UUID PRIMARY KEY,
  email: VARCHAR(255) NOT NULL,
  password_hash: VARCHAR(255) NOT NULL,
  user_type: ENUM('searcher', 'lister') NOT NULL,
  full_name: VARCHAR(255),
  phone: VARCHAR(20),
  is_verified: BOOLEAN DEFAULT FALSE,
  verification_token: VARCHAR(255),
  created_at: TIMESTAMP DEFAULT NOW(),
  updated_at: TIMESTAMP DEFAULT NOW(),
  last_login: TIMESTAMP,
  
  UNIQUE(email, user_type) -- Same email can be both types
}

-- Searcher profiles
searcher_profiles {
  id: UUID PRIMARY KEY,
  user_id: UUID REFERENCES users(id),
  looking_for: ENUM('buy', 'rent', 'both'),
  property_types: JSON, -- ["apartment", "villa"]
  budget_min: BIGINT,
  budget_max: BIGINT,
  preferred_locations: JSON,
  bedrooms: JSON,
  current_city: VARCHAR(255),
  current_state: VARCHAR(255),
  current_pincode: VARCHAR(10),
  current_lat: DECIMAL(10, 8),
  current_lng: DECIMAL(11, 8),
  urgency: VARCHAR(50),
  is_subscribed: BOOLEAN DEFAULT FALSE,
  subscription_plan: VARCHAR(50),
  subscription_expires: TIMESTAMP,
  created_at: TIMESTAMP DEFAULT NOW(),
  updated_at: TIMESTAMP DEFAULT NOW()
}

-- Lister profiles
lister_profiles {
  id: UUID PRIMARY KEY,
  user_id: UUID REFERENCES users(id),
  lister_type: ENUM('owner', 'broker', 'agent', 'dealer', 'builder'),
  business_name: VARCHAR(255),
  business_type: VARCHAR(100),
  business_reg_number: VARCHAR(100),
  gst_number: VARCHAR(20),
  office_address: TEXT,
  operating_areas: JSON,
  experience_years: VARCHAR(20),
  bank_account: JSON,
  documents: JSON,
  verification_status: ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  rating: DECIMAL(2, 1) DEFAULT 0,
  total_properties: INT DEFAULT 0,
  total_contacts_received: INT DEFAULT 0,
  created_at: TIMESTAMP DEFAULT NOW(),
  updated_at: TIMESTAMP DEFAULT NOW()
}

-- Properties
properties {
  id: UUID PRIMARY KEY,
  property_id: VARCHAR(50) UNIQUE, -- PROP001, PROP002
  lister_id: UUID REFERENCES users(id),
  listing_type: ENUM('sale', 'rent') NOT NULL,
  property_type: VARCHAR(100) NOT NULL,
  title: VARCHAR(255) NOT NULL,
  address: JSON NOT NULL,
  latitude: DECIMAL(10, 8),
  longitude: DECIMAL(11, 8),
  price: BIGINT NOT NULL,
  price_per_sqft: INT,
  security_deposit: BIGINT,
  size: JSON,
  configuration: JSON,
  property_age: VARCHAR(50),
  possession: VARCHAR(100),
  furnishing: VARCHAR(50),
  amenities: JSON,
  facing: VARCHAR(50),
  overlooking: JSON,
  description: TEXT,
  photos: JSON, -- Array of URLs
  contact: JSON,
  listing_plan: ENUM('free', 'featured', 'premium') DEFAULT 'free',
  status: ENUM('active', 'inactive', 'sold', 'rented', 'expired') DEFAULT 'active',
  views: INT DEFAULT 0,
  saves: INT DEFAULT 0,
  contacts_unlocked: INT DEFAULT 0,
  created_at: TIMESTAMP DEFAULT NOW(),
  updated_at: TIMESTAMP DEFAULT NOW(),
  expires_at: TIMESTAMP,
  featured_until: TIMESTAMP,
  
  INDEX(latitude, longitude), -- For location search
  INDEX(listing_type, property_type, status), -- For filtering
  INDEX(price), -- For price sorting
  INDEX(created_at) -- For recent listings
}

-- Payments
payments {
  id: UUID PRIMARY KEY,
  payment_id: VARCHAR(50) UNIQUE,
  user_id: UUID REFERENCES users(id),
  property_id: UUID REFERENCES properties(id),
  amount: INT NOT NULL,
  payment_type: ENUM('single_unlock', 'subscription', 'featured_listing', 'premium_listing'),
  payment_method: VARCHAR(50),
  status: ENUM('pending', 'success', 'failed', 'refunded'),
  razorpay_payment_id: VARCHAR(255),
  razorpay_order_id: VARCHAR(255),
  razorpay_signature: VARCHAR(255),
  created_at: TIMESTAMP DEFAULT NOW(),
  
  INDEX(user_id),
  INDEX(status)
}

-- Subscriptions
subscriptions {
  id: UUID PRIMARY KEY,
  subscription_id: VARCHAR(50) UNIQUE,
  user_id: UUID REFERENCES users(id),
  plan: ENUM('basic', 'premium', 'pro'),
  amount: INT NOT NULL,
  start_date: DATE NOT NULL,
  end_date: DATE NOT NULL,
  status: ENUM('active', 'expired', 'cancelled'),
  auto_renew: BOOLEAN DEFAULT FALSE,
  razorpay_subscription_id: VARCHAR(255),
  created_at: TIMESTAMP DEFAULT NOW(),
  cancelled_at: TIMESTAMP,
  
  INDEX(user_id),
  INDEX(status, end_date)
}

-- Unlocked contacts (track who unlocked which property)
unlocked_contacts {
  id: UUID PRIMARY KEY,
  user_id: UUID REFERENCES users(id),
  property_id: UUID REFERENCES properties(id),
  unlocked_at: TIMESTAMP DEFAULT NOW(),
  payment_id: UUID REFERENCES payments(id),
  
  UNIQUE(user_id, property_id),
  INDEX(user_id),
  INDEX(property_id)
}

-- Saved properties (favorites)
saved_properties {
  id: UUID PRIMARY KEY,
  user_id: UUID REFERENCES users(id),
  property_id: UUID REFERENCES properties(id),
  saved_at: TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, property_id),
  INDEX(user_id)
}

-- Search history
search_history {
  id: UUID PRIMARY KEY,
  user_id: UUID REFERENCES users(id),
  search_query: TEXT,
  filters: JSON,
  results_count: INT,
  searched_at: TIMESTAMP DEFAULT NOW(),
  
  INDEX(user_id, searched_at)
}

-- Property views (analytics)
property_views {
  id: UUID PRIMARY KEY,
  property_id: UUID REFERENCES properties(id),
  user_id: UUID REFERENCES users(id),
  viewed_at: TIMESTAMP DEFAULT NOW(),
  user_ip: VARCHAR(50),
  user_agent: TEXT,
  
  INDEX(property_id, viewed_at),
  INDEX(user_id)
}
```

---

## 🔐 SECURITY & ACCESS CONTROL

### **Access Rules:**

```javascript
// SEARCHERS can:
✅ GET /api/properties (search, filter, view)
✅ GET /api/properties/:id (view details)
✅ POST /api/unlock-contact (pay and unlock)
✅ POST /api/subscribe (buy subscription)
✅ GET /api/my-unlocked-contacts
✅ POST /api/save-property
✅ GET /api/my-saved-properties
❌ POST /api/properties (cannot create listings)
❌ PUT /api/properties/:id (cannot edit)
❌ DELETE /api/properties/:id (cannot delete)
❌ GET /api/lister-dashboard (cannot access)

// LISTERS can:
✅ POST /api/properties (create listings)
✅ PUT /api/properties/:id (edit own listings)
✅ DELETE /api/properties/:id (delete own listings)
✅ GET /api/my-properties
✅ GET /api/lister-dashboard
✅ GET /api/property-analytics/:id
❌ GET /api/properties (cannot search/browse)
❌ POST /api/unlock-contact (cannot unlock)
❌ POST /api/subscribe (cannot subscribe)
❌ GET /api/searcher-dashboard (cannot access)

// Middleware checks:
function requireSearcher(req, res, next) {
  if (req.user.user_type !== 'searcher') {
    return res.status(403).json({ error: 'Access denied. Searchers only.' });
  }
  next();
}

function requireLister(req, res, next) {
  if (req.user.user_type !== 'lister') {
    return res.status(403).json({ error: 'Access denied. Listers only.' });
  }
  next();
}
```

---

## 🎯 PROFIT MODEL & REVENUE STREAMS

### **Revenue Sources:**

**1. Searcher Subscriptions:**
```
Basic: ₹999/month × Users
Premium: ₹2,499/3 months × Users
Pro: ₹8,999/year × Users

Projected (after 6 months):
- 100 Basic users = ₹99,900/month
- 50 Premium users = ₹41,650/month (avg)
- 20 Pro users = ₹14,998/month (avg)
TOTAL: ₹1,56,548/month
```

**2. Pay-Per-Contact:**
```
₹299 per contact unlock

Projected:
- 200 contacts/month × ₹299 = ₹59,800/month
```

**3. Featured Listings:**
```
Featured: ₹499/listing × 30 days
Premium: ₹999/listing × 60 days

Projected:
- 50 featured listings/month = ₹24,950/month
- 20 premium listings/month = ₹19,980/month
TOTAL: ₹44,930/month
```

**4. Commission on Successful Deals (Future):**
```
0.5-1% commission on properties sold through platform
Average property: ₹1 Cr × 0.5% = ₹50,000 per deal
```

**TOTAL PROJECTED REVENUE (Month 6):**
```
Subscriptions: ₹1,56,548
Pay-per-contact: ₹59,800
Listings: ₹44,930
━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: ₹2,61,278/month
ANNUAL: ₹31,35,336/year
```

### **Cost Breakdown:**

**Monthly Costs:**
```
Domain: ₹800/year = ₹67/month
Hosting (Vercel): ₹0 (free)
Database (Supabase): ₹1,650/month
Maps API (Google): ₹0 (within free tier)
Payment Gateway (Razorpay): 2% of transactions
  = 2% of ₹2,61,278 = ₹5,226/month
━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: ₹6,943/month
```

**NET PROFIT:**
```
Revenue: ₹2,61,278/month
Costs: ₹6,943/month
━━━━━━━━━━━━━━━━━━━━━━━
NET PROFIT: ₹2,54,335/month
ANNUAL: ₹30,52,020/year
```

---

## ✅ IMPLEMENTATION CHECKLIST

**Phase 1: Core Setup (Week 1-2)**
- [x] Create Vercel account
- [x] Deploy website to Vercel
- [x] Connect domain (sachabroker.cm)
- [ ] Setup Supabase database
- [ ] Create all database tables
- [ ] Setup Razorpay account (KYC)
- [ ] Setup Google Maps API

**Phase 2: User System (Week 3-4)**
- [ ] Implement dual account type registration
- [ ] Email verification system
- [ ] Login with account type selection
- [ ] Searcher onboarding flow
- [ ] Lister onboarding flow
- [ ] Profile pages (both types)

**Phase 3: Property System (Week 5-6)**
- [ ] Property listing form (7 steps)
- [ ] Image upload to Supabase Storage
- [ ] Google Maps integration (geocoding)
- [ ] Property list display (lister dashboard)
- [ ] Edit/delete property functionality

**Phase 4: Search System (Week 7-8)**
- [ ] Search interface with filters
- [ ] Location-based search (radius)
- [ ] Sort functionality
- [ ] Property detail page
- [ ] Blurred contact display

**Phase 5: Payment System (Week 9-10)**
- [ ] Razorpay integration
- [ ] Single contact unlock flow
- [ ] Subscription plans
- [ ] Payment verification
- [ ] Contact unlock logic

**Phase 6: Analytics & Notifications (Week 11-12)**
- [ ] Property view tracking
- [ ] Contact unlock notifications (email)
- [ ] Lister dashboard analytics
- [ ] Searcher saved properties
- [ ] Search history

**Phase 7: Testing & Launch (Week 13-14)**
- [ ] Test all user flows
- [ ] Test payments (test mode)
- [ ] Security audit
- [ ] Performance optimization
- [ ] Switch to live mode
- [ ] Soft launch
- [ ] Marketing campaign

---

This is the complete system design! Ready to start implementation? 🚀
