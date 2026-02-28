# ✅ SIMPLE STEP-BY-STEP CHECKLIST

Copy this checklist and check off each step as you complete it!

---

## 🎯 WEEK 1: BASIC SETUP

### Day 1: Deploy Website (30 minutes)

- [ ] **Step 1:** Open https://vercel.com
- [ ] **Step 2:** Click "Sign Up"
- [ ] **Step 3:** Click "Continue with GitHub"
- [ ] **Step 4:** Login to your GitHub account (vmschandra)
- [ ] **Step 5:** Click "Authorize Vercel"
- [ ] **Step 6:** Click "Add New..." → "Project"
 - [ ] **Step 7:** Find "sachabroker" repository
- [ ] **Step 8:** Click "Import"
- [ ] **Step 9:** Click "Deploy"
- [ ] **Step 10:** Wait 1 minute
- [ ] **Step 11:** ✅ Write down your Vercel URL: `___________________________`

**Example URL:** https://sachabroker-abc123.vercel.app

---

### Day 2: Connect Domain (30 minutes + 24-48 hours wait)

#### On Namecheap:

- [ ] **Step 1:** Login to Namecheap.com
- [ ] **Step 2:** Click "Domain List"
- [ ] **Step 3:** Find "sachabroker.cm"
- [ ] **Step 4:** Click "Manage"
- [ ] **Step 5:** Click "Advanced DNS" tab
- [ ] **Step 6:** Delete all existing A and CNAME records
- [ ] **Step 7:** Click "Add New Record"
- [ ] **Step 8:** Add Record 1:
  - Type: `A Record`
  - Host: `@`
  - Value: `76.76.19.19`
  - TTL: `Automatic`
  - Click ✓
- [ ] **Step 9:** Click "Add New Record" again
- [ ] **Step 10:** Add Record 2:
  - Type: `CNAME Record`
  - Host: `www`
  - Value: `cname.vercel-dns.com.`
  - TTL: `Automatic`
  - Click ✓
- [ ] **Step 11:** ✅ DNS records saved

#### On Vercel:

- [ ] **Step 12:** Go to Vercel Dashboard
- [ ] **Step 13:** Click your "sachabroker" project
- [ ] **Step 14:** Click "Settings" tab
- [ ] **Step 15:** Click "Domains" (left sidebar)
- [ ] **Step 16:** Type: `sachabroker.cm`
- [ ] **Step 17:** Click "Add"
- [ ] **Step 18:** Type: `www.sachabroker.cm`
- [ ] **Step 19:** Click "Add"
- [ ] **Step 20:** ✅ Domain added (wait 24-48 hours for it to work)

---

### Day 3: Setup Database (30 minutes)

- [ ] **Step 1:** Open https://supabase.com
- [ ] **Step 2:** Click "Start your project"
- [ ] **Step 3:** Click "Sign in with GitHub"
- [ ] **Step 4:** Authorize Supabase
- [ ] **Step 5:** Click "New Project"
- [ ] **Step 6:** Fill in:
  - Name: `sachabroker`
  - Database Password: `_______________` (SAVE THIS!)
  - Region: `South Asia (Mumbai)`
- [ ] **Step 7:** Click "Create new project"
- [ ] **Step 8:** Wait 2 minutes
- [ ] **Step 9:** Click "Settings" (gear icon bottom left)
- [ ] **Step 10:** Click "API"
- [ ] **Step 11:** Copy and save these:
  - Project URL: `___________________________________`
  - Anon Public Key: `___________________________________`
- [ ] **Step 12:** ✅ Database ready!

---

### Day 4: Apply for Payment Gateway (20 minutes + 1-2 days wait)

- [ ] **Step 1:** Open https://dashboard.razorpay.com/signup
- [ ] **Step 2:** Enter your email
- [ ] **Step 3:** Click "Get Started"
- [ ] **Step 4:** Verify email (check inbox)
- [ ] **Step 5:** Fill business details:
  - Business Name: `SachaBroker`
  - Your Name: `________________`
  - Phone: `________________`
  - Business Type: `Individual` or `Proprietorship`
- [ ] **Step 6:** Click "Continue"
- [ ] **Step 7:** Complete KYC:
  - Upload PAN Card (PDF/JPG)
  - Upload Aadhaar (PDF/JPG)
  - Enter bank details
