# Banana Meow 🐱👑

> A fully responsive, mobile-first MERN stack web application for a brand called Banana Meow, featuring 12 British Shorthair cats with a cute, royal, and slightly dramatic personality.

---

## 🎯 About Banana Meow

Banana Meow is a complete e-commerce and donation platform dedicated to 12 chonky British Shorthair cats. The brand combines humor, cuteness, and royal elegance with a slightly dramatic flair - perfectly captured in the tagline: **"Luxury cats with unemployed energy"**.

### The Name Origin

The name "Banana Meow" comes from the three founding cats:
- **Ba** - Bane
- **Na** - Nana  
- **AN** - Angela (reversed)

Together, they form the royal court that inspired this entire platform.

---

## ✨ Features

### 🐱 Meet the 12 Royals
- Individual profiles for each cat with personality traits, fun facts, and favorite things
- Beautiful card-based layout with image placeholders
- Direct "Support Me" buttons linking to donation page

### 💖 Donation System
- **Cat Selection**: Choose which royal to support
- **Donation Types**:
  - 🍗 Cat Food (Feed a Chonk)
  - 💊 Vitamins (Shiny Coat Sponsor)
  - 🏥 Vet Visits (Health Guardian)
- **Flexible Giving**: One-time or monthly subscription options
- **Progress Tracking**: Visual progress bars for each donation goal
- **Stripe Integration**: Secure payment processing (test mode)

### 🛍️ E-Commerce Shop
- **Category-Based Shopping**:
  - Apparel (shirts, hoodies, caps)
  - Cat Items (toys, litter, accessories)
  - Accessories (stickers, mugs, totes)
- **Quantity Selection**: Choose quantities (1-99) before adding to cart
- **Shopping Cart**: Full cart management with update/remove functionality
- **Stripe Checkout**: Secure order processing

### 👤 User Authentication
- User login and registration
- Profile management
- Session persistence
- Protected routes

### 🎨 Beautiful UI/UX
- Mobile-first responsive design
- Soft, pastel color palette
- Smooth animations and transitions
- Touch-friendly buttons and spacing
- Active navigation states
- Consistent design language throughout

---

## 🧱 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icon library
- **Context API** - State management (Cart, Auth)

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Stripe** - Payment processing (test mode)

---

## 📱 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero section, origin story, CTAs |
| Meet the Cats | `/cats` | 12 cat profiles with support buttons |
| Donate | `/donate` | Cat selection and donation options |
| Shop | `/shop` | Category overview |
| Apparel | `/shop/apparel` | Apparel products with quantity controls |
| Cat Items | `/shop/cat-items` | Cat items with quantity controls |
| Accessories | `/shop/accessories` | Accessories with quantity controls |
| Product Detail | `/shop/:productId` | Individual product pages |
| Cart | `/cart` | Shopping cart and checkout |
| About | `/about` | Brand story and information |
| Login | `/login` | User authentication |
| Sign Up | `/signup` | User registration |

---

## 🎨 Design Philosophy

### Visual Style
- **Cute & Soft**: Rounded cards, pastel colors, gentle shadows
- **Royal Elegance**: Crown motifs, regal color palette
- **Playful**: Fun animations, dramatic flair
- **Clean**: Modern typography, clear hierarchy

### Color Palette
- **Royal**: Primary brand color (deep purple/blue)
- **Banana**: Warm yellow tones for accents
- **Cream**: Soft background color
- **Blush**: Gentle pink highlights
- **Lilac**: Purple accents

### Responsive Breakpoints
- **Mobile**: < 640px (1 column layouts)
- **Tablet**: 640px - 1024px (2 column layouts)
- **Desktop**: > 1024px (3-4 column layouts)

---

## 🗄️ Database Models

### Cat
- Name, nickname, traits
- Personality description
- Fun facts and favorite things
- Image support

### Product
- Name, category, price
- Description and images
- Inventory tracking

### Donation
- Amount, frequency (one-time/monthly)
- Donation type and selected cat
- Stripe session tracking

### Order
- Items and quantities
- Total amount
- Stripe session ID
- Customer email

---

## 🔐 Authentication

- User registration and login
- Session management
- Protected routes
- Profile access
- Logout functionality

---

## 💳 Payment Integration

### Stripe (Test Mode)
- **Donations**: One-time and recurring subscriptions
- **Orders**: Product purchases
- Secure checkout sessions
- Success/cancel redirects

---

## 📦 Project Structure

```
BananaMeow/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context (Cart, Auth)
│   │   ├── content/        # Static content data
│   │   ├── lib/            # Utilities (API helpers)
│   │   └── assets/         # Static assets
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── config/         # Configuration (DB)
│   │   └── seed/           # Seed scripts
│   └── package.json
└── package.json            # Root package (concurrently)
```

---

## 🚀 Quick Start

For detailed setup instructions, see [SETUP.md](./SETUP.md)

**Quick commands:**
```bash
# Clone repository
git clone https://github.com/Coco120903/BananaMeow.git
cd BananaMeow

# Install dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# Set up environment variables (create backend/.env)
# See SETUP.md for details

# Run development servers
npm run dev
```

---

## 🛠️ Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend concurrently

### Frontend
- `npm run dev` - Start Vite dev server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start with nodemon (http://localhost:5000)
- `npm start` - Start production server
- `npm run seed:cats` - Seed database with cat data

---

## 🎯 Key Features Implemented

✅ Responsive mobile-first design  
✅ 12 cat profiles with individual support  
✅ Donation system with cat selection  
✅ E-commerce shop with categories  
✅ Quantity selection on product pages  
✅ Shopping cart functionality  
✅ User authentication (login/signup)  
✅ Stripe payment integration  
✅ Active navigation states  
✅ Image placeholders for cats and products  
✅ Footer always at bottom  
✅ Smooth animations and transitions  

---

## 📝 Content System

The platform includes a content management system for:
- Cat biographies and personalities
- Funny quotes from the royals
- Educational posts about British Shorthairs
- Meme-style captions

---

## 🔄 Workflows

### Donation Flow
1. User visits Meet the Cats page
2. Clicks "Support Me" on a cat
3. Redirected to Donate page with cat pre-selected
4. Selects donation type, frequency, and amount
5. Must select a cat before proceeding
6. Redirected to Stripe checkout
7. Returns after payment completion

### Shopping Flow
1. User browses shop categories
2. Clicks "View More" on a category
3. Views products with quantity controls
4. Selects quantity and adds to cart
5. Views cart and proceeds to checkout
6. Redirected to Stripe checkout
7. Returns after payment completion

---

## 🎨 Brand Identity

**Tone**: Funny + Cute + Royal + Slightly Dramatic  
**Tagline**: "Luxury cats with unemployed energy"  
**Personality**: Playful, regal, dramatic, and absolutely adorable

---

## 📄 License

This project is for educational/collaborative purposes.

---

## 👥 Contributors

Built with ❤️ for the 12 Chonky Royals 👑🐱

---

**For setup instructions, see [SETUP.md](./SETUP.md)**
