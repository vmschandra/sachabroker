# 🚀 SachaBroker - Complete Deployment Guide

## Step 1: Create Vercel Account (5 minutes)

1. Go to: https://vercel.com
2. Click "Sign Up"
3. Click "Continue with GitHub"
4. Login to GitHub
5. Click "Authorize Vercel"
6. ✅ Done!

## Step 2: Deploy to Vercel (3 minutes)

1. In Vercel, click "Add New..." button (top right)
2. Click "Project"
3. Find "realestate" in your repositories list
4. Click "Import"
5. Click "Deploy" (bottom)
6. Wait 30 seconds
7. ✅ Your site is LIVE!

You'll get a URL like: `https://realestate-abc123.vercel.app`

## Step 3: Connect Your Domain (sachabroker.cm)

### On Namecheap:

1. Login to Namecheap.com
2. Click "Domain List"
3. Click "Manage" next to sachabroker.cm
4. Click "Advanced DNS" tab
5. Delete any existing A, CNAME records
6. Add these NEW records:

**Record 1:**
- Type: `A Record`
- Host: `@`
- Value: `76.76.19.19`
- TTL: Automatic
- Click ✓ (Save)

**Record 2:**
- Type: `CNAME Record`
- Host: `www`
- Value: `cname.vercel-dns.com.`
- TTL: Automatic
- Click ✓ (Save)

7. Wait 5 minutes for records to save

### On Vercel:

1. Go to your project in Vercel
2. Click "Settings" tab (top)
3. Click "Domains" (left sidebar)
4. In the input box, type: `sachabroker.cm`
5. Click "Add"
6. Type: `www.sachabroker.cm`
7. Click "Add"
8. ✅ Done!

**WAIT:** 24-48 hours for domain to work

Your site will be at: **https://sachabroker.cm**

---

## Step 4: Setup Database (Supabase) - 10 minutes

1. Go to: https://supabase.com
2. Click "Start your project"
3. Click "Sign in with GitHub"
4. Authorize Supabase
5. Click "New Project"
6. Fill in:
   - Name: `sachabroker`
   - Database Password: (create a strong password, SAVE IT!)
   - Region: Mumbai (closest to India)
7. Click "Create new project"
8. Wait 2 minutes for setup
9. ✅ Database created!

### Get Your Database Keys:

1. In Supabase, click "Settings" (gear icon)
2. Click "API"
3. Find and COPY these (save in notepad):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon Public Key**: `eyJhbGc...` (long text)

You'll need these later!

---

## Step 5: Setup Payment Gateway (Razorpay) - 2 days

### Create Razorpay Account:

1. Go to: https://razorpay.com
2. Click "Sign Up"
3. Fill in:
   - Business Name: SachaBroker
   - Your Name
   - Email
   - Phone
4. Click "Get Started"
5. Verify email and phone
6. Complete KYC:
   - Upload PAN card
   - Upload Aadhaar
   - Bank account details
   - Business details
7. Wait 1-2 days for approval
8. ✅ Account activated!

### Get Razorpay Keys:

1. Login to Razorpay Dashboard
2. Click "Settings"
3. Click "API Keys"
4. Click "Generate Test Key" (for testing)
5. COPY and SAVE:
   - **Key ID**: `rzp_test_xxxxx`
   - **Key Secret**: `xxxxx`

**Important:** Use TEST keys first, then switch to LIVE keys when ready!

---

## Step 6: Setup Google Maps API (30 minutes)

1. Go to: https://console.cloud.google.com
2. Sign in with Gmail
3. Click "Select a project" (top)
4. Click "NEW PROJECT"
5. Name: `SachaBroker`
6. Click "Create"
7. Wait 30 seconds
8. In search bar (top), type: "Maps JavaScript API"
9. Click "Maps JavaScript API"
10. Click "Enable"
11. Go back, search: "Geocoding API"
12. Click "Enable"
13. Go back, search: "Places API"
14. Click "Enable"
15. Click "Credentials" (left sidebar)
16. Click "Create Credentials" > "API Key"
17. COPY your API Key: `AIzaSyxxxxx`
18. Click "Restrict Key"
19. Under "Application restrictions":
    - Select "HTTP referrers"
    - Add: `https://sachabroker.cm/*`
    - Add: `https://*.vercel.app/*`
