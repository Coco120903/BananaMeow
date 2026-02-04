# Banana Meow - GitHub Setup Guide

## 🚀 Getting Started with GitHub

This guide will help you and your groupmates set up GitHub for collaborative development.

---

## 📋 Prerequisites

- Git installed on your computer ([Download Git](https://git-scm.com/downloads))
- GitHub account ([Sign up here](https://github.com/signup))
- GitHub Desktop (optional, but easier for beginners) ([Download here](https://desktop.github.com/))

---

## 🔧 Initial Setup (One Person Does This First)

### Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Name it: `BananaMeow` (or any name you prefer)
4. Choose **Public** or **Private**
5. **DO NOT** check "Initialize with README" (we already have files)
6. Click **"Create repository"**

### Step 2: Initialize Git in Your Project

Open terminal/PowerShell in your project folder (`E:\Projects2026\BananaMeow`) and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Banana Meow project"

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/BananaMeow.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note**: You'll be asked to enter your GitHub username and password (or use a Personal Access Token).

---

## 👥 For Your Groupmates (Cloning the Repository)

### Step 1: Clone the Repository

1. Go to your GitHub repository page
2. Click the green **"Code"** button
3. Copy the HTTPS URL
4. Open terminal/PowerShell where you want the project
5. Run:

```bash
git clone https://github.com/YOUR_USERNAME/BananaMeow.git
cd BananaMeow
```

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 3: Create Environment Files

Create `backend/.env` file:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/banana-meow
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
FRONTEND_URL=http://localhost:5173
```

---

## 🔄 Daily Workflow: Push and Pull

### Before Starting Work (Always Do This First!)

```bash
# Pull latest changes from GitHub
git pull origin main
```

### Making Changes

1. **Work on your feature/bug fix**
2. **Test your changes**
3. **When ready to save:**

```bash
# See what files you changed
git status

# Add your changes
git add .

# Commit with a descriptive message
git commit -m "Add: description of what you did"

# Push to GitHub
git push origin main
```

### Example Commit Messages

- `"Add: login page functionality"`
- `"Fix: cart button alignment"`
- `"Update: cat card styling"`
- `"Fix: donation validation bug"`

---

## ⚠️ Important Rules for Team Collaboration

### 1. Always Pull Before You Push
```bash
git pull origin main
# Fix any conflicts if they occur
git push origin main
```

### 2. Don't Commit These Files
- `node_modules/` (already in .gitignore)
- `.env` files (already in .gitignore)
- Personal IDE settings

### 3. Communicate Before Major Changes
- Let your team know if you're working on a big feature
- Use branches for major features (see below)

### 4. Write Clear Commit Messages
- Be descriptive: "Add quantity selector to shop page"
- Not vague: "changes" or "fix"

---

## 🌿 Using Branches (Advanced - Optional)

For bigger features, use branches to avoid conflicts:

```bash
# Create a new branch
git checkout -b feature-name

# Work on your feature
# ... make changes ...

# Commit your changes
git add .
git commit -m "Add: feature description"

# Push branch to GitHub
git push origin feature-name
```

Then create a Pull Request on GitHub to merge into main.

---

## 🔍 Common Git Commands

```bash
# Check status of your files
git status

# See what changed
git diff

# Undo changes to a file (before committing)
git checkout -- filename

# See commit history
git log

# Update from GitHub
git pull origin main

# Send changes to GitHub
git push origin main
```

---

## 🐛 Troubleshooting

### "Your branch is behind origin/main"
```bash
git pull origin main
```

### "Merge conflict"
1. Open the conflicted file
2. Look for `<<<<<<<`, `=======`, `>>>>>>>` markers
3. Keep the code you want, remove the markers
4. Save the file
5. Run: `git add .` then `git commit -m "Resolve merge conflict"`

### "Permission denied"
- Make sure you're added as a collaborator on GitHub
- Repository owner: Settings → Collaborators → Add people

### "Nothing to commit"
- Your changes are already committed
- Or you haven't made any changes

---

## 📝 Quick Reference

**Daily workflow:**
```bash
git pull          # Get latest changes
# ... work on code ...
git add .         # Stage changes
git commit -m "message"  # Save changes
git push          # Upload to GitHub
```

**First time setup:**
```bash
git clone https://github.com/USERNAME/BananaMeow.git
cd BananaMeow
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

---

## 🎯 Best Practices

1. ✅ **Pull before you start working**
2. ✅ **Commit often** (small commits are better)
3. ✅ **Write clear commit messages**
4. ✅ **Test before pushing**
5. ✅ **Communicate with your team**
6. ❌ **Don't commit `.env` files**
7. ❌ **Don't commit `node_modules`**
8. ❌ **Don't force push to main**

---

## 💡 Need Help?

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [GitHub Desktop Guide](https://docs.github.com/en/desktop)

---

**Happy coding! 🐱👑**
