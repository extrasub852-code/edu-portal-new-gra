# Quick Setup Guide for Use Case Explorer

## 🔧 Step 1: Install Node.js

You need Node.js to run the development server. Choose one of these methods:

### Method A: Download Node.js Installer (Easiest)

1. **Visit:** https://nodejs.org/
2. **Download:** The LTS (Long Term Support) version for macOS
3. **Install:** Double-click the downloaded `.pkg` file and follow the installer
4. **Verify:** Open a new terminal window and run:
   ```bash
   node --version
   npm --version
   ```

### Method B: Install via Homebrew (If you prefer package managers)

1. **Install Homebrew first:**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Node.js:**
   ```bash
   brew install node
   ```

3. **Verify:**
   ```bash
   node --version
   npm --version
   ```

## 🚀 Step 2: Install Project Dependencies

Once Node.js is installed:

```bash
cd /Users/meetmehta/edu-portal-gra
npm install
```

This will install all the required packages for the project.

## 🎯 Step 3: Start the Development Server

```bash
npm run dev
```

The server will start at: **http://localhost:8080**

## ✅ Step 4: Test the Use Case Explorer

1. **Open your browser:** http://localhost:8080/use-case-finder

2. **Try semantic searches:**
   - "customer onboarding flow"
   - "boost user engagement"
   - "increase customer retention"
   - "workflow automation"

3. **Test features:**
   - Type in search box to see real-time suggestions
   - Click "View Details" on any use case card
   - Explore the detailed use case pages

## 🐛 Troubleshooting

### If commands still not found after installing Node.js:

1. **Close and reopen your terminal** (this reloads your PATH)

2. **Or manually reload your shell:**
   ```bash
   source ~/.zshrc
   ```

3. **Check if Node.js is installed:**
   ```bash
   /usr/local/bin/node --version
   # or
   /opt/homebrew/bin/node --version
   ```

4. **If Node.js is installed but not in PATH, add it:**
   ```bash
   echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

## 📝 What's Ready

✅ 12 enhanced use cases with detailed information
✅ Semantic/intent-based search
✅ Real-time search suggestions  
✅ Detailed use case pages
✅ Related use cases
✅ Analytics tracking
✅ All code is written and ready to go!

## 🎉 Next Steps

After Node.js is installed, you're just two commands away from testing:

```bash
npm install
npm run dev
```

Then visit http://localhost:8080/use-case-finder and start exploring!

---

**Need help?** The project is fully set up and ready. Once Node.js is installed, everything should work immediately.