20. Click "Save"
21. ✅ Google Maps ready!

### Enable Billing (Required for free tier):

1. In Google Cloud Console
2. Click "Billing" (left menu)
3. Click "Link a billing account"
4. Add credit/debit card
5. ✅ You get $200 FREE credit every month!

**Note:** You won't be charged unless you exceed $200/month usage

---

## Step 7: Add Environment Variables to Vercel

1. Go to Vercel Dashboard
2. Click your "realestate" project
3. Click "Settings" tab
4. Click "Environment Variables"
5. Add these one by one:

**Variable 1:**
- Name: `SUPABASE_URL`
- Value: (paste your Supabase Project URL)
- Click "Add"

**Variable 2:**
- Name: `SUPABASE_ANON_KEY`
- Value: (paste your Supabase Anon Key)
- Click "Add"

**Variable 3:**
- Name: `RAZORPAY_KEY_ID`
- Value: (paste your Razorpay Key ID)
- Click "Add"

**Variable 4:**
- Name: `RAZORPAY_KEY_SECRET`
- Value: (paste your Razorpay Key Secret)
- Click "Add"

**Variable 5:**
- Name: `GOOGLE_MAPS_API_KEY`
- Value: (paste your Google Maps API Key)
- Click "Add"

6. Click "Redeploy" button (top right)
7. ✅ Done!

---

## 📊 Summary - What You Have Now:

✅ Website deployed on Vercel
✅ Custom domain: sachabroker.cm
✅ Database: Supabase (1GB free)
✅ Image Storage: Supabase (1GB free = ~150 property listings)
✅ Payments: Razorpay (ready for Indian payments)
✅ Maps: Google Maps (28,000 free loads/month)

## 💰 Monthly Costs:

**FREE TIER (First 3-6 months):**
- Vercel: FREE
- Supabase: FREE (up to 500MB DB + 1GB storage)
- Google Maps: FREE (up to $200 credit/month)
- Razorpay: 0% monthly (2% per transaction only)
- Domain: Already paid

**TOTAL: ₹0/month** (only pay 2% on actual transactions)

**WHEN YOU GROW (100+ properties):**
- Vercel: Still FREE
- Supabase: ₹1,650/month (100GB storage)
- Google Maps: Still FREE (within $200 credit)
- Razorpay: Still 2% per transaction
- Domain: ₹800/year renewal

**TOTAL: ₹1,650/month**

---

## 🎯 Next Steps After Deployment:

1. Test your website: https://sachabroker.cm
2. Create test accounts (searcher + lister)
3. Test listing a property
4. Test searching properties
5. Test payment flow (use Razorpay test mode)
6. Once everything works:
   - Switch Razorpay to LIVE mode
   - Announce your website!
   - Start getting real users

---

## ⚠️ IMPORTANT REMINDERS:

1. **Save all your passwords and API keys** in a safe place
2. **Never share** your API secrets publicly
3. **Test everything** before going live
4. **Start with Razorpay TEST mode**, switch to LIVE when ready
5. **Monitor your usage** on Supabase and Google Cloud
6. **Backup your database** regularly (Supabase has auto-backups)

---

## 🆘 If Something Goes Wrong:

**Website not loading?**
- Wait 48 hours for domain DNS to propagate
- Try: https://realestate-abc123.vercel.app (your Vercel URL)

**Domain not connecting?**
- Check Namecheap DNS records are correct
- Check Vercel domain settings
- Wait 24-48 hours

**Database not working?**
- Check Supabase project is running
- Check API keys are correct in Vercel
- Check you copied the FULL key (very long text)

**Payments not working?**
- Make sure you're using TEST keys first
- Check Razorpay dashboard for errors
- Test with Razorpay test card numbers

---

## 📞 Support:

- Vercel: https://vercel.com/support
- Supabase: https://supabase.com/docs
- Razorpay: https://razorpay.com/support
- Google Maps: https://developers.google.com/maps/support

Good luck! 🚀
