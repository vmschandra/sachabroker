# ❓ Frequently Asked Questions (FAQ)

## 🌐 DEPLOYMENT & DOMAIN

### Q1: When will my domain sachabroker.cm start working?
**A:** 24-48 hours after you update DNS records in Namecheap. Sometimes it can take up to 72 hours. You can check status at: https://www.whatsmydns.net

### Q2: What if my domain doesn't work after 48 hours?
**A:** 
1. Check DNS records in Namecheap are exactly as specified
2. Try opening www.sachabroker.cm (with www)
3. Clear your browser cache (Ctrl+Shift+Delete)
4. Try on a different device/network
5. Contact Namecheap support chat

### Q3: Can I use my Vercel URL instead of the domain?
**A:** Yes! Your Vercel URL (like realestate-abc123.vercel.app) works immediately and you can use it while waiting for your domain to activate.

### Q4: Is Vercel really free forever?
**A:** Yes! The free tier includes:
- Unlimited bandwidth (with fair use)
- 100GB/month bandwidth
- Automatic SSL
- Custom domains
You only need to pay if you exceed these limits or want team features.

---

## 💾 DATABASE & STORAGE

### Q5: How many properties can I store in Supabase free tier?
**A:** The free tier gives you 500MB database and 1GB storage. This is enough for:
- ~1,000 users
- ~100 properties (with 10 photos each at 1MB)
- All your data

### Q6: What happens when I reach the storage limit?
**A:** Supabase will notify you at 80% usage. You have two options:
1. Upgrade to Pro ($25/month) for 100GB
2. Move images to Cloudinary (25GB free)

### Q7: Are my images safe? Will they be deleted?
**A:** Yes, they're safe! Supabase stores them reliably with automatic backups. They won't be deleted unless you delete them.

### Q8: Can I download all my data if I want to move?
**A:** Yes! Supabase lets you export all your data anytime. You own your data 100%.

---

## 💳 PAYMENTS & MONEY

### Q9: When will Razorpay approve my account?
**A:** Usually 24-48 hours if:
- You submitted all correct documents (PAN, Aadhaar)
- Documents are clear and readable
- Bank account is verified
If delayed, email support@razorpay.com

### Q10: How do I know if a payment is real or test?
**A:**
- Test payments: Key starts with `rzp_test_`
- Live payments: Key starts with `rzp_live_`
Always check which key is active in Vercel!

### Q11: When will I get my money from Razorpay?
**A:**
- Standard: 3 business days (T+3) - FREE
- Instant: Same day (T+0) - ₹10 per transaction extra
Money goes directly to your linked bank account.

### Q12: What if a customer wants a refund?
**A:** You can refund from Razorpay dashboard:
1. Login to Razorpay
2. Go to Transactions
3. Find the payment
4. Click "Refund"
5. Money returns to customer in 5-7 days

### Q13: Does Razorpay charge monthly fees?
**A:** NO! Razorpay only charges:
- 2% per successful transaction
- No monthly fees
- No setup fees
- No hidden charges

### Q14: What happens if a payment fails?
**A:** No charges! Razorpay only charges on successful payments. Failed payments are free.

---

## 🗺️ MAPS & LOCATION

### Q15: Will Google Maps charge me money?
**A:** No, if you stay within the free tier:
- You get $200 FREE credit every month
- This equals 28,000 map loads
- Most small businesses never exceed this
- You need to add a card, but it won't be charged unless you exceed $200

### Q16: What if I exceed the free $200 credit?
**A:** Google will email you first. Then:
- You'll be charged only for the excess
- Example: If you use $250, you pay $50
- Set up billing alerts to monitor usage

### Q17: Can I use free maps instead of Google Maps?
**A:** Yes! You can use:
- OpenStreetMap (100% free, unlimited)
- Mapbox (50,000 loads free/month)
But Google Maps is most accurate for India.

---

## 👥 USERS & ACCOUNTS

