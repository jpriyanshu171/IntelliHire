# Tailwind CSS Not Showing - Troubleshooting Guide

## Quick Fix Steps:

### 1. **Hard Refresh Browser**
   - Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - This clears browser cache

### 2. **Check Browser Console**
   - Press `F12` to open DevTools
   - Go to "Console" tab
   - Look for any CSS loading errors

### 3. **Verify CSS is Loading**
   - In DevTools, go to "Network" tab
   - Refresh the page
   - Look for `index.css` or similar CSS file
   - Click on it and check if Tailwind classes are present

### 4. **Restart Dev Server**
   ```bash
   # Stop the current server (Ctrl+C in terminal)
   cd frontend
   npm run dev
   ```

### 5. **Clear Node Cache (if still not working)**
   ```bash
   cd frontend
   rm -rf node_modules/.vite
   npm run dev
   ```

## Verification:

Open browser console and run:
```javascript
// Check if Tailwind classes exist
document.querySelector('style[data-vite-dev-id*="index.css"]')
```

If you see styles, Tailwind is working. If not, there's a build issue.

## Expected Behavior:

You should see:
- ✅ White background (`bg-slate-50`)
- ✅ Styled header with shadow
- ✅ Blue links and buttons
- ✅ Proper spacing and padding
- ✅ Responsive layout

If you only see:
- ❌ Plain HTML with no colors
- ❌ No spacing/padding
- ❌ Default browser styles

Then Tailwind is not loading.
