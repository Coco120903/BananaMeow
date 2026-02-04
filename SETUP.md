# Setup Instructions - Banana Meow

This guide will help you get the Banana Meow project running on your local machine.

---

## 📥 How to Clone This Repository

### Step 1: Clone the Repository

Open your terminal/PowerShell and run:

```bash
git clone https://github.com/Coco120903/BananaMeow.git
```

### Step 2: Navigate to Project Folder

```bash
cd BananaMeow
```

### Step 3: Install Dependencies

```bash
# Install root dependencies (for running both frontend and backend)
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

### Step 4: Set Up Environment Variables

Create a file named `.env` in the `backend` folder:

**Windows PowerShell:**
```bash
cd backend
New-Item -ItemType File -Name .env
```

**Or use your text editor** to create `backend/.env`

Add these variables to `backend/.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/banana-meow
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
FRONTEND_URL=http://localhost:5173
```

**Note**: 
- Replace `MONGO_URI` with your MongoDB connection string if using MongoDB Atlas
- Replace `STRIPE_SECRET_KEY` with your Stripe test key (get from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys))

### Step 5: Run the Application

From the root directory (`BananaMeow`):

```bash
npm run dev
```

This will start both:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

## 🔄 Daily Workflow

### Before Starting Work (Always Do This First!)

```bash
# Pull latest changes from GitHub
git pull origin main
```

### Making Changes and Pushing

```bash
# 1. See what files you changed
git status

# 2. Add your changes
git add .

# 3. Commit with a descriptive message
git commit -m "Add: description of what you did"

# 4. Push to GitHub
git push origin main
```

### Example Commit Messages

- `"Add: login page functionality"`
- `"Fix: cart button alignment"`
- `"Update: cat card styling"`
- `"Fix: donation validation bug"`

---

## 🛠️ Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend

### Frontend (`cd frontend`)
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend (`cd backend`)
- `npm run dev` - Start backend with nodemon
- `npm start` - Start backend server
- `npm run seed:cats` - Seed database with cat data

---

## 🐛 Troubleshooting

### Port Already in Use

If port 5000 or 5173 is already in use:

**Option 1**: Change the port in `backend/.env`:
```
PORT=5001
```

**Option 2**: Stop the process using that port:
```bash
# Windows PowerShell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB Connection Error

**If using local MongoDB:**
- Make sure MongoDB is running
- Check that the connection string is correct

**If using MongoDB Atlas:**
- Update `MONGO_URI` in `backend/.env` with your Atlas connection string
- Make sure your IP is whitelisted in Atlas

### Module Not Found Errors

```bash
# Delete node_modules and reinstall
# Windows PowerShell
Remove-Item -Recurse -Force node_modules, frontend/node_modules, backend/node_modules
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### Git Permission Issues

If you get "dubious ownership" error:
```bash
git config --global --add safe.directory E:/Projects2026/BananaMeow
```

### Environment Variables Not Loading

- Make sure `.env` file is in the `backend` folder (not root)
- Restart the development server after creating/modifying `.env`
- Don't commit `.env` files to Git (they're in .gitignore)

---

## ⚠️ Important Notes

1. **Always pull before you push** - Avoid conflicts with team members
   ```bash
   git pull origin main
   ```

2. **Don't commit `.env` files** - They contain sensitive data (already in .gitignore)

3. **Don't commit `node_modules`** - Already in .gitignore

4. **Write clear commit messages** - Help your team understand changes

5. **Test before pushing** - Make sure your changes work locally

---

## 📞 Need Help?

- Check the [Git Documentation](https://git-scm.com/doc)
- Review [GitHub Guides](https://guides.github.com/)
- Ask your team members!
- Check the main [README.md](./README.md) for project overview

---

**Happy coding! 🐱👑**