### Q18: Can the same person be both a searcher and a lister?
**A:** Yes! They need to:
1. Create account as Searcher (email@gmail.com)
2. Create ANOTHER account as Lister (same email@gmail.com)
3. Each account is completely separate
4. They'll have two different dashboards

### Q19: Can I have multiple lister accounts?
**A:** Not with the same email. Each lister needs a unique email. This prevents spam and abuse.

### Q20: What if someone forgets their password?
**A:** Add a "Forgot Password" feature that:
1. Sends reset link to their email
2. They click link
3. They create new password
(This needs to be coded - not included yet)

### Q21: How do I delete a user account?
**A:** From Supabase dashboard:
1. Go to Authentication → Users
2. Find the user
3. Click "..." → Delete user
(Or add a "Delete Account" button in user profile)

---

## 🏠 PROPERTIES & LISTINGS

### Q22: How long do property listings stay active?
**A:**
- Free listings: 30 days
- Featured: 30 days
- Premium: 60 days
After expiry, they're automatically hidden (not deleted).

### Q23: Can listers renew expired listings?
**A:** Yes! They can:
1. Go to "My Listings"
2. Find expired property
3. Click "Renew"
4. Pay renewal fee (if applicable)
5. Property goes live again

### Q24: Can listers edit properties after publishing?
**A:** Yes! They can:
- Edit all details
- Add/remove photos
- Update price
- Change description
Anytime from their dashboard.

### Q25: What if someone lists fake properties?
**A:** You can:
1. Add manual verification (you approve each listing)
2. Add a "Report" button for users
3. Review reports and delete fake listings
4. Ban repeat offenders
Start with manual checks for first 50-100 properties.

---

## 📸 IMAGES & UPLOADS

### Q26: What if a photo is larger than 7MB?
**A:** The system will reject it and show error: "Image too large. Maximum 7MB."
User needs to compress the image first using:
- TinyPNG.com
- Compressor.io
- Or phone's built-in compression

### Q27: Can I change the 7MB limit?
**A:** Yes! In your code, change:
```javascript
MAX_IMAGE_SIZE_MB = 10 // or any number
```
But larger images = more storage used = higher costs.

### Q28: What image formats are allowed?
**A:** By default:
- JPG/JPEG ✅
- PNG ✅
- WebP ✅
- GIF ❌ (too large)
- HEIC ❌ (not web-compatible)

### Q29: Can listers reorder photos?
**A:** Yes! Add drag-and-drop functionality:
- Drag photo to new position
- First photo = cover photo
- Cover photo shows in search results

---

## 💰 PRICING & BUSINESS

### Q30: Can I change my pricing (₹299, ₹999, etc.)?
**A:** Yes! Update in `.env.template` file:
```
SINGLE_CONTACT_PRICE=399  (changed from 299)
SUBSCRIPTION_BASIC_PRICE=1299  (changed from 999)
```
Then redeploy on Vercel.

### Q31: Should I make listings free or paid?
**A:** Start with:
- FREE basic listings (to attract listers)
- PAID featured/premium (for extra visibility)
Later, you can charge for all listings once you have lots of users.

### Q32: How much can I realistically earn?
**A:** Conservative estimates:
- Month 1: ₹5,000-10,000
- Month 3: ₹50,000-1,00,000
- Month 6: ₹2,00,000-3,00,000
- Month 12: ₹5,00,000-10,00,000
Depends on marketing and user acquisition.

### Q33: Do I need GST registration?
**A:** In India:
- Under ₹20 lakhs/year revenue: Optional
- Above ₹20 lakhs/year: Mandatory
- Services: 18% GST applies
Start without GST, register when you cross ₹20L annually.

---

## 🔐 SECURITY & PRIVACY

### Q34: Are passwords secure?
**A:** Yes! Passwords are:
- Hashed using SHA-256 (one-way encryption)
- Never stored in plain text
- Can't be decrypted
- Even you can't see user passwords