- [ ] **Step 8:** Submit
- [ ] **Step 9:** ✅ Wait 1-2 days for approval email

---

### Day 5: Setup Google Maps (45 minutes)

- [ ] **Step 1:** Open https://console.cloud.google.com
- [ ] **Step 2:** Sign in with your Gmail
- [ ] **Step 3:** Click "Select a project" (top bar)
- [ ] **Step 4:** Click "NEW PROJECT"
- [ ] **Step 5:** Name: `SachaBroker`
- [ ] **Step 6:** Click "Create"
- [ ] **Step 7:** Wait 30 seconds
- [ ] **Step 8:** In search bar, type: `Maps JavaScript API`
- [ ] **Step 9:** Click first result
- [ ] **Step 10:** Click "Enable"
- [ ] **Step 11:** Go back (back button)
- [ ] **Step 12:** Search: `Geocoding API`
- [ ] **Step 13:** Click "Enable"
- [ ] **Step 14:** Go back
- [ ] **Step 15:** Search: `Places API`
- [ ] **Step 16:** Click "Enable"
- [ ] **Step 17:** Click "Credentials" (left sidebar)
- [ ] **Step 18:** Click "Create Credentials"
- [ ] **Step 19:** Select "API Key"
- [ ] **Step 20:** Copy your API Key: `___________________________________`
- [ ] **Step 21:** Click "Restrict Key"
- [ ] **Step 22:** Under "Application restrictions":
  - Select "HTTP referrers"
  - Click "Add an item"
  - Type: `https://sachabroker.cm/*`
  - Click "Add an item"
  - Type: `https://*.vercel.app/*`
