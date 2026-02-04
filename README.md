# Banana Meow 🐱👑

A fully responsive, mobile-first MERN stack web application for a brand called Banana Meow, featuring 12 British Shorthair cats with a cute, royal, and slightly dramatic personality.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** installed ([Download here](https://nodejs.org/))
- **Git** installed ([Download here](https://git-scm.com/downloads))
- **MongoDB** running locally or MongoDB Atlas account

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

```bash
# Navigate to backend folder
cd backend

# Create .env file (Windows PowerShell)
New-Item -ItemType File -Name .env

# Or use your text editor to create backend/.env
```

Add these variables to `backend/.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/banana-meow
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
FRONTEND_URL=http://localhost:5173
```

**Note**: Replace `MONGO_URI` with your MongoDB connection string if using MongoDB Atlas.

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

## 📁 Project Structure

```
BananaMeow/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context (Cart, Auth)
│   │   └── ...
│   └── package.json
├── backend/           # Node.js + Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Mongoose models
│   │   └── ...
│   └── package.json
└── package.json       # Root package (concurrently)
```

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

## 🎯 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Lucide Icons
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Payments**: Stripe (test mode)

---

## ⚠️ Important Notes

1. **Always pull before you push** - Avoid conflicts with team members
2. **Don't commit `.env` files** - They contain sensitive data (already in .gitignore)
3. **Don't commit `node_modules`** - Already in .gitignore
4. **Write clear commit messages** - Help your team understand changes

---

## 🐛 Troubleshooting

### Port Already in Use
If port 5000 or 5173 is already in use:
- Change `PORT` in `backend/.env`
- Or stop the process using that port

### MongoDB Connection Error
- Make sure MongoDB is running locally, or
- Update `MONGO_URI` in `backend/.env` with your MongoDB Atlas connection string

### Module Not Found Errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

---

## 📞 Need Help?

- Check the [Git Documentation](https://git-scm.com/doc)
- Review [GitHub Guides](https://guides.github.com/)
- Ask your team members!

---

**Happy coding! 🐱👑**