### Q35: Can hackers steal payment information?
**A:** No! Because:
- Payments go through Razorpay (PCI DSS certified)
- You never handle card numbers
- All data is encrypted (HTTPS)
- Razorpay handles all security

### Q36: Where is my data stored?
**A:** Supabase servers in:
- Mumbai, India (if you chose South Asia region)
- Data never leaves India
- Complies with Indian data protection laws

### Q37: What if someone hacks my website?
**A:** Prevention:
- Use strong passwords for all accounts
- Enable 2FA on Vercel, Supabase, Razorpay
- Never share API keys
- Use environment variables (not hardcoded)
- Keep keys in Vercel, not in GitHub

---

## 📱 MOBILE & RESPONSIVE

### Q38: Will my website work on mobile phones?
**A:** Yes! It's responsive and works on:
- Android phones
- iPhones
- Tablets
- Desktop computers
All screen sizes are supported.

### Q39: Do I need a mobile app?
**A:** No! Your website works like an app:
- Users can "Add to Home Screen"
- Works offline (partially)
- Looks like a native app
- No need for Play Store/App Store

### Q40: Can I create a mobile app later?
**A:** Yes! You can:
1. Use React Native (code once, works on iOS + Android)
2. Use Flutter
3. Convert website to PWA (Progressive Web App)
But start with website first!

---

## 🚀 PERFORMANCE & SPEED

### Q41: Will my website be fast?
**A:** Yes! Because:
- Vercel uses CDN (Content Delivery Network)
- Images cached globally
- Loads in < 2 seconds worldwide
- Optimized for mobile networks

### Q42: What if too many users visit at once?
**A:** Vercel auto-scales:
- Can handle 1000s of concurrent users
- No downtime
- No need to upgrade
- Stays fast even during traffic spikes

---

## 📧 NOTIFICATIONS & COMMUNICATION

### Q43: Will users get email notifications?
**A:** Yes! Supabase sends:
- Account verification emails
- Password reset emails
- Payment confirmations
You can customize these emails.

### Q44: Can I send SMS notifications?
**A:** Yes! Integrate:
- Twilio (international)
- MSG91 (India-specific, cheaper)
- Fast2SMS (India)
Cost: ~₹0.15-0.50 per SMS

### Q45: Can users get WhatsApp notifications?
**A:** Yes! Using:
- WhatsApp Business API (expensive, needs approval)
- Twilio WhatsApp API
- Or simple: Show WhatsApp link to contact seller

---

## 🎨 DESIGN & CUSTOMIZATION

### Q46: Can I change the colors and design?
**A:** Yes! Edit `styles.css`:
```css
:root {
  --primary-color: #1e3a8a;  /* Change this */
  --secondary-color: #3b82f6;  /* And this */
}
```
Save and redeploy.

### Q47: Can I change the logo?
**A:** Yes! Replace logo in:
- Header: Edit HTML in `index.html`
- Upload your logo image
- Update image path

### Q48: Can I add more features?
**A:** Yes! Some ideas:
- Property comparison tool
- Mortgage calculator
- Virtual tours (360° photos)
- Chat between users
- Reviews and ratings
- Saved searches
- Email alerts for new properties

---

## 🆘 TROUBLESHOOTING

### Q49: Website shows "500 Internal Server Error"
**Solution:**
1. Check Vercel deployment succeeded
2. Check all environment variables are set
3. Check Supabase is running
4. Check browser console for errors (F12)
5. Redeploy from Vercel

### Q50: Images not loading
**Solution:**
1. Check Supabase storage is enabled
2. Check storage bucket is public
3. Check image URLs are correct
4. Check file size under 7MB
5. Try uploading a small test image (100KB)

### Q51: Payments stuck on loading
**Solution:**
1. Check Razorpay keys are correct
2. Check you're using right mode (test/live)
3. Check Razorpay account is active
4. Try test card: 4111 1111 1111 1111
5. Check browser console for errors