- [ ] **Step 23:** Click "Save"
- [ ] **Step 24:** Click "Billing" (left menu)
- [ ] **Step 25:** Click "Link a billing account"
- [ ] **Step 26:** Add credit/debit card (won't be charged unless you exceed $200/month)
- [ ] **Step 27:** ✅ Google Maps ready!

---

### Day 6-7: Add API Keys to Vercel

- [ ] **Step 1:** Go to Vercel Dashboard
- [ ] **Step 2:** Click your "sachabroker" project
- [ ] **Step 3:** Click "Settings" tab
- [ ] **Step 4:** Click "Environment Variables" (left)
- [ ] **Step 5:** Add Variable 1:
  - Name: `SUPABASE_URL`
  - Value: (paste Supabase Project URL)
  - Click "Add"
- [ ] **Step 6:** Add Variable 2:
  - Name: `SUPABASE_ANON_KEY`
  - Value: (paste Supabase Anon Key)
  - Click "Add"
- [ ] **Step 7:** Add Variable 3:
  - Name: `GOOGLE_MAPS_API_KEY`
  - Value: (paste Google Maps API Key)
  - Click "Add"
- [ ] **Step 8:** ✅ WAIT for Razorpay approval first before adding their keys
- [ ] **Step 9:** After Razorpay approved, add Variable 4:
  - Name: `RAZORPAY_KEY_ID`
  - Value: (from Razorpay dashboard)
  - Click "Add"
- [ ] **Step 10:** Add Variable 5:
  - Name: `RAZORPAY_KEY_SECRET`
  - Value: (from Razorpay dashboard)
  - Click "Add"
- [ ] **Step 11:** Click "Deployments" tab (top)
- [ ] **Step 12:** Click "..." on latest deployment
- [ ] **Step 13:** Click "Redeploy"
- [ ] **Step 14:** ✅ All API keys added!

---

## 🎯 WEEK 2: TESTING

### Day 8: Test Website

- [ ] **Step 1:** Open https://sachabroker.cm (if DNS is ready)
- [ ] **Step 2:** OR open your Vercel URL
- [ ] **Step 3:** ✅ Website loads correctly
- [ ] **Step 4:** Click around all pages
- [ ] **Step 5:** Check mobile view (open on phone)
- [ ] **Step 6:** ✅ Everything works

---

### Day 9: Create Test Accounts

- [ ] **Step 1:** Open your website
- [ ] **Step 2:** Create Searcher account:
  - Email: `test-searcher@gmail.com` (use your real email)
  - Password: `Test@1234`
  - Type: Searcher
- [ ] **Step 3:** Verify email
- [ ] **Step 4:** Complete onboarding
- [ ] **Step 5:** ✅ Searcher account works
- [ ] **Step 6:** Logout
- [ ] **Step 7:** Create Lister account:
  - Email: `test-lister@gmail.com` (use your real email)
  - Password: `Test@1234`
  - Type: Lister
- [ ] **Step 8:** Verify email
- [ ] **Step 9:** Complete onboarding
- [ ] **Step 10:** ✅ Lister account works

---

### Day 10: Test Listing Property

- [ ] **Step 1:** Login as Lister
- [ ] **Step 2:** Click "Add Property"
- [ ] **Step 3:** Fill all 7 steps
- [ ] **Step 4:** Upload 3-5 test images
- [ ] **Step 5:** Select "Free Listing"
- [ ] **Step 6:** Publish
- [ ] **Step 7:** ✅ Property published
- [ ] **Step 8:** Check "My Listings"
- [ ] **Step 9:** ✅ Property appears

---

### Day 11: Test Searching

- [ ] **Step 1:** Logout from Lister account
- [ ] **Step 2:** Login as Searcher
- [ ] **Step 3:** Go to "Search Properties"
- [ ] **Step 4:** ✅ Can see the property you listed
- [ ] **Step 5:** Click on property
- [ ] **Step 6:** ✅ Contact info is hidden/blurred
- [ ] **Step 7:** ✅ "Unlock" button shows

---

### Day 12: Test Payments (TEST MODE)

**IMPORTANT:** Make sure Razorpay is in TEST MODE first!

- [ ] **Step 1:** In Razorpay dashboard, check you're in "Test Mode"
- [ ] **Step 2:** As Searcher, click "Unlock Contact" on a property
- [ ] **Step 3:** Payment page opens
- [ ] **Step 4:** Razorpay window opens
- [ ] **Step 5:** Use test card:
  - Card: `4111 1111 1111 1111`
  - CVV: `123`
  - Expiry: Any future date
  - Name: `Test User`
- [ ] **Step 6:** Complete payment
- [ ] **Step 7:** ✅ Payment success page shows
- [ ] **Step 8:** ✅ Contact info is now visible
- [ ] **Step 9:** Check Razorpay dashboard
- [ ] **Step 10:** ✅ Test payment appears

---

### Day 13: Final Checks

- [ ] **Step 1:** Test on different browsers (Chrome, Safari, Firefox)
- [ ] **Step 2:** Test on mobile phone
- [ ] **Step 3:** Test all links work
- [ ] **Step 4:** Check email notifications arrive
- [ ] **Step 5:** Test image uploads work
- [ ] **Step 6:** Test maps load correctly
- [ ] **Step 7:** ✅ Everything works perfectly

---

### Day 14: GO LIVE!

- [ ] **Step 1:** In Razorpay dashboard, switch to "LIVE MODE"
- [ ] **Step 2:** Get LIVE API keys from Razorpay
- [ ] **Step 3:** Update Vercel environment variables:
  - Replace `RAZORPAY_KEY_ID` with LIVE key
  - Replace `RAZORPAY_KEY_SECRET` with LIVE secret
- [ ] **Step 4:** Redeploy on Vercel
- [ ] **Step 5:** ✅ WEBSITE IS LIVE FOR REAL PAYMENTS!
- [ ] **Step 6:** Delete test accounts
- [ ] **Step 7:** Delete test properties
- [ ] **Step 8:** Create your real accounts
- [ ] **Step 9:** Announce on social media
- [ ] **Step 10:** 🎉 START GETTING USERS!

---

## 📊 IMPORTANT NUMBERS TO SAVE

Write these down on paper or in a password manager:

```
VERCEL:
- URL: _________________________________
- Login: GitHub account

SUPABASE:
- Project URL: _________________________________
- Anon Key: _________________________________
- Database Password: _________________________________
- Login: GitHub account

RAZORPAY:
- Test Key ID: _________________________________
- Test Key Secret: _________________________________
- Live Key ID: _________________________________
- Live Key Secret: _________________________________
- Login Email: _________________________________
- Login Password: _________________________________

GOOGLE MAPS:
- API Key: _________________________________
- Project: SachaBroker
- Login: Gmail account

NAMECHEAP:
- Domain: sachabroker.cm
- Login Email: _________________________________
- Login Password: _________________________________
```

---

## 🆘 COMMON PROBLEMS & SOLUTIONS

### Problem 1: Domain not working after 48 hours
**Solution:**
- Check Namecheap DNS records are correct
- Check Vercel domain is added
- Try `www.sachabroker.cm` instead
- Clear browser cache (Ctrl+Shift+Delete)

### Problem 2: Website shows 404 error
**Solution:**
- Check Vercel deployment succeeded
- Check `vercel.json` file exists in your project
- Redeploy from Vercel dashboard

### Problem 3: Images not uploading
**Solution:**
- Check Supabase storage is enabled
- Check file size is under 7MB
- Check file type is JPG/PNG
- Try smaller image first

### Problem 4: Payments not working
**Solution:**
- Check you're in correct mode (TEST or LIVE)
- Check API keys are correct in Vercel
- Check Razorpay account is activated
- Try test card numbers from Razorpay docs

### Problem 5: Maps not showing
**Solution:**
- Check Google Maps API is enabled
- Check billing is enabled (credit card added)
- Check API key has correct restrictions
- Check API key is added to Vercel

### Problem 6: Can't login to accounts
**Solution:**
- Check email is verified
- Try password reset
- Check you're using correct account type
- Clear browser cookies

---

## 📞 WHO TO CONTACT FOR HELP

**Website/Hosting Issues:**
- Vercel Support Chat (instant): https://vercel.com/support

**Database Issues:**
- Supabase Discord (fast response): https://discord.supabase.com

**Payment Issues:**
- Razorpay Phone: 1800-267-5590 (free call)
- Razorpay Email: support@razorpay.com

**Maps Issues:**
- Google Maps Docs: https://developers.google.com/maps/documentation

**Domain Issues:**
- Namecheap Live Chat (24/7): https://www.namecheap.com/support/

---

## ✅ COMPLETION CHECKLIST

Check all these before going live:

**Technical:**
- [ ] Website loads on https://sachabroker.cm
- [ ] Website loads on mobile
- [ ] All pages work
- [ ] Can create accounts
- [ ] Can login/logout
- [ ] Can list properties
- [ ] Can search properties
- [ ] Images upload correctly
- [ ] Maps show correctly
- [ ] Payments work (tested)

**Business:**
- [ ] Razorpay KYC approved
- [ ] Razorpay in LIVE mode
- [ ] Bank account linked to Razorpay
- [ ] Privacy policy page exists
- [ ] Terms & conditions page exists
- [ ] Refund policy page exists
- [ ] Contact page with your email/phone
- [ ] About page with your info

**Legal (India):**
- [ ] GST registration (if required - above ₹20 lakhs/year)
- [ ] Business registration (if company)
- [ ] Terms mention Indian jurisdiction
- [ ] Refund policy follows Indian law
- [ ] Privacy policy mentions data protection

---

## 🎉 YOU'RE DONE!

**Congratulations!** 🎊

You now have a professional real estate platform that:
- ✅ Works on a custom domain
- ✅ Has a database
- ✅ Accepts payments
- ✅ Shows maps
- ✅ Is mobile-friendly
- ✅ Costs only ₹67/month
- ✅ Can handle 1000s of users

**Total cost:** Less than a pizza per month! 🍕

**Now go get those users!** 🚀

---

## 📈 AFTER LAUNCH

Week 1:
- [ ] Share on Facebook, Twitter, Instagram
- [ ] Tell friends and family
- [ ] Post in WhatsApp groups
- [ ] Share on LinkedIn

Month 1:
- [ ] Aim for 10 property listings
- [ ] Aim for 50 registered users
- [ ] Get first payment

Month 3:
- [ ] 50+ properties
- [ ] 500+ users
- [ ] ₹50,000+ revenue

Month 6:
- [ ] 100+ properties
- [ ] 2000+ users
- [ ] ₹2,00,000+ revenue
- [ ] Consider hiring help

Month 12:
- [ ] 500+ properties
- [ ] 10,000+ users
- [ ] ₹10,00,000+ revenue
- [ ] Full-time business! 🎉

**Good luck! You got this!** 💪
