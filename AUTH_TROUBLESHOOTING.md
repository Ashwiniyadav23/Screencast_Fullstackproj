# Authentication Troubleshooting Guide

Having login or signup issues? Follow this guide to diagnose and fix the problem.

## Common Issues & Solutions

### 1. "Invalid email or password" When Logging In

**Possible Causes:**
- Account not created yet (try signing up first)
- Email or password has extra spaces
- Email confirmation required but not done
- Wrong credentials entered

**Solutions:**
- ✅ Double-check your email and password (copy-paste to verify)
- ✅ Check your email for a confirmation link if you just signed up
- ✅ Try signing up again if you haven't created an account yet
- ✅ Check browser console (F12) for detailed error messages

### 2. "Email Not Confirmed" Error

**What it means:** You signed up but haven't confirmed your email yet.

**Solutions:**
1. **Check your inbox** for an email from noreply@mail.supabase.io
2. **Look in SPAM/JUNK folder** if not in inbox
3. **Click the confirmation link** in the email
4. **Try logging in again** after confirming

**If you didn't receive the email:**
1. Check that your email address is correct
2. Wait a few minutes (emails can be delayed)
3. Try signing up again with the correct email

### 3. Account Created but Can't Login

**Possible Causes:**
- Email confirmation is required (see #2 above)
- Password is case-sensitive
- Extra spaces in email or password

**Solutions:**
- ✅ Check for confirmation email
- ✅ Ensure CAPS LOCK is off
- ✅ Copy-paste credentials to avoid typos
- ✅ Clear browser cache and cookies
- ✅ Try incognito/private browser window

### 4. Account Already Exists Error

**What it means:** Someone already signed up with this email.

**Solutions:**
- ✅ Try logging in instead of signing up
- ✅ Use "Forgot Password" if you don't remember your password
- ✅ Use a different email to create a new account

## Check Supabase Configuration

### Email Verification Settings

Email confirmation might be **required** in your Supabase project settings:

1. **Go to Supabase Dashboard** → https://app.supabase.co
2. **Select your project**
3. **Settings** → **Authentication**
4. Look for **Email verification** setting
5. If set to "**Double opt-in**" or "**Single opt-in**", email confirmation is required

#### To disable email confirmation (Quick Setup):
1. **Settings** → **Authentication**
2. **Email Provider** section → **Enable email provider** 
3. Set **Email Verification** to "**Implicit**" (no email confirmation required)
4. Click **Save**

### Check Auth Logs

To see what's happening with authentication:

1. **Supabase Dashboard** → Your project
2. **Authentication** → **Users** section
3. Look for your user account - check status
4. Click on it to see signup/login history

## Test Authentication Locally

To verify everything is working:

1. **Open browser DevTools** (Press F12)
2. **Go to Console tab**
3. **Refresh the page** and watch for auth-related messages
4. Any errors will show up in the console

Look for messages like:
- `Login response:` - shows success/error
- `Signup response:` - shows success/error
- Any `StorageApiError` or `AuthApiError` messages

## Reset & Start Fresh

If nothing works, try resetting:

1. **Clear browser cache** (Ctrl+Shift+Delete or Cmd+Shift+Delete)
2. **Clear localStorage** - Open DevTools Console and run:
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```
3. **Refresh page** (Ctrl+F5 or Cmd+Shift+R)
4. **Try signing up again**

## Verify Credentials Are Entered Correctly

### Password Requirements
- ✅ Minimum 6 characters
- ✅ Can contain uppercase, lowercase, numbers, symbols
- Example: `MyPass123!`

### Email Format
- ✅ Must be valid email format
- ✅ Example: `user@example.com`
- ✅ Not case-sensitive but avoid extra spaces

## Check Network & Internet

1. **Verify internet connection** - Open https://google.com
2. **Check Supabase status** - https://status.supabase.com
3. **Try different browser** to rule out browser issues
4. **Disable VPN/Proxy** if you're using one

## Still Having Issues?

1. **Check the browser console** (F12) for exact error messages
2. **Screenshot the error** for reference
3. **Try the troubleshooting steps above**
4. **Create a GitHub issue** with:
   - Your exact error message
   - Steps to reproduce
   - Screenshot of console errors

## Success Indicators ✓

You'll know it's working when:
- ✅ Signup completes and shows "Account Created!"
- ✅ You can log in and see the recording page
- ✅ Navbar shows your email address
- ✅ You can navigate to Dashboard and Record pages

---

Need more help? Check the official Supabase Auth docs: https://supabase.com/docs/guides/auth