### Q52: Maps not showing
**Solution:**
1. Check Google Maps API is enabled
2. Check billing is enabled (card added)
3. Check API key is correct
4. Check API restrictions allow your domain
5. Check browser console for API errors

### Q53: "Database connection failed"
**Solution:**
1. Check Supabase project is running
2. Check Supabase URL is correct
3. Check Supabase key is correct
4. Check you copied the FULL key (very long)
5. Check Supabase isn't paused (free tier pauses after 7 days inactivity)

---

## 📞 WHEN TO CONTACT SUPPORT

**Contact Vercel if:**
- Website not deploying
- Domain not connecting
- 502 Bad Gateway errors

**Contact Supabase if:**
- Database connection fails
- Storage not working
- Can't create tables

**Contact Razorpay if:**
- Account not approved after 3 days
- Payments failing
- Settlements delayed
- Refund issues

**Contact Google if:**
- Maps quota exceeded
- Billing issues
- API not working

**Contact Namecheap if:**
- Domain not resolving after 72 hours
- DNS issues
- Domain transfer issues

---

## 💡 BEST PRACTICES

### Q54: Should I backup my data?
**A:** Yes! Supabase has automatic backups, but also:
1. Export data monthly (Supabase → Database → Export)
2. Save to Google Drive / Dropbox
3. Keep copy locally
4. Pro plan has daily backups included

### Q55: How often should I update my website?
**A:**
- Security updates: Immediately
- Feature updates: Monthly
- Content updates: Weekly
- Check for issues: Daily (first month)

### Q56: Should I announce before or after launch?
**A:** AFTER! Launch sequence:
1. Test everything thoroughly
2. Create 5-10 test properties
3. Test all features work
4. THEN announce on social media
5. Be ready for support questions

---

## 🎯 SUCCESS TIPS

### Q57: How do I get my first users?
**A:**
1. List 10 properties yourself (ask friends/family)
2. Post in local WhatsApp groups
3. Share on Facebook community groups
4. Tell local real estate agents
5. Offer first month free to early adopters

### Q58: How do I get my first payment?
**A:**
1. Have at least 20 quality listings
2. Promote on social media
3. Run small Facebook ad (₹500)
4. Offer discount: "First 100 users get ₹99 instead of ₹299"
5. Follow up with users who saved properties

### Q59: When should I quit my job?
**A:** Only when:
- ✅ Earning 3x your current salary consistently for 6 months
- ✅ Have 6 months emergency fund saved
- ✅ Website is stable and profitable
- ✅ Have someone to help with support
Don't rush! Grow gradually.

---

## 📚 LEARNING RESOURCES

**Want to learn more?**

**For Vercel:**
- Docs: https://vercel.com/docs
- YouTube: Search "Vercel deployment tutorial"

**For Supabase:**
- Docs: https://supabase.com/docs
- YouTube: Search "Supabase tutorial"

**For Razorpay:**
- Docs: https://razorpay.com/docs
- YouTube: Search "Razorpay integration"

**For Google Maps:**
- Docs: https://developers.google.com/maps
- YouTube: Search "Google Maps API tutorial"

**For Web Development:**
- FreeCodeCamp: https://freecodecamp.org
- W3Schools: https://w3schools.com
- YouTube: Lots of free tutorials!

---

## ❓ STILL HAVE QUESTIONS?

Create a file called `QUESTIONS.txt` in your project and write down:
- Your question
- What you tried
- What error you got
- Screenshots (if any)

Then ask for help:
- Vercel Discord
- Supabase Discord
- Reddit: r/webdev
- Stack Overflow

**Remember: No question is stupid! Everyone started as a beginner.** 🌟

---

**Last Updated:** February 27, 2026
**For:** SachaBroker (sachabroker.cm)
**Version:** 1.0
